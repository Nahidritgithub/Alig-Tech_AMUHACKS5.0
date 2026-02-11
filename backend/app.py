from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from model import load_model
from readiness import readiness

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["cpris"]

students = db.students
companies = db.companies

model = load_model()


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
@app.route("/analyze/company/<id>", methods=["GET"])
def analyze_company(id):
    c = companies.find_one({"_id": ObjectId(id)})

    total = students.count_documents({})
    ready = 0
    gaps = {}

    for s in students.find():
        if s["cgpa"] >= c["min_cgpa"] and s["coding_score"] >= c["coding_cutoff"]:
            matched = set(s["skills"]).intersection(set(c["skills"]))

            if len(matched) == len(c["skills"]):
                ready += 1
            else:
                for skill in c["skills"]:
                    if skill not in matched:
                        gaps[skill] = gaps.get(skill, 0) + 1

    return jsonify({
        "company": c["name"],
        "ready_percent": round((ready / total) * 100, 2),
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
            if s["cgpa"] >= c["min_cgpa"] and s["coding_score"] >= c["coding_cutoff"]:
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
def multi_skill_dashboard():

    skills = request.args.get("skills")  # "DSA,React"

    if not skills:
        return jsonify({})

    skills = [s.strip() for s in skills.split(",")]

    total_students = students.count_documents({})

    # students having ANY skill
    matched_students = list(students.find({
        "skills": {"$in": skills}
    }))

    for s in matched_students:
        s["_id"] = str(s["_id"])

    count = len(matched_students)
    percent = round((count / total_students) * 100, 2) if total_students else 0

    # companies requiring ANY skill
    company_need = companies.count_documents({
        "skills": {"$in": skills}
    })

    return jsonify({
        "skills": skills,
        "students_count": count,
        "students_percent": percent,
        "companies_need": company_need,
        "students": matched_students
    })


@app.route("/dashboard/skill-distribution")
def skill_distribution():

    total = students.count_documents({})
    result = []

    for sk in db.skills.find():
        name = sk["name"]
        count = students.count_documents({"skills": name})

        result.append({
            "skill": name,
            "count": count,
            "percent": round((count/total)*100,2) if total else 0
        })

    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
