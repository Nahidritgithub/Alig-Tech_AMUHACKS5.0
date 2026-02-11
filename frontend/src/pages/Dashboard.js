import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, LabelList
} from "recharts";
import { API } from "../config/api";

export default function Dashboard() {

  const navigate = useNavigate();

  const [distribution, setDistribution] = useState([]);
  const [companyReadiness, setCompanyReadiness] = useState([]);
  const [focus, setFocus] = useState(null);


  const [search, setSearch] = useState("");
  const [minCgpa, setMinCgpa] = useState("");
  const [minCoding, setMinCoding] = useState("");
  const [minAptitude, setMinAptitude] = useState("");

  const [department, setDepartment] = useState("");  

  const [skillStats, setSkillStats] = useState(null);



  // =================================================
  // LOAD INITIAL DATA
  // =================================================
  useEffect(() => {

    axios.get(`${API}/dashboard/company-readiness`)
      .then(r => setCompanyReadiness(r.data));

    axios.get(`${API}/dashboard/focus-analysis`)
    .then(r => setFocus(r.data));
  }, []);

  // =================================================
  // SEARCH INTELLIGENCE
  // =================================================
  const skillArray = search
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  useEffect(() => {

    axios.get(`${API}/dashboard/skill-distribution`, {
      params: { department }
    }).then(r => setDistribution(r.data));

    if (skillArray.length > 0 || minCgpa || minCoding || minAptitude || department) {

      axios.get(`${API}/dashboard/skills`, {
        params: {
          skills: search,
          min_cgpa: minCgpa,
          coding: minCoding,
          aptitude: minAptitude,
          department: department 
        }
      })
        .then(r => setSkillStats(r.data))
        .catch(() => setSkillStats(null));

    } else {
      setSkillStats(null);
    }

  }, [search, minCgpa, minCoding, minAptitude, department]);



  const getStatus = () => {
    if (!skillStats) return "";
    if (skillStats.students_percent < 40) return "🔴 High Shortage";
    if (skillStats.students_percent < 70) return "🟡 Moderate";
    return "🟢 Good";
  };


  // =================================================
  // CLICK NAVIGATION
  // =================================================
  const openSkill = (skill) => {
    navigate(`/skills?skills=${skill}&department=${department}`);
  };

  const openCompany = (companyName) => {
    const company = companyReadiness.find(
      c => c.company === companyName
    );

    if (!company || !company.id) {
      alert("Company ID missing");
      return;
    }

    navigate(`/company/${company.id}`);
  };



  return (
    <div>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h1>Placement Intelligence Dashboard</h1>



        {/* ================================================= */}
        {/* FILTERS */}
        {/* ================================================= */}
        <div style={{
          marginBottom: 20,
          padding: 12,
          background: "#eef2ff",
          borderRadius: 8
        }}>
          <b>Recruiter Simulation</b>
          <br />

          <input
            placeholder="Skills (DSA, React)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 150, marginRight: 10, marginTop: 5 }}
          />

          <input
            placeholder="Min CGPA"
            value={minCgpa}
            onChange={e => setMinCgpa(e.target.value)}
            style={{ width: 100, marginRight: 10 }}
          />

          <input
            placeholder="Coding >="
            value={minCoding}
            onChange={e => setMinCoding(e.target.value)}
            style={{ width: 100, marginRight: 10 }}
          />

          <input
            placeholder="Aptitude >="
            value={minAptitude}
            onChange={e => setMinAptitude(e.target.value)}
            style={{ width: 100, marginRight: 10 }}
          />

          {/* ⭐ NEW DEPARTMENT */}
          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            style={{ width: 130 }}
          >
            <option value="">All Dept</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
          </select>

        </div>



        {/* ================================================= */}
        {/* RESULT */}
        {/* ================================================= */}
        {skillStats && (
          <div style={{
            border: "2px solid #444",
            padding: 15,
            marginBottom: 20,
            background: "#f8fafc",
            borderRadius: 8
          }}>
            <h2>Eligibility Insight</h2>

            {search && <p><b>Skills:</b> {skillStats.skills.join(", ")}</p>}
            {minCgpa && <p><b>Min CGPA:</b> {minCgpa}</p>}
            {minCoding && <p><b>Coding ≥:</b> {minCoding}</p>}
            {minAptitude && <p><b>Aptitude ≥:</b> {minAptitude}</p>}
            {department && <p><b>Department:</b> {department}</p>}

            <p><b>Students matched:</b> {skillStats.students_count}</p>
            <p><b>Campus %:</b> {skillStats.students_percent}</p>

            <p><b>Status:</b> {getStatus()}</p>

            <button
              style={{ marginTop: 10 }}
              onClick={() =>
                navigate(
                  `/skills?skills=${search}&cgpa=${minCgpa}&coding=${minCoding}&aptitude=${minAptitude}&department=${department}`
                )
              }
            >
              View Students
            </button>

          </div>
        )}

        {/* ================================================= */}
        {/* CAMPUS SKILL DISTRIBUTION */}
        {/* ================================================= */}
        <h2>Campus Skill Distribution</h2>
        <p style={{ color: "gray" }}>Click a bar to view students.</p>

        <BarChart
          width={850}
          height={300}
          data={distribution}
          onClick={(e) => {
            if (e && e.activeLabel) openSkill(e.activeLabel);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="skill" />
          <YAxis />
          <Tooltip formatter={(v) => `${v} students`} />
          <Bar dataKey="count">
            <LabelList dataKey="percent" position="top" formatter={(v)=>`${v}%`} />
          </Bar>
        </BarChart>



        {/* ================================================= */}
        {/* COMPANY READINESS */}
        {/* ================================================= */}
        <h2>Company Eligibility Overview</h2>

        <BarChart
          width={850}
          height={300}
          data={companyReadiness}
          onClick={(e) => {
            if (e && e.activeLabel) openCompany(e.activeLabel);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="company" />
          <YAxis />
          <Tooltip formatter={(v) => `${v}% eligible`} />

          <Bar dataKey="percent">
            <LabelList dataKey="eligible" position="insideTop" />
            <LabelList dataKey="percent" position="top" formatter={(v)=>`${v}%`} />
          </Bar>
        </BarChart>

        {/* ================================================= */}
        {/* FOCUS RECOMMENDATION ENGINE */}
        {/* ================================================= */}
        {focus && (
          <>
            <h2>Placement Cell Focus Recommendations</h2>

            {/* OVERALL */}
            <div style={{
              border:"1px solid",
              padding:15,
              borderRadius:8,
              marginBottom:20,
              background:"#eef2ff"
            }}>
              <h3>Overall Campus</h3>
              <p><b>Coding Avg:</b> {focus.overall.coding}</p>
              <p><b>Aptitude Avg:</b> {focus.overall.aptitude}</p>
              <p><b>CGPA Avg:</b> {focus.overall.cgpa}</p>

              {focus.overall.coding < 60 && <p>⚠ Increase coding contests</p>}
              {focus.overall.aptitude < 60 && <p>⚠ Add aptitude training</p>}
              {focus.overall.cgpa < 7 && <p>⚠ Academic mentoring required</p>}
            </div>


            {/* DEPARTMENT */}
            <h3>Department Wise Strategy</h3>

            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))",
              gap:15
            }}>
              {focus.departments.map((d,i)=>(
                <div key={i} style={{
                  border:"1px solid",
                  padding:12,
                  borderRadius:8,
                  background:"#f8fafc"
                }}>
                  <h4>{d.name}</h4>

                  <p>Coding: {d.coding}</p>
                  <p>Aptitude: {d.aptitude}</p>
                  <p>CGPA: {d.cgpa}</p>

                  {d.coding < 60 && <p>⚠ Improve coding</p>}
                  {d.aptitude < 60 && <p>⚠ Improve aptitude</p>}
                  {d.cgpa < 7 && <p>⚠ Academic support</p>}

                  {d.weak_skills.length > 0 && (
                    <>
                      <b>Skill Gaps:</b>
                      <ul>
                        {d.weak_skills.map((s,j)=><li key={j}>{s}</li>)}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
