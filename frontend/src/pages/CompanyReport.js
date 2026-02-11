import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../config/api";

export default function CompanyReport() {

  const { id } = useParams();

  const [data, setData] = useState(null);
  const [department, setDepartment] = useState("");

  useEffect(() => {
    axios.get(`${API}/company/${id}/eligible`, {
      params: { department }
    })
      .then(r => setData(r.data));
  }, [id, department]);

  if (!data) return <div style={{ padding: 30 }}>Loading...</div>;

  // ======================= STYLES =======================
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#0f172a",
      padding: 30,
      color: "#e2e8f0",
      fontFamily: "'Poppins', sans-serif"
    },
    container: {
      maxWidth: 1100,
      margin: "0 auto"
    },
    heading: {
      textAlign: "center",
      fontSize: 28,
      fontWeight: "700",
      marginBottom: 25
    },
    filterBox: {
      marginBottom: 25,
      padding: 15,
      background: "#1e293b",
      borderRadius: 10,
      border: "1px solid #334155"
    },
    select: {
      padding: "8px 12px",
      borderRadius: 6,
      border: "1px solid #334155",
      background: "#0f172a",
      color: "#e2e8f0",
      marginLeft: 10
    },
    summaryCard: {
      display: "flex",
      justifyContent: "space-between",
      background: "linear-gradient(135deg, #1e3a8a, #1e293b)",
      padding: 20,
      borderRadius: 12,
      marginBottom: 30,
      border: "1px solid #334155"
    },
    summaryItem: {
      textAlign: "center"
    },
    summaryNumber: {
      fontSize: 22,
      fontWeight: "700",
      color: "#93c5fd"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 20
    },
    card: {
      background: "#1e293b",
      padding: 18,
      borderRadius: 14,
      border: "1px solid #334155",
      boxShadow: "0 6px 20px rgba(0,0,0,0.4)"
    },
    studentName: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      color: "#60a5fa"
    },
    empty: {
      textAlign: "center",
      color: "#94a3b8"
    }
  };

  return (
    <div>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.container}>

          <h1 style={styles.heading}>
            {data.company} – {data.role}
          </h1>

          {/* ================= FILTER ================= */}
          <div style={styles.filterBox}>
            <b>Filter by Department:</b>

            <select
              style={styles.select}
              value={department}
              onChange={e => setDepartment(e.target.value)}
            >
              <option value="">All</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
            </select>
          </div>

          {/* ================= SUMMARY ================= */}
          <div style={styles.summaryCard}>
            <div style={styles.summaryItem}>
              <div style={styles.summaryNumber}>{data.count}</div>
              <div>Students Eligible</div>
            </div>

            <div style={styles.summaryItem}>
              <div style={styles.summaryNumber}>{data.percent}%</div>
              <div>Campus Percentage</div>
            </div>
          </div>

          {/* ================= STUDENT LIST ================= */}
          <h2 style={{ marginBottom: 15 }}>Eligible Students</h2>

          {data.students.length === 0 && (
            <div style={styles.empty}>No students found.</div>
          )}

          <div style={styles.grid}>
            {data.students.map(s => (
              <div key={s._id} style={styles.card}>
                <div style={styles.studentName}>
                  {s.name} – {s.department}
                </div>

                Roll No: {s.roll_no || "-"}
                <br />
                CGPA: {s.cgpa}
                <br />
                Coding: {s.coding_score}
                <br />
                Aptitude: {s.aptitude_score}
                <br />
                Skills: {s.skills.join(", ")}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}