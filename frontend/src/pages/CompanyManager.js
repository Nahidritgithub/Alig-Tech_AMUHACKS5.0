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

      <div style={{ padding: 20 }}>
        <h1>Company Requirement Manager</h1>

        {/* ---------------- FORM ---------------- */}
        <div style={{ border: "1px solid gray", padding: 15, marginBottom: 20 }}>
          <h3>{editId ? "Update Company" : "Add Company"}</h3>

          <input
            placeholder="Company Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <br />

          <input
            placeholder="Role"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          />
          <br />

          <input
            placeholder="Min CGPA"
            value={form.min_cgpa}
            onChange={e => setForm({ ...form, min_cgpa: e.target.value })}
          />
          <br />

          <input
            placeholder="Coding Cutoff"
            value={form.coding_cutoff}
            onChange={e => setForm({ ...form, coding_cutoff: e.target.value })}
          />
          <br />

          <input
            placeholder="Aptitude Cutoff"
            value={form.aptitude_cutoff}
            onChange={e => setForm({ ...form, aptitude_cutoff: e.target.value })}
          />
          <br />

          <input
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={e => setForm({ ...form, skills: e.target.value })}
          />
          <br />

          <button onClick={submit}>
            {editId ? "Update" : "Add"}
          </button>
        </div>


        {/* ---------------- LIST ---------------- */}
        {/* ---------------- LIST ---------------- */}
        <h2>Company List</h2>

        {companies.length === 0 && <p>No companies added yet.</p>}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 15
        }}>
          {companies.map(c => (
            <div
              key={c._id}
              style={{
                border: "1px solid #333",
                padding: 12,
                borderRadius: 8,
                background: "#f8fafc"
              }}
            >
              <h3 style={{ marginTop: 0 }}>{c.name || "-"}</h3>

              <p><b>Role:</b> {c.role || "-"}</p>
              <p><b>Min CGPA:</b> {c.min_cgpa ?? "-"}</p>
              <p><b>Coding Cutoff:</b> {c.coding_cutoff ?? "-"}</p>
              <p><b>Aptitude Cutoff:</b> {c.aptitude_cutoff ?? "-"}</p>
              <p><b>Skills:</b> {c.skills?.length ? c.skills.join(", ") : "-"}</p>

              <div style={{ marginTop: 10 }}>
                <button onClick={() => editCompany(c)}>Edit</button>
                <button
                  onClick={() => deleteCompany(c._id)}
                  style={{ marginLeft: 5 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
