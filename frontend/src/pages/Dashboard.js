import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
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

  useEffect(() => {
    axios
      .get(`${API}/dashboard/company-readiness`)
      .then((r) => setCompanyReadiness(r.data));

    axios.get(`${API}/dashboard/focus-analysis`).then((r) => setFocus(r.data));
  }, []);

  const skillArray = search
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    axios
      .get(`${API}/dashboard/skill-distribution`, {
        params: { department },
      })
      .then((r) => setDistribution(r.data));

    if (
      skillArray.length > 0 ||
      minCgpa ||
      minCoding ||
      minAptitude ||
      department
    ) {
      axios
        .get(`${API}/dashboard/skills`, {
          params: {
            skills: search,
            min_cgpa: minCgpa,
            coding: minCoding,
            aptitude: minAptitude,
            department: department,
          },
        })
        .then((r) => setSkillStats(r.data))
        .catch(() => setSkillStats(null));
    } else {
      setSkillStats(null);
    }
  }, [skillArray.length, search, minCgpa, minCoding, minAptitude, department]);

  const getStatus = () => {
    if (!skillStats) return "";
    if (skillStats.students_percent < 40) return "🔴 High Shortage";
    if (skillStats.students_percent < 70) return "🟡 Moderate";
    return "🟢 Good";
  };

  const openSkill = (skill) => {
    navigate(`/skills?skills=${skill}&department=${department}`);
  };

  const openCompany = (companyName) => {
    const company = companyReadiness.find((c) => c.company === companyName);

    if (!company || !company.id) {
      alert("Company ID missing");
      return;
    }

    navigate(`/company/${company.id}`);
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#0f172a",
      padding: 30,
      color: "#e2e8f0",
      fontFamily: "'Poppins', sans-serif",
    },
    container: {
      maxWidth: 1200,
      margin: "0 auto",
    },
    heading: {
      fontSize: 30,
      fontWeight: 700,
      marginBottom: 25,
      textAlign: "center",
    },
    card: {
      background: "#1e293b",
      padding: 20,
      borderRadius: 14,
      border: "1px solid #334155",
      marginBottom: 25,
    },
    input: {
      padding: 8,
      marginRight: 10,
      borderRadius: 6,
      border: "1px solid #334155",
      background: "#0f172a",
      color: "#e2e8f0",
      marginTop: 8,
    },
    button: {
      padding: "8px 16px",
      borderRadius: 6,
      border: "none",
      background: "#2563eb",
      color: "white",
      cursor: "pointer",
      marginTop: 10,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
      gap: 20,
    },
  };

  return (
    <div>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.heading}>Placement Intelligence Dashboard</h1>

          {/* FILTER CARD */}
          <div style={styles.card}>
            <b>Recruiter Simulation</b>
            <br />

            <input
              style={styles.input}
              placeholder="Skills (DSA, React)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Min CGPA"
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Coding >="
              value={minCoding}
              onChange={(e) => setMinCoding(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Aptitude >="
              value={minAptitude}
              onChange={(e) => setMinAptitude(e.target.value)}
            />

            <select
              style={styles.input}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">All Dept</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
            </select>
          </div>

          {/* RESULT CARD */}
          {skillStats && (
            <div style={styles.card}>
              <h2>Eligibility Insight</h2>

              {search && (
                <p>
                  <b>Skills:</b> {skillStats.skills.join(", ")}
                </p>
              )}
              {minCgpa && (
                <p>
                  <b>Min CGPA:</b> {minCgpa}
                </p>
              )}
              {minCoding && (
                <p>
                  <b>Coding ≥:</b> {minCoding}
                </p>
              )}
              {minAptitude && (
                <p>
                  <b>Aptitude ≥:</b> {minAptitude}
                </p>
              )}
              {department && (
                <p>
                  <b>Department:</b> {department}
                </p>
              )}

              <p>
                <b>Students matched:</b> {skillStats.students_count}
              </p>
              <p>
                <b>Campus %:</b> {skillStats.students_percent}
              </p>
              <p>
                <b>Status:</b> {getStatus()}
              </p>

              <button
                style={styles.button}
                onClick={() =>
                  navigate(
                    `/skills?skills=${search}&cgpa=${minCgpa}&coding=${minCoding}&aptitude=${minAptitude}&department=${department}`,
                  )
                }
              >
                View Students
              </button>
            </div>
          )}

          {/* SKILL DISTRIBUTION */}
          <div style={styles.card}>
            <h2>Campus Skill Distribution</h2>
            <BarChart
              width={1000}
              height={300}
              data={distribution}
              onClick={(e) => {
                if (e && e.activeLabel) openSkill(e.activeLabel);
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="skill" stroke="#e2e8f0" />
              <YAxis stroke="#e2e8f0" />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6">
                <LabelList
                  dataKey="percent"
                  position="top"
                  formatter={(v) => `${v}%`}
                />
              </Bar>
            </BarChart>
          </div>

          {/* COMPANY READINESS */}
          <div style={styles.card}>
            <h2>Company Eligibility Overview</h2>

            <BarChart
              width={1000}
              height={300}
              data={companyReadiness}
              onClick={(e) => {
                if (e && e.activeLabel) openCompany(e.activeLabel);
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="company" stroke="#e2e8f0" />
              <YAxis stroke="#e2e8f0" />
              <Tooltip />
              <Bar dataKey="percent" fill="#6366f1">
                <LabelList
                  dataKey="percent"
                  position="top"
                  formatter={(v) => `${v}%`}
                />
              </Bar>
            </BarChart>
          </div>

          {/* FOCUS SECTION */}
          {/* {focus && (
            <div style={styles.card}>
              <h2>Placement Cell Focus Recommendations</h2>

              <div style={styles.grid}>
                {focus.departments.map((d,i)=>(
                  <div key={i} style={{
                    background:"#0f172a",
                    padding:15,
                    borderRadius:10,
                    border:"1px solid #334155"
                  }}>
                    <h4>{d.name}</h4>
                    <p>Coding: {d.coding}</p>
                    <p>Aptitude: {d.aptitude}</p>
                    <p>CGPA: {d.cgpa}</p>

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
            </div>
          )} */}

          {/* ================================================= */}
          {/* FOCUS RECOMMENDATION ENGINE */}
          {/* ================================================= */}
          {focus && (
            <div style={styles.card}>
              <h2>Placement Cell Focus Recommendations</h2>

              {/* OVERALL CAMPUS */}
              <div
                style={{
                  background: "#0f172a",
                  padding: 15,
                  borderRadius: 10,
                  border: "1px solid #334155",
                  marginBottom: 20,
                }}
              >
                <h3>Overall Campus</h3>

                <p>
                  <b>Coding Avg:</b> {focus.overall.coding}
                </p>
                <p>
                  <b>Aptitude Avg:</b> {focus.overall.aptitude}
                </p>
                <p>
                  <b>CGPA Avg:</b> {focus.overall.cgpa}
                </p>

                {focus.overall.coding < 60 && <p>⚠ Increase coding contests</p>}
                {focus.overall.aptitude < 60 && <p>⚠ Add aptitude training</p>}
                {focus.overall.cgpa < 7 && <p>⚠ Academic mentoring required</p>}
              </div>

              {/* DEPARTMENT WISE STRATEGY */}
              <h3>Department Wise Strategy</h3>

              <div style={styles.grid}>
                {focus.departments.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#0f172a",
                      padding: 15,
                      borderRadius: 10,
                      border: "1px solid #334155",
                    }}
                  >
                    <h4>{d.name}</h4>

                    <p>Coding: {d.coding}</p>
                    <p>Aptitude: {d.aptitude}</p>
                    <p>CGPA: {d.cgpa}</p>

                    {d.coding < 60 && <p>⚠ Improve coding</p>}
                    {d.aptitude < 60 && <p>⚠ Improve aptitude</p>}
                    {d.cgpa < 7 && <p>⚠ Academic support</p>}

                    {d.weak_skills?.length > 0 && (
                      <>
                        <b>Skill Gaps:</b>
                        <ul>
                          {d.weak_skills.map((s, j) => (
                            <li key={j}>{s}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
