import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { Plus, ArrowLeft, Edit, ToggleLeft, ToggleRight } from "lucide-react";

const AdminTasks = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "tweet",
    deadline: "",
    requiresScreenshots: false,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    const res = await api.get(`/admin/projects/${projectId}/tasks`);
    setTasks(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting task with data:", formData);
      if (editingId) {
        const response = await api.put(`/admin/tasks/${editingId}`, formData);
        console.log("Update response:", response.data);
      } else {
        const response = await api.post(
          `/admin/projects/${projectId}/tasks`,
          formData
        );
        console.log("Create response:", response.data);
      }
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        type: "tweet",
        deadline: "",
        requiresScreenshots: false,
      });
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      console.error("Operation failed:", error);
      alert("Operation failed");
    }
  };

  const toggleActive = async (taskId) => {
    try {
      await api.put(`/admin/tasks/${taskId}/toggle`);
      fetchTasks();
    } catch (error) {
      alert("Failed to toggle status");
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link
          to="/admin/projects"
          className="mr-4 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Project Tasks</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingId(null);
            setFormData({
              title: "",
              description: "",
              type: "tweet",
              deadline: "",
              requiresScreenshots: false,
            });
          }}
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Task
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Deadline</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {tasks.map((task) => (
              <tr key={task._id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-gray-400">
                      {task.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize">{task.type}</td>
                <td className="px-6 py-4">
                  {task.deadline ? (
                    <div className="text-sm">
                      <div>{new Date(task.deadline).toLocaleDateString()}</div>
                      <div className="text-gray-400">
                        {new Date(task.deadline).toLocaleTimeString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">No deadline</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      task.isActive
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {task.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center space-x-3">
                  <button
                    onClick={() => toggleActive(task._id)}
                    className="text-gray-400 hover:text-white"
                    title="Toggle Active"
                  >
                    {task.isActive ? (
                      <ToggleRight className="w-6 h-6 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      console.log("Opening edit modal for task:", {
                        id: task._id,
                        requiresScreenshots: task.requiresScreenshots,
                      });
                      setEditingId(task._id);
                      const formDataToSet = {
                        title: task.title,
                        description: task.description,
                        type: task.type,
                        deadline: task.deadline
                          ? new Date(task.deadline).toISOString().slice(0, 16)
                          : "",
                        requiresScreenshots: task.requiresScreenshots === true,
                      };
                      console.log("Setting form data:", formDataToSet);
                      setFormData(formDataToSet);
                      setShowModal(true);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Task" : "New Task"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                rows="3"
              />
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="tweet">Tweet</option>
                <option value="other">Other</option>
              </select>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Deadline (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div
                className="flex items-center p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition"
                onClick={() =>
                  setFormData({
                    ...formData,
                    requiresScreenshots: !formData.requiresScreenshots,
                  })
                }
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition ${
                    formData.requiresScreenshots
                      ? "bg-blue-600 border-blue-600"
                      : "bg-gray-800 border-gray-500"
                  }`}
                >
                  {formData.requiresScreenshots && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium select-none">
                  Require Screenshots Upload
                </span>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
