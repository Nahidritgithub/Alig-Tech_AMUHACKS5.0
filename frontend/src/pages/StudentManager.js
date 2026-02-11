import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API } from "../config/api";

export default function StudentManager() {

  const emptyForm = {
    roll_no: "",
    name: "",
    department: "",
    cgpa: "",
    coding_score: "",
    aptitude_score: "",
    communication_score: "",
    internships: "",
    projects: "",
    skills: ""
  };

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deptFilter, setDeptFilter] = useState("");

  // ================= STYLES =================
  const styles = {
    page: {
      padding: 20,
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      color: "#e2e8f0",
      fontFamily: "'Poppins', sans-serif",
  
    },
    heading: {
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: 20,
      color: "#ffffff"
    },
    formBox: {
      border: "1px solid #334155",
      padding: 20,
      marginBottom: 25,
      borderRadius: 10,
      background: "#1e293b",
      itemAlign: "center",
   
    },
    input: {
      width: "100%",
      padding: "8px 10px",
      marginBottom: 10,
      borderRadius: 6,
      border: "1px solid #334155",
      background: "#0f172a",
      color: "#e2e8f0"
    },
    select: {
      width: "100%",
      padding: "8px 10px",
      marginBottom: 10,
      borderRadius: 6,
      border: "1px solid #334155",
      background: "#0f172a",
      color: "#e2e8f0"
    },
    buttonPrimary: {
      padding: "8px 16px",
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "500"
    },
    buttonDanger: {
      padding: "6px 12px",
      background: "#dc2626",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      marginLeft: 6
    },
    buttonEdit: {
      padding: "6px 12px",
      background: "#f59e0b",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer"
    },
    buttonView: {
      padding: "6px 12px",
      background: "#10b981",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      marginLeft: 6
    },
    card: {
      border: "1px solid #334155",
      padding: 15,
      borderRadius: 10,
      background: "#1e293b"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 15
    }
  };

  // ================= LOAD =================
  const load = () => {
    axios.get(`${API}/students`)
      .then(res => setStudents(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  // ================= ADD / UPDATE =================
  const submit = () => {

    const payload = {
      roll_no: form.roll_no,
      name: form.name,
      department: form.department,
      cgpa: Number(form.cgpa),
      coding_score: Number(form.coding_score),
      aptitude_score: Number(form.aptitude_score),
      communication_score: Number(form.communication_score),
      internships: Number(form.internships),
      projects: Number(form.projects),
      skills: form.skills.split(",").map(s => s.trim())
    };

    if (editId) {
      axios.put(`${API}/students/${editId}`, payload)
        .then(() => {
          alert("Updated");
          setEditId(null);
          setForm(emptyForm);
          load();
        });
    } else {
      axios.post(`${API}/students`, payload)
        .then(() => {
          alert("Added");
          setForm(emptyForm);
          load();
        });
    }
  };

  // ================= EDIT =================
  const editStudent = (s) => {
    setEditId(s._id);
    setForm({
      roll_no: s.roll_no,
      name: s.name,
      department: s.department,
      cgpa: s.cgpa,
      coding_score: s.coding_score,
      aptitude_score: s.aptitude_score,
      communication_score: s.communication_score,
      internships: s.internships,
      projects: s.projects,
      skills: s.skills.join(", ")
    });
  };

  // ================= DELETE =================
  const del = (id) => {
    if (window.confirm("Delete this student?")) {
      axios.delete(`${API}/students/${id}`)
        .then(() => load());
    }
  };

  // ================= FILTER =================
  const filteredStudents = deptFilter
    ? students.filter(s => s.department === deptFilter)
    : students;

  return (
    <div>
      <Navbar />

      <div style={styles.page}>
        <h1 style={styles.heading}>Student Manager</h1>

        {/* FORM */}
        <div style={styles.formBox}>
          <h3>{editId ? "Update Student" : "Add Student"}</h3>

          <input style={styles.input} placeholder="Roll No"
            value={form.roll_no}
            onChange={e => setForm({ ...form, roll_no: e.target.value })} />

          <input style={styles.input} placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />

          <select style={styles.select}
            value={form.department}
            onChange={e => setForm({ ...form, department: e.target.value })}>
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
          </select>

          <input style={styles.input} placeholder="CGPA"
            value={form.cgpa}
            onChange={e => setForm({ ...form, cgpa: e.target.value })} />

          <input style={styles.input} placeholder="Coding Score"
            value={form.coding_score}
            onChange={e => setForm({ ...form, coding_score: e.target.value })} />

          <input style={styles.input} placeholder="Aptitude Score"
            value={form.aptitude_score}
            onChange={e => setForm({ ...form, aptitude_score: e.target.value })} />

          <input style={styles.input} placeholder="Communication Score"
            value={form.communication_score}
            onChange={e => setForm({ ...form, communication_score: e.target.value })} />

          <input style={styles.input} placeholder="Internships"
            value={form.internships}
            onChange={e => setForm({ ...form, internships: e.target.value })} />

          <input style={styles.input} placeholder="Projects"
            value={form.projects}
            onChange={e => setForm({ ...form, projects: e.target.value })} />

          <input style={styles.input} placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={e => setForm({ ...form, skills: e.target.value })} />

          <button style={styles.buttonPrimary} onClick={submit}>
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* FILTER */}
        <div style={{ marginBottom: 20 }}>
          <b>Filter by Department: </b>
          <select style={{ ...styles.select, width: 200 }}
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}>
            <option value="">All</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
          </select>
        </div>

        {/* LIST */}
        <h2>Students</h2>

        <div style={styles.grid}>
          {filteredStudents.map(s => (
            <div key={s._id} style={styles.card}>

              <h3 style={{ marginTop: 0 }}>{s.name || "-"}</h3>
              <p><b>Roll No:</b> {s.roll_no || "-"}</p>
              <p><b>Department:</b> {s.department || "-"}</p>
              <p><b>CGPA:</b> {s.cgpa ?? "-"}</p>
              <p><b>Coding:</b> {s.coding_score ?? "-"}</p>
              <p><b>Aptitude:</b> {s.aptitude_score ?? "-"}</p>
              <p><b>Communication:</b> {s.communication_score ?? "-"}</p>
              <p><b>Internships:</b> {s.internships ?? "-"}</p>
              <p><b>Projects:</b> {s.projects ?? "-"}</p>
              <p><b>Skills:</b> {s.skills?.length ? s.skills.join(", ") : "-"}</p>

              <div style={{ marginTop: 12 }}>
                <button style={styles.buttonEdit} onClick={() => editStudent(s)}>Edit</button>
                <button style={styles.buttonDanger} onClick={() => del(s._id)}>Delete</button>
                <a href={`/student/${s._id}`}>
                  <button style={styles.buttonView}>View</button>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}