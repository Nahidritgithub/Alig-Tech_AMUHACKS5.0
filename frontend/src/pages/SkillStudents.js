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

  }, [location.search, skills, minCgpa, coding, aptitude, department]);

  // ======================= STYLES =======================
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#0f172a",
      padding: 30,
      color: "#e2e8f0",
      fontFamily: "'Poppins', sans-serif"
    },
    heading: {
      textAlign: "center",
      fontSize: 28,
      fontWeight: "700",
      marginBottom: 25
    },
    filterBox: {
      maxWidth: 800,
      margin: "0 auto 30px auto",
      padding: 20,
      borderRadius: 12,
      background: "#1e293b",
      border: "1px solid #334155"
    },
    total: {
      textAlign: "center",
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 25
    },
    grid: {
      maxWidth: 1000,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 20
    },
    card: {
      background: "#1e3a8a",
      padding: 20,
      borderRadius: 14,
      border: "1px solid #2563eb",
      boxShadow: "0 6px 18px rgba(0,0,0,0.4)"
    },
    name: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 6
    },
    dept: {
      fontSize: 14,
      color: "#93c5fd",
      marginBottom: 10
    },
    info: {
      fontSize: 14,
      lineHeight: 1.6
    },
    empty: {
      textAlign: "center",
      color: "#94a3b8",
      marginTop: 40
    }
  };

  return (
    <div>
      <Navbar />

      <div style={styles.page}>
        <h1 style={styles.heading}>Eligible Students</h1>

        {/* FILTER SUMMARY */}
        <div style={styles.filterBox}>
          <p><b>Skills:</b> {skills || "-"}</p>
          <p><b>CGPA ≥</b> {minCgpa || "-"}</p>
          <p><b>Coding ≥</b> {coding || "-"}</p>
          <p><b>Aptitude ≥</b> {aptitude || "-"}</p>
          <p><b>Department:</b> {department || "-"}</p>
        </div>

        <div style={styles.total}>Total Eligible Students: {students.length}</div>

        {/* LIST */}
        {students.length === 0 && (
          <div style={styles.empty}>No students match the selected criteria.</div>
        )}

        <div style={styles.grid}>
          {students.map(s => (
            <div key={s._id} style={styles.card}>
              <div style={styles.name}>{s.name}</div>
              <div style={styles.dept}>{s.department}</div>

              <div style={styles.info}>
                <b>Roll No:</b> {s.roll_no} <br />
                <b>CGPA:</b> {s.cgpa} <br />
                <b>Coding:</b> {s.coding_score} <br />
                <b>Aptitude:</b> {s.aptitude_score} <br />
                <b>Communication:</b> {s.communication_score} <br />
                <b>Internships:</b> {s.internships} <br />
                <b>Projects:</b> {s.projects} <br />
                <b>Skills:</b> {s.skills.join(", ")}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}