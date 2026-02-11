import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../config/api";

export default function CompanyReadiness(){

  const { name } = useParams();
  const [data,setData] = useState(null);

  useEffect(()=>{
    axios.get(`${API}/dashboard/company-readiness`)
      .then(r=>{
        const found = r.data.find(c => c.company === name);
        setData(found);
      });
  },[name]);

  if(!data) return <div>Loading...</div>;

  return(
    <div>
      <Navbar/>
      <div style={{padding:20}}>
        <h1>{data.company} Readiness</h1>

        <h2>Eligibility</h2>
        <p>Students eligible: {data.eligible}</p>
        <p>Campus %: {data.percent}</p>

        <h2>Main Gaps</h2>
        <p>Below CGPA: {data.gaps.cgpa}</p>
        <p>Below Coding: {data.gaps.coding}</p>

        <h3>Missing Skills</h3>
        {Object.entries(data.gaps.skills).map(([k,v])=>(
          <p key={k}>{k} → {v}</p>
        ))}

        <h2>Recommended Action</h2>
        <ul>
          <li>Focus training on top missing skills</li>
          <li>Improve coding preparation</li>
          <li>Shortlist mentoring for near-eligible students</li>
        </ul>
      </div>
    </div>
  );
}
