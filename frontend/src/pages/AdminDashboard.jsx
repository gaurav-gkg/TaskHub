import { Routes, Route, Link, useLocation } from "react-router-dom";
import AdminUsers from "./admin/AdminUsers";
import AdminProjects from "./admin/AdminProjects";
import AdminTasks from "./admin/AdminTasks";
import AdminBounties from "./admin/AdminBounties";
import AdminSubmissions from "./admin/AdminSubmissions";
import ExportData from "./admin/ExportData";
import {
  Users,
  Folder,
  CheckSquare,
  Gift,
  FileText,
  Download,
} from "lucide-react";

const AdminDashboard = () => {
  const location = useLocation();

  const navItems = [
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/projects", label: "Projects", icon: Folder },
    { path: "/admin/bounties", label: "Bounties", icon: Gift },
    { path: "/admin/submissions", label: "Submissions", icon: FileText },
    { path: "/admin/export-data", label: "Export Data", icon: Download },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Admin Panel
          </h2>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-gray-900 p-8">
        <Routes>
          <Route path="users" element={<AdminUsers />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/:projectId/tasks" element={<AdminTasks />} />
          <Route path="bounties" element={<AdminBounties />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="export-data" element={<ExportData />} />
          <Route
            path="/"
            element={
              <div className="text-gray-400">
                Select a module from the sidebar.
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
