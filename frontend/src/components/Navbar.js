import { Link } from "react-router-dom";

export default function Navbar(){
  return(
    <div style={{
      background:"#0f172a",
      padding:15,
      display:"flex",
      gap:20,
      color:"white"
    }}>
      <Link to="/" style={{color:"white"}}>Dashboard</Link>
      <Link to="/manage-students" style={{color:"white"}}>Students</Link>
      <Link to="/manage-companies" style={{color:"white"}}>Companies</Link>
      <Link to="/manage-skills" style={{color:"white"}}>Skills</Link>
      <Link to="/analysis" style={{color:"white"}}>Analysis</Link>
    </div>
  );
}
