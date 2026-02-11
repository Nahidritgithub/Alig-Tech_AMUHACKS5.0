import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const API = "http://localhost:5000";

export default function Dashboard() {

  const [students, setStudents] = useState([]);
  const [skillsChart, setSkillsChart] = useState([]);
  const [companyChart, setCompanyChart] = useState([]);
  const [distribution, setDistribution] = useState([]);

  const [search, setSearch] = useState("");
  const [skillStats, setSkillStats] = useState(null);


  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    axios.get(`${API}/students`).then(r => setStudents(r.data));

    axios.get(`${API}/dashboard/summary`).then(r => {
      setSkillsChart(r.data.skills);
      setCompanyChart(r.data.companies);
    });

    axios.get(`${API}/dashboard/skill-distribution`)
      .then(r => setDistribution(r.data));

  }, []);



  // ---------------- MULTI SKILL FILTER ----------------
  const skillArray = search
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  const filtered = students.filter(s =>
    skillArray.length === 0 ||
    s.skills.some(skill =>
      skillArray.includes(skill.toLowerCase())
    )
  );



  // ---------------- LOAD INTELLIGENCE ----------------
  useEffect(() => {
    if (skillArray.length > 0) {
      axios.get(`${API}/dashboard/skills?skills=${search}`)
        .then(r => setSkillStats(r.data))
        .catch(() => setSkillStats(null));
    } else {
      setSkillStats(null);
    }
  }, [search]);



  // ---------------- shortage logic ----------------
  const getStatus = () => {
    if (!skillStats) return "";
    if (skillStats.students_percent < 40) return "🔴 High Shortage";
    if (skillStats.students_percent < 70) return "🟡 Moderate";
    return "🟢 Good";
  };



  return (
    <div>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h1>Placement Intelligence Dashboard</h1>



        {/* ================================================= */}
        {/* SEARCH */}
        {/* ================================================= */}
        <div style={{ marginBottom: 20 }}>
          <input
            placeholder="Search skills (DSA, React)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 350 }}
          />
        </div>



        {/* ================================================= */}
        {/* SKILL INSIGHT */}
        {/* ================================================= */}
        {skillStats && (
          <div style={{
            border: "2px solid #444",
            padding: 15,
            marginBottom: 20,
            background: "#f1f5f9"
          }}>
            <h2>Selected Skill Analysis</h2>
            <p><b>Skills:</b> {skillStats.skills.join(", ")}</p>
            <p><b>Students matched:</b> {skillStats.students_count}</p>
            <p><b>Campus %:</b> {skillStats.students_percent}</p>
            <p><b>Companies requiring:</b> {skillStats.companies_need}</p>
            <p><b>Status:</b> {getStatus()}</p>
          </div>
        )}



        {/* ================================================= */}
        {/* STUDENTS */}
        {/* ================================================= */}
        <h2>Matching Students ({filtered.length})</h2>

        {filtered.map(s => (
          <div key={s._id} style={{
            border: "1px solid",
            margin: 5,
            padding: 5
          }}>
            {s.name} – {s.department}
            <br />
            CGPA: {s.cgpa}
            <br />
            Skills: {s.skills.join(", ")}
          </div>
        ))}



        {/* ================================================= */}
        {/* CAMPUS SKILL DISTRIBUTION */}
        {/* ================================================= */}
        <h2>Campus Skill Distribution</h2>

        <BarChart width={700} height={300} data={distribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="skill" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percent" />
        </BarChart>

        <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Students</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {distribution.map(d => (
              <tr key={d.skill}>
                <td>{d.skill}</td>
                <td>{d.count}</td>
                <td>{d.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>



        {/* ================================================= */}
        {/* SKILL AVAILABILITY */}
        {/* ================================================= */}
        <h2>Overall Skill Availability</h2>

        <BarChart width={700} height={300} data={skillsChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="skill" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percent" />
        </BarChart>



        {/* ================================================= */}
        {/* COMPANY READINESS */}
        {/* ================================================= */}
        <h2>Company Readiness</h2>

        <BarChart width={700} height={300} data={companyChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="company" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percent" />
        </BarChart>

      </div>
    </div>
  );
}
