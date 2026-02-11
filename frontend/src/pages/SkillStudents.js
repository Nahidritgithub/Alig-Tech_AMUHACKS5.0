import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../config/api";

export default function SkillStudents() {

  const location = useLocation();
  const [students, setStudents] = useState([]);



  // =================================================
  // READ FILTERS FROM URL
  // =================================================
  const params = new URLSearchParams(location.search);

  const skills = params.get("skills") || "";
  const minCgpa = params.get("cgpa") || "";
  const coding = params.get("coding") || "";
  const aptitude = params.get("aptitude") || "";
  const department = params.get("department") || "";



  // =================================================
  // LOAD + FILTER
  // =================================================
  useEffect(() => {

    axios.get(`${API}/students`)
      .then(r => {

        const skillArray = skills
          .split(",")
          .map(s => s.trim().toLowerCase())
          .filter(Boolean);

        const filtered = r.data.filter(s => {

          if (minCgpa && s.cgpa < Number(minCgpa)) return false;
          if (coding && s.coding_score < Number(coding)) return false;
          if (aptitude && s.aptitude_score < Number(aptitude)) return false;
          if (department && s.department !== department) return false;

          if (skillArray.length > 0) {
            const studentSkills = s.skills.map(x => x.toLowerCase());

            if (!skillArray.some(skill => studentSkills.includes(skill))) {
              return false;
            }
          }

          return true;
        });

        setStudents(filtered);
      });

  }, [location.search]);



  return (
    <div>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h1>Eligible Students</h1>

        {/* FILTER SUMMARY */}
        <div style={{ marginBottom: 15 }}>
          <p><b>Skills:</b> {skills || "-"}</p>
          <p><b>CGPA ≥</b> {minCgpa || "-"}</p>
          <p><b>Coding ≥</b> {coding || "-"}</p>
          <p><b>Aptitude ≥</b> {aptitude || "-"}</p>
        </div>

        <h3>Total: {students.length}</h3>



        {/* LIST */}
        {students.map(s => (
          <div key={s._id} style={{
            border: "1px solid",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8
          }}>
            <b>{s.name}</b> – {s.department}
            <br />
            Roll No: {s.roll_no}
            <br />
            <br />
            CGPA: {s.cgpa}
            <br />
            Coding: {s.coding_score}
            <br />
            Aptitude: {s.aptitude_score}
            <br />
            Communication: {s.communication_score}
            <br />
            Internships: {s.internships}
            <br />
            Projects: {s.projects}
            <br />
            Skills: {s.skills.join(", ")}
          </div>
        ))}
      </div>
    </div>
  );
}
