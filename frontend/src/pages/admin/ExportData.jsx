import { useState, useEffect } from "react";
import api from "../../services/api";
import { Download, Calendar, User, FileSpreadsheet } from "lucide-react";

const ExportData = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportData, setExportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/admin/projects");
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchExportData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedUser) params.append("userId", selectedUser);
      if (selectedProject) params.append("projectId", selectedProject);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await api.get(`/admin/export-data?${params.toString()}`);
      setExportData(res.data);
    } catch (error) {
      console.error("Error fetching export data:", error);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (exportData.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "User Name",
      "Email",
      "Telegram",
      "Twitter",
      "Project",
      "Task",
      "Task Type",
      "Task Deadline",
      "Submission Link",
      "Status",
      "Submitted At",
      "Admin Comment",
    ];

    const csvContent = [
      headers.join(","),
      ...exportData.map((row) =>
        [
          `"${row.userName}"`,
          `"${row.email}"`,
          `"${row.telegram}"`,
          `"${row.twitter}"`,
          `"${row.projectName}"`,
          `"${row.taskTitle}"`,
          `"${row.taskType}"`,
          `"${row.taskDeadline || "N/A"}"`,
          `"${row.submissionLink}"`,
          `"${row.status}"`,
          `"${row.submittedAt}"`,
          `"${row.adminComment || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = () => {
    if (exportData.length === 0) {
      alert("No data to export");
      return;
    }

    // Create HTML table for Excel
    const headers = [
      "User Name",
      "Email",
      "Telegram",
      "Twitter",
      "Project",
      "Task",
      "Task Type",
      "Task Deadline",
      "Submission Link",
      "Status",
      "Submitted At",
      "Admin Comment",
    ];

    const tableHTML = `
            <table>
                <thead>
                    <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
                </thead>
                <tbody>
                    ${exportData
                      .map(
                        (row) => `
                        <tr>
                            <td>${row.userName}</td>
                            <td>${row.email}</td>
                            <td>${row.telegram}</td>
                            <td>${row.twitter}</td>
                            <td>${row.projectName}</td>
                            <td>${row.taskTitle}</td>
                            <td>${row.taskType}</td>
                            <td>${row.taskDeadline || "N/A"}</td>
                            <td>${row.submissionLink}</td>
                            <td>${row.status}</td>
                            <td>${row.submittedAt}</td>
                            <td>${row.adminComment || ""}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
        `;

    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `export_${new Date().toISOString().slice(0, 10)}.xls`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Export Data</h1>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <User className="w-4 h-4 inline mr-1" />
              User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={fetchExportData}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
          >
            {loading ? "Loading..." : "Generate Report"}
          </button>
          {exportData.length > 0 && (
            <>
              <button
                onClick={downloadCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
              <button
                onClick={downloadExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Download Excel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Data Table */}
      {exportData.length > 0 && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Submission</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {exportData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-750">
                    <td className="px-4 py-3">
                      <div className="font-medium">{row.userName}</div>
                      <div className="text-xs text-gray-400">{row.email}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div>@{row.telegram}</div>
                      <div className="text-gray-400">@{row.twitter}</div>
                    </td>
                    <td className="px-4 py-3">{row.projectName}</td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs truncate">{row.taskTitle}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">{row.taskType}</td>
                    <td className="px-4 py-3 text-xs">
                      {row.taskDeadline || (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={row.submissionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs truncate block max-w-xs"
                      >
                        {row.submissionLink}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          row.status === "approved"
                            ? "bg-green-500/20 text-green-500"
                            : row.status === "rejected"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{row.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-750 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Total Records:{" "}
              <span className="font-semibold text-white">
                {exportData.length}
              </span>
            </p>
          </div>
        </div>
      )}

      {!loading && exportData.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <FileSpreadsheet className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">
            No data to display. Apply filters and click "Generate Report"
          </p>
        </div>
      )}
    </div>
  );
};

export default ExportData;
