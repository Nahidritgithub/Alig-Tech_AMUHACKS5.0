import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../config/api";

export default function CompanyReport() {

  const { id } = useParams();

  const [data, setData] = useState(null);
  const [department, setDepartment] = useState("");   // ⭐ NEW



  // =================================================
  // LOAD DATA
  // =================================================
  useEffect(() => {
    axios.get(`${API}/company/${id}/eligible`, {
      params: { department }
    })
      .then(r => setData(r.data));
  }, [id, department]); 



  if (!data) return <div>Loading...</div>;



  return (
    <div>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h1>{data.company} – {data.role}</h1>



        {/* ================================================= */}
        {/* DEPARTMENT FILTER */}
        {/* ================================================= */}
        <div style={{ marginBottom: 15 }}>
          <b>Filter by Department: </b>

          <select
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



        <h2>Eligibility Result</h2>
        <p><b>Students Eligible:</b> {data.count}</p>
        <p><b>Campus Percentage:</b> {data.percent}%</p>



        {/* ================================================= */}
        {/* STUDENT LIST */}
        {/* ================================================= */}
        <h3>Eligible Students</h3>

        {data.students.length === 0 && <p>No students found.</p>}

        {data.students.map(s => (
          <div key={s._id} style={{
            border: "1px solid",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            background: "#f8fafc"
          }}>
            <b>{s.name}</b> – {s.department}
            <br />
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
  );
}