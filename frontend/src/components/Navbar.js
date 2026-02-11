import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {

  const [hovered, setHovered] = useState(null);

  const styles = {
    navbar: {
      background: "#0d0f17",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 60px",
      borderBottom: "1px solid rgba(255,255,255,0.08)"
    },
    logo: {
      fontSize: "30px",
      fontWeight: "bold",
      color: "white"
    },
    logoHighlight: {
      color: "#4da6ff",
      textShadow: "0 0 10px rgba(77,166,255,0.8)"
    },
    navLinks: {
      display: "flex",
      gap: "30px"
    },
    link: (name) => ({
      textDecoration: "none",
      color: hovered === name ? "#4da6ff" : "#cbd5e1",
      fontWeight: "600",
      transition: "0.3s",
      textShadow: hovered === name ? "0 0 8px rgba(77,166,255,0.8)" : "none"
    })
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
       TalentTrack AI <span style={styles.logoHighlight}>-CPRIS</span>
      </div>

      <div style={styles.navLinks}>
        <Link
          to="/"
          style={styles.link("dashboard")}
          onMouseEnter={() => setHovered("dashboard")}
          onMouseLeave={() => setHovered(null)}
        >
          Dashboard
        </Link>

        <Link
          to="/manage-students"
          style={styles.link("students")}
          onMouseEnter={() => setHovered("students")}
          onMouseLeave={() => setHovered(null)}
        >
          Students
        </Link>

        <Link
          to="/manage-companies"
          style={styles.link("companies")}
          onMouseEnter={() => setHovered("companies")}
          onMouseLeave={() => setHovered(null)}
        >
          Companies
        </Link>

        <Link
          to="/manage-skills"
          style={styles.link("skills")}
          onMouseEnter={() => setHovered("skills")}
          onMouseLeave={() => setHovered(null)}
        >
          Skills
        </Link>
      </div>
    </nav>
  );
}