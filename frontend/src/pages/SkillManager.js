import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API } from "../config/api";

export default function SkillManager(){

  const [skills,setSkills]=useState([]);
  const [name,setName]=useState("");
  const [editId,setEditId]=useState(null);

  // ---------------- STYLES ----------------
  const styles = {
    page:{
      padding:20,
      minHeight:"100vh",
      background:"#0f172a",
      color:"#e2e8f0",
      fontFamily:"'Poppins', sans-serif"
    },
    heading:{
      textAlign:"center",
      fontSize:"28px",
      fontWeight:"700",
      marginBottom:30
    },
    formWrapper:{
      display:"flex",
      justifyContent:"center",
      marginBottom:40
    },
    formBox:{
      width:"100%",
      maxWidth:"500px",
      padding:25,
      borderRadius:12,
      background:"#1e293b",
      border:"1px solid #334155",
      boxShadow:"0 8px 25px rgba(0,0,0,0.4)",
      display:"flex",
      gap:10
    },
    input:{
      flex:1,
      padding:"10px 12px",
      borderRadius:6,
      border:"1px solid #475569",
      background:"#0f172a",
      color:"#e2e8f0"
    },
    buttonPrimary:{
      padding:"10px 16px",
      borderRadius:6,
      border:"none",
      background:"#3b82f6",
      color:"#fff",
      cursor:"pointer",
      fontWeight:"500"
    },
    listHeading:{
      textAlign:"center",
      marginBottom:20
    },
    gridWrapper:{
      display:"flex",
      justifyContent:"center"
    },
    grid:{
      width:"100%",
      maxWidth:"900px",
      display:"grid",
      gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",
      gap:20
    },
    card:{
      padding:18,
      borderRadius:12,
      background:"#1e3a8a",
      border:"1px solid #1d4ed8",
      boxShadow:"0 6px 18px rgba(0,0,0,0.3)"
    },
    skillName:{
      fontSize:"16px",
      fontWeight:"600"
    },
    buttonEdit:{
      padding:"6px 10px",
      borderRadius:6,
      border:"none",
      background:"#6366f1",
      color:"#fff",
      cursor:"pointer"
    },
    buttonDelete:{
      padding:"6px 10px",
      borderRadius:6,
      border:"none",
      background:"#ef4444",
      color:"#fff",
      cursor:"pointer",
      marginLeft:6
    },
    emptyText:{
      textAlign:"center",
      color:"#94a3b8"
    }
  };

  const load = ()=> {
    axios.get(`${API}/skills`).then(r=>setSkills(r.data));
  }

  useEffect(()=>{ load(); },[]);

  // ---------------- submit ----------------
  const submit = ()=>{
    if(!name.trim()){
      alert("Enter skill name");
      return;
    }

    if(editId){
      axios.put(`${API}/skills/${editId}`, {name})
      .then(()=>{
        setEditId(null);
        setName("");
        load();
      });
    } else {
      axios.post(`${API}/skills`, {name})
      .then(()=>{
        setName("");
        load();
      });
    }
  }

  // ---------------- edit ----------------
  const edit = (s)=>{
    setEditId(s._id);
    setName(s.name);
  }

  // ---------------- delete ----------------
  const del = (id)=>{
    if(window.confirm("Delete this skill?")){
      axios.delete(`${API}/skills/${id}`).then(()=>load());
    }
  }

  return(
    <div>
      <Navbar/>

      <div style={styles.page}>
        <h1 style={styles.heading}>Skill Manager</h1>

        {/* ---------------- FORM ---------------- */}
        <div style={styles.formWrapper}>
          <div style={styles.formBox}>
            <input
              placeholder="Skill Name"
              value={name}
              onChange={e=>setName(e.target.value)}
              style={styles.input}
            />

            <button onClick={submit} style={styles.buttonPrimary}>
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {/* ---------------- LIST ---------------- */}
        <h2 style={styles.listHeading}>All Skills</h2>

        {skills.length === 0 && <p style={styles.emptyText}>No skills available.</p>}

        <div style={styles.gridWrapper}>
          <div style={styles.grid}>
            {skills.map(s=>(
              <div key={s._id} style={styles.card}>
                <div style={styles.skillName}>{s.name || "-"}</div>

                <div style={{marginTop:12}}>
                  <button style={styles.buttonEdit} onClick={()=>edit(s)}>Edit</button>
                  <button
                    style={styles.buttonDelete}
                    onClick={()=>del(s._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}