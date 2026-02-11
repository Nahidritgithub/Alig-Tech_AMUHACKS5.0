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

  return (
    <div>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h1>Placement Prediction</h1>

        {data.length === 0 && <p>No prediction data.</p>}

        {data.map((c, index) => (
          <div key={index} style={{
            border: "1px solid #333",
            padding: 15,
            marginBottom: 15,
            borderRadius: 8,
            background: "#f8fafc"
          }}>
            <h2>{c.company}</h2>

            <h3>
              Shortlist Chance: <b>{c.probability}%</b>
            </h3>


            {/* ================= STRONG ================= */}
            <div style={{ marginTop: 10 }}>
              <h4>Strong Areas</h4>

              {c.strong.length === 0 && <p>None</p>}

              {c.strong.map((s, i) => (
                <div key={i} style={{ color: "green" }}>
                  ✔ {s}
                </div>
              ))}
            </div>


            {/* ================= GAPS ================= */}
            <div style={{ marginTop: 10 }}>
              <h4>Needs Improvement</h4>

              {c.gaps.length === 0 && (
                <div style={{ color: "green" }}>Perfect Match 🎯</div>
              )}

              {c.gaps.map((g, i) => (
                <div key={i} style={{ color: "red" }}>
                  ❌ {g}
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
