import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { Plus, ArrowLeft, Edit, ToggleLeft, ToggleRight, X } from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

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
      if (editingId) {
        await api.put(`/admin/tasks/${editingId}`, formData);
      } else {
        await api.post(`/admin/projects/${projectId}/tasks`, formData);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/admin/projects"
            className="mr-4 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-text-primary">Project Tasks</h1>
        </div>
        <Button
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
        >
          <Plus className="w-4 h-4 mr-2" /> Add Task
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surfaceHover/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-text-secondary">Title</th>
                  <th className="px-6 py-4 text-sm font-medium text-text-secondary">Type</th>
                  <th className="px-6 py-4 text-sm font-medium text-text-secondary">Deadline</th>
                  <th className="px-6 py-4 text-sm font-medium text-text-secondary">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-surfaceHover/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-text-primary">{task.title}</div>
                        <div className="text-sm text-text-secondary line-clamp-1">
                          {task.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-text-secondary">{task.type}</td>
                    <td className="px-6 py-4">
                      {task.deadline ? (
                        <div className="text-sm">
                          <div className="text-text-primary">{new Date(task.deadline).toLocaleDateString()}</div>
                          <div className="text-text-muted text-xs">
                            {new Date(task.deadline).toLocaleTimeString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-text-muted text-sm">No deadline</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${task.isActive
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger"
                          }`}
                      >
                        {task.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(task._id)}
                        title="Toggle Active"
                      >
                        {task.isActive ? (
                          <ToggleRight className="w-6 h-6 text-success" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-text-muted" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(task._id);
                          setFormData({
                            title: task.title,
                            description: task.description,
                            type: task.type,
                            deadline: task.deadline
                              ? new Date(task.deadline).toISOString().slice(0, 16)
                              : "",
                            requiresScreenshots: task.requiresScreenshots === true,
                          });
                          setShowModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                      No tasks found for this project.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md animate-fade-in">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{editingId ? "Edit Task" : "New Task"}</CardTitle>
              <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Task Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder-text-muted"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  >
                    <option value="tweet">Tweet</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <Input
                  label="Deadline (Optional)"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                />

                <div
                  className="flex items-center p-3 bg-surfaceHover/30 border border-border rounded-lg cursor-pointer hover:bg-surfaceHover/50 transition"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      requiresScreenshots: !formData.requiresScreenshots,
                    })
                  }
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition ${formData.requiresScreenshots
                        ? "bg-primary border-primary"
                        : "bg-transparent border-text-muted"
                      }`}
                  >
                    {formData.requiresScreenshots && (
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium text-text-primary select-none">
                    Require Screenshots Upload
                  </span>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
