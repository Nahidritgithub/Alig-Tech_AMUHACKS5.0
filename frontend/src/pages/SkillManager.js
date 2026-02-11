import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "http://localhost:5000";

export default function SkillManager(){

  const [skills,setSkills]=useState([]);
  const [name,setName]=useState("");
  const [editId,setEditId]=useState(null);

  const load = ()=> {
    axios.get(`${API}/skills`).then(r=>setSkills(r.data));
  }

  useEffect(()=>{ load(); },[]);

  const submit = ()=>{
    if(editId){
      axios.put(`${API}/skills/${editId}`, {name})
      .then(()=>{ setEditId(null); setName(""); load();});
    } else {
      axios.post(`${API}/skills`, {name})
      .then(()=>{ setName(""); load();});
    }
  }

  const edit = (s)=>{
    setEditId(s._id);
    setName(s.name);
  }

  const del = (id)=>{
    axios.delete(`${API}/skills/${id}`).then(()=>load());
  }

  return(
    <div>
      <Navbar/>
      <div style={{padding:20}}>
        <h1>Skill Manager</h1>

        <input
          placeholder="Skill Name"
          value={name}
          onChange={e=>setName(e.target.value)}
        />
        <button onClick={submit}>
          {editId ? "Update" : "Add"}
        </button>

        <h3>All Skills</h3>

        {skills.map(s=>(
          <div key={s._id}>
            {s.name}
            <button onClick={()=>edit(s)}>Edit</button>
            <button onClick={()=>del(s._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
