from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from readiness import readiness
from predictor import predict, analyze_gaps

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb+srv://cpris:mkIDKy0hrI3qmMZZ@cluster0.riht4km.mongodb.net/?appName=Cluster0")
db = client["cpris"]

students = db.students
companies = db.companies


# ---------------- HOME ----------------
@app.route("/")
def home():
    return "CPRIS Running 🚀"


# ---------------- ADD STUDENT ---------------
@app.route("/students", methods=["POST"])
def add_student():
    data = request.json

    # -------- auto register skills --------
    for skill in data.get("skills", []):
        exists = db.skills.find_one({"name": skill})
        if not exists:
            db.skills.insert_one({"name": skill})

    students.insert_one(data)

    return jsonify({"msg": "student added"})


# ---------------- GET STUDENTS ----------------
@app.route("/students", methods=["GET"])
def get_students():
    out = []
    for s in students.find():
        s["_id"] = str(s["_id"])
        out.append(s)
    return jsonify(out)

# ---------------- UPDATE STUDENT ----------------
@app.route("/students/<id>", methods=["PUT"])
def update_student(id):
    data = request.json

    # auto add skills
    for skill in data.get("skills", []):
        exists = db.skills.find_one({"name": skill})
        if not exists:
            db.skills.insert_one({"name": skill})

    students.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )

    return jsonify({"msg": "student updated"})


# ---------------- DELETE STUDENT ----------------
@app.route("/students/<id>", methods=["DELETE"])
def delete_student(id):
    students.delete_one({"_id": ObjectId(id)})
    return jsonify({"msg": "deleted"})


# ---------------- STUDENT REPORT ----------------
@app.route("/student/<id>", methods=["GET"])
def student_report(id):
    s = students.find_one({"_id": ObjectId(id)})

    prob = model.predict_proba([[
        s["cgpa"],
        s["coding_score"],
        s["aptitude_score"],
        s["projects"],
        s["internships"]
    ]])[0][1]

    return jsonify({
        "name": s["name"],
        "department": s["department"],
        "readiness": readiness(s),
        "probability": round(prob * 100, 2),
        "skills": s["skills"]
    })


# ---------------- ADD COMPANY ----------------
@app.route("/companies", methods=["POST"])
def add_company():

    data = request.json

    # -------- auto register skills --------
    for skill in data.get("skills", []):
        exists = db.skills.find_one({"name": skill})
        if not exists:
            db.skills.insert_one({"name": skill})

    res = companies.insert_one(data)

    return jsonify({
        "msg": "company added",
        "id": str(res.inserted_id)
    })

# ---------------- GET COMPANIES ----------------
@app.route("/companies", methods=["GET"])
def get_companies():
    result = []
    for c in companies.find():
        c["_id"] = str(c["_id"])
        result.append(c)
    return jsonify(result)


# ---------------- UPDATE COMPANY ----------------
@app.route("/companies/<id>", methods=["PUT"])
def update_company(id):

    data = request.json

    # -------- auto register skills --------
    for skill in data.get("skills", []):
        exists = db.skills.find_one({"name": skill})
        if not exists:
            db.skills.insert_one({"name": skill})

    companies.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )

    return jsonify({"msg": "company updated"})


# ---------------- DELETE COMPANY ----------------
@app.route("/companies/<id>", methods=["DELETE"])
def delete_company(id):
    companies.delete_one({"_id": ObjectId(id)})
    return jsonify({"msg": "deleted"})


# ---------------- COMPANY ANALYSIS ----------------
@app.route("/analyze/company/<name>")
def analyze_company(name):

    c = companies.find_one({"name": name})

    if not c:
        return jsonify({"error": "Company not found"}), 404

    total = students.count_documents({})
    ready = 0
    gaps = {}

    for s in students.find():

        ok = True

        if s["cgpa"] < c["min_cgpa"]:
            ok = False

        if s["coding_score"] < c["coding_cutoff"]:
            ok = False

        if s["aptitude_score"] < c.get("aptitude_cutoff", 0):
            ok = False

        for skill in c["skills"]:
            if skill not in s["skills"]:
                gaps[skill] = gaps.get(skill, 0) + 1
                ok = False

        if ok:
            ready += 1

    percent = round((ready/total)*100,2) if total else 0

    return jsonify({
        "company": c["name"],
        "eligible": ready,
        "percent": percent,
        "gaps": gaps
    })

@app.route("/dashboard/summary")
def dashboard_summary():

    skill_stats = {}
    company_stats = []

    total = students.count_documents({})

    # ---------- skill readiness ----------
    for s in students.find():
        for skill in s["skills"]:
            skill_stats[skill] = skill_stats.get(skill, 0) + 1

    skill_percent = []
    for k,v in skill_stats.items():
        skill_percent.append({
            "skill": k,
            "percent": round((v/total)*100,2)
        })


    # ---------- company readiness ----------
    for c in companies.find():
        ready = 0

        for s in students.find():
            if s["cgpa"] >= c["min_cgpa"] and s["coding_score"] >= c["coding_cutoff"] and s["aptitude_score"] >= c.get("aptitude_cutoff", 0):
                if set(c["skills"]).issubset(set(s["skills"])):
                    ready += 1

        company_stats.append({
            "company": c["name"],
            "percent": round((ready/total)*100,2)
        })


    return jsonify({
        "skills": skill_percent,
        "companies": company_stats
    })

@app.route("/skills", methods=["POST"])
def add_skill():
    res = db.skills.insert_one(request.json)
    return jsonify({"msg": "skill added", "id": str(res.inserted_id)})


@app.route("/skills", methods=["GET"])
def get_skills():
    out = []
    for s in db.skills.find():
        s["_id"] = str(s["_id"])
        out.append(s)
    return jsonify(out)


@app.route("/skills/<id>", methods=["PUT"])
def update_skill(id):
    db.skills.update_one(
        {"_id": ObjectId(id)},
        {"$set": request.json}
    )
    return jsonify({"msg": "updated"})


@app.route("/skills/<id>", methods=["DELETE"])
def delete_skill(id):
    db.skills.delete_one({"_id": ObjectId(id)})
    return jsonify({"msg": "deleted"})

@app.route("/dashboard/skill/<skill>")
def skill_dashboard(skill):

    total_students = students.count_documents({})
    have_skill = students.count_documents({"skills": skill})

    total_companies = companies.count_documents({})
    company_need = companies.count_documents({"skills": skill})

    return jsonify({
        "skill": skill,
        "students_percent": round((have_skill/total_students)*100,2) if total_students else 0,
        "companies_need": company_need,
        "total_companies": total_companies
    })

@app.route("/dashboard/skills")
def skills_dashboard():

    skills_param = request.args.get("skills", "")
    min_cgpa = request.args.get("min_cgpa") or 0
    coding = request.args.get("coding") or 0
    aptitude = request.args.get("aptitude") or 0
    department = request.args.get("department", "").lower() or None

    # convert numbers safely
    min_cgpa = float(min_cgpa) if min_cgpa else None
    coding = float(coding) if coding else None
    aptitude = float(aptitude) if aptitude else None

    # make skills list
    skills = [s.strip().lower() for s in skills_param.split(",") if s.strip()]

    total = students.count_documents({})
    matched_students = 0


    # =================================================
    # STUDENT FILTERING
    # =================================================
    for s in students.find():

        # CGPA
        if min_cgpa is not None and s.get("cgpa", 0) < min_cgpa:
            continue

        if department and s.get("department", "").lower() != department:
           continue

        # Coding
        if coding is not None and s.get("coding_score", 0) < coding:
            continue

        # Aptitude 
        if aptitude is not None and s.get("aptitude_score", 0) < aptitude:
            continue

        # Skills
        if skills:
            student_skills = [x.lower() for x in s.get("skills", [])]

            if not any(skill in student_skills for skill in skills):
                continue

        matched_students += 1


    percent = round((matched_students / total) * 100, 2) if total else 0


    # =================================================
    # COMPANIES REQUIRING THESE SKILLS
    # =================================================
    companies_list = []

    for c in companies.find():

        # CGPA check
        if min_cgpa is not None and c.get("min_cgpa", 0) > min_cgpa:
            continue

        # Coding check
        if coding is not None and c.get("coding_cutoff", 0) > coding:
            continue

        # Aptitude check
        if aptitude is not None and c.get("aptitude_cutoff", 0) > aptitude:
            continue

        # Skill match (optional)
        if skills:
            company_skills = [x.lower() for x in c.get("skills", [])]
            if not any(skill in company_skills for skill in skills):
                continue


        companies_list.append({
            "id": str(c["_id"]),
            "name": c.get("name"),
            "role": c.get("role"),
            "cgpa": c.get("min_cgpa"),
            "coding": c.get("coding_cutoff"),
            "aptitude": c.get("aptitude_cutoff")
        })


    return jsonify({
        "skills": skills,
        "students_count": matched_students,
        "students_percent": percent,
        "companies_need": companies_list
    })

@app.route("/dashboard/skill-distribution")
def skill_distribution():

    department = request.args.get("department", "") or None

    # base filter for students
    student_filter = {}
    if department:
        student_filter["department"] = department

    total = students.count_documents(student_filter)

    result = []

    for sk in db.skills.find():
        name = sk["name"]

        # add skill condition
        skill_filter = dict(student_filter)
        skill_filter["skills"] = name

        count = students.count_documents(skill_filter)

        result.append({
            "skill": name,
            "count": count,
            "percent": round((count / total) * 100, 2) if total else 0
        })

    return jsonify(result)

@app.route("/dashboard/company-readiness")
def company_readiness():

    total_students = students.count_documents({})
    result = []

    for c in companies.find():

        eligible = 0
        gaps = {
            "cgpa": 0,
            "coding": 0,
            "skills": {}
        }

        for s in students.find():

            ok = True

            # cgpa
            if s["cgpa"] < c["min_cgpa"]:
                gaps["cgpa"] += 1
                ok = False

            # coding
            if s["coding_score"] < c["coding_cutoff"]:
                gaps["coding"] += 1
                ok = False

            if s["aptitude_score"] < c.get("aptitude_cutoff", 0):
                gaps["aptitude"] = gaps.get("aptitude", 0) + 1
                ok = False

            # skills
            for skill in c["skills"]:
                if skill not in s["skills"]:
                    gaps["skills"][skill] = gaps["skills"].get(skill, 0) + 1
                    ok = False

            if ok:
                eligible += 1


        percent = round((eligible / total_students) * 100, 2) if total_students else 0

        result.append({
            "company": c["name"],
            "eligible": eligible,
            "percent": percent,
            "gaps": gaps,
            "id": str(c["_id"])
        })

    return jsonify(result)


@app.route("/company/<id>/eligible")
def company_eligible(id):

    department = request.args.get("department", "") or None

    try:
        company = companies.find_one({"_id": ObjectId(id)})
        if not company:
            return jsonify({"error": "Company not found"}), 404
    except:
        return jsonify({"error": "Invalid id"}), 400


    total = students.count_documents({})
    eligible = []

    for s in students.find():

        if department and s.get("department", "") != department:
              continue
        
        if s.get("cgpa", 0) < company.get("min_cgpa", 0):
            continue

        if s.get("coding_score", 0) < company.get("coding_cutoff", 0):
            continue

        if s.get("aptitude_score", 0) < company.get("aptitude_cutoff", 0):
            continue

        student_skills = set([x.lower() for x in s.get("skills", [])])
        company_skills = set([x.lower() for x in company.get("skills", [])])

        if not company_skills.issubset(student_skills):
            continue

        s["_id"] = str(s["_id"])
        eligible.append(s)


    percent = round((len(eligible) / total) * 100, 2) if total else 0


    return jsonify({
        "company": company["name"],
        "role": company.get("role"),
        "count": len(eligible),
        "percent": percent,
        "students": eligible
    })


@app.route("/dashboard/focus-analysis")
def focus_analysis():

    result = {}

    # =================================================
    # OVERALL ANALYSIS
    # =================================================
    all_students = list(students.find())
    total = len(all_students)

    if total == 0:
        return jsonify({})

    avg_coding = sum(s.get("coding_score", 0) for s in all_students) / total
    avg_aptitude = sum(s.get("aptitude_score", 0) for s in all_students) / total
    avg_cgpa = sum(s.get("cgpa", 0) for s in all_students) / total

    result["overall"] = {
        "coding": round(avg_coding, 1),
        "aptitude": round(avg_aptitude, 1),
        "cgpa": round(avg_cgpa, 1)
    }


    # =================================================
    # DEPARTMENT WISE
    # =================================================
    departments = students.distinct("department")
    dept_result = []

    for dept in departments:

        stu = list(students.find({"department": dept}))
        t = len(stu)
        if t == 0:
            continue

        coding = sum(s.get("coding_score", 0) for s in stu) / t
        aptitude = sum(s.get("aptitude_score", 0) for s in stu) / t
        cgpa = sum(s.get("cgpa", 0) for s in stu) / t

        # skill gaps
        weak_skills = []

        for sk in db.skills.find():
            name = sk["name"]

            count = students.count_documents({
                "department": dept,
                "skills": name
            })

            percent = (count / t) * 100
            demand = companies.count_documents({"skills": name})

            if percent < 40 and demand > 0:
                weak_skills.append(name)

        dept_result.append({
            "name": dept,
            "coding": round(coding, 1),
            "aptitude": round(aptitude, 1),
            "cgpa": round(cgpa, 1),
            "weak_skills": weak_skills
        })

    result["departments"] = dept_result

    return jsonify(result)


@app.route("/predict/<student_id>")
def predict_student(student_id):

    s = students.find_one({"_id": ObjectId(student_id)})
    if not s:
        return jsonify({"error": "student not found"}), 404

    all_skills = [x["name"] for x in db.skills.find()]

    output = []

    for c in companies.find():

        prob = predict(c["name"], s, all_skills)
        if prob is None:
            continue

        strong, gaps = analyze_gaps(s, c)

        output.append({
            "company": c["name"],
            "role": c.get("role"),
            "probability": prob,
            "strong": strong,
            "gaps": gaps
        })

    return jsonify(output)

@app.get("/health")
def health():
    return {"status": "ok"}



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
