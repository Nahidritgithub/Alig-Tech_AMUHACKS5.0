import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API } from "../config/api";

export default function CompanyManager() {

  const emptyForm = {
    name: "",
    role: "",
    min_cgpa: "",
    aptitude_cutoff: "",
    coding_cutoff: "",
    skills: ""
  };

  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  // ---------------- STYLES ----------------
  const styles = {
    page: {
      padding: 20,
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      color: "#e2e8f0",
      fontFamily: "'Poppins', sans-serif"
    },
    heading: {
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: 20,
      color: "#ffffff",
      textAlign: "center"
    },
    formWrapper: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 40
    },
    formBox: {
      width: "100%",
      maxWidth: "600px",
      border: "1px solid #334155",
      padding: 30,
      borderRadius: 12,
      background: "#1e293b",
      boxShadow: "0 8px 25px rgba(0,0,0,0.4)"
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      marginBottom: 12,
      borderRadius: 6,
      border: "1px solid #334155",
      background: "#0f172a",
      color: "#e2e8f0"
    },
    buttonPrimary: {
      padding: "10px 18px",
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "500"
    },
    buttonEdit: {
      padding: "6px 12px",
      background: "#f59e0b",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer"
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
    gridWrapper: {
      display: "flex",
      justifyContent: "center"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 20,
      width: "100%",
      maxWidth: "1000px"
    },
    card: {
      border: "1px solid #334155",
      padding: 20,
      borderRadius: 12,
      background: "#1e293b",
      boxShadow: "0 6px 18px rgba(0,0,0,0.3)"
    },
    emptyText: {
      textAlign: "center",
      marginBottom: 20
    }
  };

  // ---------------- load companies ----------------
  const loadCompanies = () => {
    axios.get(`${API}/companies`)
      .then(res => setCompanies(res.data));
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // ---------------- add or update ----------------
  const submit = () => {

    const payload = {
      name: form.name,
      role: form.role,
      min_cgpa: Number(form.min_cgpa),
      aptitude_cutoff: Number(form.aptitude_cutoff),
      coding_cutoff: Number(form.coding_cutoff),
      skills: form.skills.split(",").map(s => s.trim())
    };

    if (editId) {
      axios.put(`${API}/companies/${editId}`, payload)
        .then(() => {
          alert("Updated");
          setEditId(null);
          setForm(emptyForm);
          loadCompanies();
        });
    } else {
      axios.post(`${API}/companies`, payload)
        .then(() => {
          alert("Added");
          setForm(emptyForm);
          loadCompanies();
        });
    }
  };

  // ---------------- edit ----------------
  const editCompany = (c) => {
    setEditId(c._id);
    setForm({
      name: c.name,
      role: c.role,
      min_cgpa: c.min_cgpa,
      coding_cutoff: c.coding_cutoff,
      aptitude_cutoff: c.aptitude_cutoff,
      skills: c.skills.join(", ")
    });
  };

  // ---------------- delete ----------------
  const deleteCompany = (id) => {
    if (window.confirm("Delete this company?")) {
      axios.delete(`${API}/companies/${id}`)
        .then(() => loadCompanies());
    }
  };

  return (
    <div>
      <Navbar />

      <div style={styles.page}>
        <h1 style={styles.heading}>Company Requirement Manager</h1>

        {/* ---------------- FORM ---------------- */}
        <div style={styles.formWrapper}>
          <div style={styles.formBox}>
            <h3>{editId ? "Update Company" : "Add Company"}</h3>

            <input
              style={styles.input}
              placeholder="Company Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="Role"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="Min CGPA"
              value={form.min_cgpa}
              onChange={e => setForm({ ...form, min_cgpa: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="Coding Cutoff"
              value={form.coding_cutoff}
              onChange={e => setForm({ ...form, coding_cutoff: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="Aptitude Cutoff"
              value={form.aptitude_cutoff}
              onChange={e => setForm({ ...form, aptitude_cutoff: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="Skills (comma separated)"
              value={form.skills}
              onChange={e => setForm({ ...form, skills: e.target.value })}
            />

            <button style={styles.buttonPrimary} onClick={submit}>
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {/* ---------------- LIST ---------------- */}
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Company List</h2>

        {companies.length === 0 && (
          <p style={styles.emptyText}>No companies added yet.</p>
        )}

        <div style={styles.gridWrapper}>
          <div style={styles.grid}>
            {companies.map(c => (
              <div key={c._id} style={styles.card}>
                <h3 style={{ marginTop: 0 }}>{c.name || "-"}</h3>

                <p><b>Role:</b> {c.role || "-"}</p>
                <p><b>Min CGPA:</b> {c.min_cgpa ?? "-"}</p>
                <p><b>Coding Cutoff:</b> {c.coding_cutoff ?? "-"}</p>
                <p><b>Aptitude Cutoff:</b> {c.aptitude_cutoff ?? "-"}</p>
                <p><b>Skills:</b> {c.skills?.length ? c.skills.join(", ") : "-"}</p>

                <div style={{ marginTop: 10 }}>
                  <button style={styles.buttonEdit} onClick={() => editCompany(c)}>Edit</button>
                  <button style={styles.buttonDanger} onClick={() => deleteCompany(c._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}