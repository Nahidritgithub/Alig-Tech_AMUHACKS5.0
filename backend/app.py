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


# ---------------- ADD STUDENT ----------------
@app.route("/students", methods=["POST"])
def add_student():
    students.insert_one(request.json)
    return jsonify({"msg": "added"})


# ---------------- GET STUDENTS ----------------
@app.route("/students", methods=["GET"])
def get_students():
    out = []
    for s in students.find():
        s["_id"] = str(s["_id"])
        out.append(s)
    return jsonify(out)

@app.route("/students/<id>", methods=["PUT"])
def update_student(id):
    data = request.json

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



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
