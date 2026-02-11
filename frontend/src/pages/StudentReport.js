import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../config/api";

export default function StudentReport() {

  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API}/predict/${id}`)
      .then(r => setData(r.data));
  }, [id]);

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
      marginBottom: 30
    },
    container: {
      maxWidth: 1000,
      margin: "0 auto"
    },
    card: {
      background: "linear-gradient(135deg, #1e293b, #1e3a8a)",
      border: "1px solid #334155",
      padding: 25,
      marginBottom: 25,
      borderRadius: 16,
      boxShadow: "0 8px 25px rgba(0,0,0,0.4)"
    },
    company: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 10,
      color: "#93c5fd"
    },
    probability: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 15
    },
    section: {
      marginTop: 15,
      padding: 15,
      borderRadius: 10,
      background: "#0f172a",
      border: "1px solid #334155"
    },
    strongText: {
      color: "#22c55e",
      fontWeight: "500",
      marginTop: 5
    },
    gapText: {
      color: "#ef4444",
      fontWeight: "500",
      marginTop: 5
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
        <h1 style={styles.heading}>Placement Prediction Report</h1>

        <div style={styles.container}>

          {data.length === 0 && (
            <div style={styles.empty}>No prediction data available.</div>
          )}

          {data.map((c, index) => (
            <div key={index} style={styles.card}>

              <div style={styles.company}>{c.company}</div>

              <div style={styles.probability}>
                Shortlist Probability: <b>{c.probability}%</b>
              </div>

              {/* ================= STRONG ================= */}
              <div style={styles.section}>
                <h4>Strong Areas</h4>

                {c.strong.length === 0 && <p>None</p>}

                {c.strong.map((s, i) => (
                  <div key={i} style={styles.strongText}>
                    ✔ {s}
                  </div>
                ))}
              </div>

              {/* ================= GAPS ================= */}
              <div style={styles.section}>
                <h4>Needs Improvement</h4>

                {c.gaps.length === 0 && (
                  <div style={styles.strongText}>Perfect Match 🎯</div>
                )}

                {c.gaps.map((g, i) => (
                  <div key={i} style={styles.gapText}>
                    ❌ {g}
                  </div>
                ))}
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}