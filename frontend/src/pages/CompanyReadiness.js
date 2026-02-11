import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../config/api";

export default function CompanyReadiness(){

  const { name } = useParams();
  const [data,setData] = useState(null);

  useEffect(()=>{
    axios.get(`${API}/dashboard/company-readiness`)
      .then(r=>{
        const found = r.data.find(c => c.company === name);
        setData(found);
      });
  },[name]);

  if(!data) return <div style={{padding:30}}>Loading...</div>;

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
      marginBottom: 30
    },
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: 20,
      marginBottom: 30
    },
    summaryCard: {
      background: "linear-gradient(135deg, #1e3a8a, #1e293b)",
      padding: 20,
      borderRadius: 14,
      border: "1px solid #334155",
      textAlign: "center"
    },
    summaryNumber: {
      fontSize: 24,
      fontWeight: "700",
      color: "#93c5fd"
    },
    section: {
      background: "#1e293b",
      padding: 20,
      borderRadius: 14,
      border: "1px solid #334155",
      marginBottom: 25
    },
    gapItem: {
      marginBottom: 8,
      color: "#fca5a5"
    },
    skillBox: {
      background: "#0f172a",
      padding: 10,
      borderRadius: 8,
      marginBottom: 8,
      border: "1px solid #334155"
    },
    actionList: {
      lineHeight: 1.8
    }
  };

  return(
    <div>
      <Navbar/>

      <div style={styles.page}>
        <div style={styles.container}>

          <h1 style={styles.heading}>
            {data.company} Readiness Dashboard
          </h1>

          {/* ================= SUMMARY ================= */}
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryNumber}>{data.eligible}</div>
              <div>Students Eligible</div>
            </div>

            <div style={styles.summaryCard}>
              <div style={styles.summaryNumber}>{data.percent}%</div>
              <div>Campus Readiness</div>
            </div>
          </div>

          {/* ================= MAIN GAPS ================= */}
          <div style={styles.section}>
            <h2>Main Gaps</h2>
            <div style={styles.gapItem}>
              Below CGPA: {data.gaps.cgpa}
            </div>
            <div style={styles.gapItem}>
              Below Coding: {data.gaps.coding}
            </div>
          </div>

          {/* ================= MISSING SKILLS ================= */}
          <div style={styles.section}>
            <h3>Top Missing Skills</h3>

            {Object.entries(data.gaps.skills).map(([k,v])=>(
              <div key={k} style={styles.skillBox}>
                <b>{k}</b> → {v} students
              </div>
            ))}
          </div>

          {/* ================= RECOMMENDATION ================= */}
          <div style={styles.section}>
            <h2>Recommended Actions</h2>
            <ul style={styles.actionList}>
              <li>Focus training on top missing skills</li>
              <li>Improve coding preparation sessions</li>
              <li>Provide mentoring for near-eligible students</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}