import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API } from "../config/api";

export default function SkillManager(){

  const [skills,setSkills]=useState([]);
  const [name,setName]=useState("");
  const [editId,setEditId]=useState(null);

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

      <div style={{padding:20}}>
        <h1>Skill Manager</h1>



        {/* ---------------- FORM ---------------- */}
        <div style={{
          border: "1px solid gray",
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
          background: "#eef2ff"
        }}>
          <input
            placeholder="Skill Name"
            value={name}
            onChange={e=>setName(e.target.value)}
            style={{marginRight:10}}
          />

          <button onClick={submit}>
            {editId ? "Update" : "Add"}
          </button>
        </div>



        {/* ---------------- LIST ---------------- */}
        <h3>All Skills</h3>

        {skills.length === 0 && <p>No skills available.</p>}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12
        }}>
          {skills.map(s=>(
            <div
              key={s._id}
              style={{
                border: "1px solid #333",
                padding: 10,
                borderRadius: 8,
                background: "#f8fafc"
              }}
            >
              <b>{s.name || "-"}</b>

              <div style={{marginTop:10}}>
                <button onClick={()=>edit(s)}>Edit</button>
                <button
                  onClick={()=>del(s._id)}
                  style={{marginLeft:5}}
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
