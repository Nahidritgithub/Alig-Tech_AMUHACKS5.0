# 🎓 Campus Placement & Readiness Intelligence System (CPRIS)

An AI-powered analytics platform that helps **placement cells, students, and institutes** understand campus readiness, skill gaps, and company eligibility.

The system converts raw student data into **actionable insights**, predicts shortlisting chances, and highlights where training efforts should be focused.

---

## 🚀 Problem Statement

Placement teams often struggle to answer:

- Which students are eligible for which companies?
- Which skills are lacking across departments?
- Where should training be focused?
- What is the probability of a student getting shortlisted?

CPRIS automates this using **data analytics + machine learning**.

---

## 🎯 Features

### 👨‍🎓 Student Management
- Add / update / delete students
- Track roll number, department
- Store CGPA, coding, aptitude, communication
- Record internships & projects
- Multiple skills tagging
- Individual student report

### 🏢 Company Requirement Manager
- Add company hiring criteria
- Minimum CGPA
- Coding cutoff
- Aptitude cutoff
- Required skills
- Role definitions

### 🧠 Skill Management
- Central skill repository
- Auto-add skills when entered in student/company forms

### 📊 Placement Intelligence Dashboard
- Campus skill distribution
- Skill availability %
- Recruiter simulation
- Department-wise filtering
- Case-insensitive skill search
- CGPA / coding / aptitude filters

### 🎯 Recruiter Simulation
Shows instantly:
- Number of eligible students
- Percentage of campus
- Companies demanding those skills

### 📉 Skill Gap Analysis
- Identify shortage skills
- Focus areas for training
- Department-specific gaps

### 🏢 Company Readiness
For each company:
- Eligible students count
- Eligibility %
- List of qualified candidates

### 🤖 ML Shortlist Prediction
- Predicts probability of selection
- Shows strengths
- Highlights weak areas
- Detects missing skills

---

## 🧠 Machine Learning

Each company has its own model trained from historical data.

Prediction considers:
- CGPA  
- Coding score  
- Aptitude score  
- Internships  
- Projects  
- Skill match  

Output:
- **Shortlist Probability %**
- **Strong Areas**
- **Gap Areas**
- **Missing Skills**


---

## 💻 Tech Stack

### Frontend
- React
- Axios
- Recharts
- React Router

### Backend
- Flask
- MongoDB
- PyMongo
- Flask-CORS

### Machine Learning
- Scikit-learn
- Logistic Regression
- Pandas
- Joblib

### Deployment
- Railway (Backend)
- Vercel (Frontend)

---

## ⚙ Local Setup

### 1️⃣ Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py

Backend runs at : http://localhost:5000

---

## 2️⃣ Frontend

```bash
cd frontend
npm install
npm start
Frontend runs at http://localhost:3000

---

## 🧪 Train ML Models

Place the historical dataset in:


Run: python train.py

Models will be saved inside:

backend/models/




