import { useState, useEffect } from "react";
import api from "../../services/api";
import { Download, Calendar, User, FileSpreadsheet, Filter } from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Export Data</h1>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                <User className="w-4 h-4 inline mr-1" />
                User
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
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
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              >
                <option value="">All Projects</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label={
                <>
                  <Calendar className="w-4 h-4 inline mr-1" /> Start Date
                </>
              }
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <Input
              label={
                <>
                  <Calendar className="w-4 h-4 inline mr-1" /> End Date
                </>
              }
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={fetchExportData}
              disabled={loading}
              className="min-w-[140px]"
            >
              {loading ? "Loading..." : "Generate Report"}
            </Button>
            {exportData.length > 0 && (
              <>
                <Button
                  variant="success"
                  onClick={downloadCSV}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
                <Button
                  variant="success"
                  onClick={downloadExcel}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download Excel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      {exportData.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-surfaceHover/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium text-text-secondary">User</th>
                    <th className="px-4 py-3 font-medium text-text-secondary">Contact</th>
                    <th className="px-4 py-3 font-medium text-text-secondary">Project</th>
                    <th className="px-4 py-3 font-medium text-text-secondary">Task</th>
                    <th className="px-4 py-3 font-medium text-text-secondary">Type</th>
                    <th className="px-4 py-3 font-medium text-text-secondary">Deadline</th>
                    <th className="px-4 py-3 font-medium text-text-secondary">Submission</th>
                    <th className="px-4 py-3 font-medium text-text-secondary">Status</th>
                    <th className="px-4 py-3 font-medium text-text-secondary">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {exportData.map((row, index) => (
                    <tr key={index} className="hover:bg-surfaceHover/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-text-primary">{row.userName}</div>
                        <div className="text-xs text-text-secondary">{row.email}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-secondary">
                        <div>@{row.telegram}</div>
                        <div className="text-text-muted">@{row.twitter}</div>
                      </td>
                      <td className="px-4 py-3 text-text-primary">{row.projectName}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        <div className="max-w-xs truncate" title={row.taskTitle}>{row.taskTitle}</div>
                      </td>
                      <td className="px-4 py-3 capitalize text-text-secondary">{row.taskType}</td>
                      <td className="px-4 py-3 text-xs text-text-secondary">
                        {row.taskDeadline || (
                          <span className="text-text-muted">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={row.submissionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primaryHover text-xs truncate block max-w-xs"
                        >
                          {row.submissionLink}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === "approved"
                            ? "bg-success/10 text-success"
                            : row.status === "rejected"
                              ? "bg-danger/10 text-danger"
                              : "bg-warning/10 text-warning"
                            }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-secondary">{row.submittedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-surfaceHover/30 border-t border-border">
              <p className="text-sm text-text-secondary">
                Total Records:{" "}
                <span className="font-semibold text-text-primary">
                  {exportData.length}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && exportData.length === 0 && (
        <Card className="p-12 text-center border-dashed">
          <FileSpreadsheet className="w-16 h-16 mx-auto text-text-muted mb-4" />
          <p className="text-text-secondary text-lg">
            No data to display. Apply filters and click "Generate Report"
          </p>
        </Card>
      )}
    </div>
  );
};

export default ExportData;
