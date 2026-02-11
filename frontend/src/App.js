import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StudentReport from "./pages/StudentReport";
import CompanyAnalyzer from "./pages/CompanyAnalyzer";
import CompanyReport from "./pages/CompanyReport";
import CompanyManager from "./pages/CompanyManager";
import StudentManager from "./pages/StudentManager";
import SkillManager from "./pages/SkillManager";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/student/:id" element={<StudentReport/>}/>
        <Route path="/analysis" element={<CompanyAnalyzer/>}/>
        <Route path="/company/:id" element={<CompanyReport/>}/>
        <Route path="/manage-companies" element={<CompanyManager/>}/>
        <Route path="/manage-students" element={<StudentManager />} />
        <Route path="/manage-skills" element={<SkillManager/>}/>
      </Routes>
    </BrowserRouter>
  );
}
