import { Routes, Route, Navigate } from "react-router-dom";
import AdminHome from "./admin/AdminHome";
import AdminUsers from "./admin/AdminUsers";
import AdminProjects from "./admin/AdminProjects";
import AdminTasks from "./admin/AdminTasks";
import AdminBounties from "./admin/AdminBounties";
import AdminSubmissions from "./admin/AdminSubmissions";
import ExportData from "./admin/ExportData";

const AdminDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminHome />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="projects" element={<AdminProjects />} />
      <Route path="projects/:projectId/tasks" element={<AdminTasks />} />
      <Route path="bounties" element={<AdminBounties />} />
      <Route path="submissions" element={<AdminSubmissions />} />
      <Route path="export-data" element={<ExportData />} />
    </Routes>
  );
};

export default AdminDashboard;
