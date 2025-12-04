import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Plus, Trash2, Edit, UserPlus, List } from "lucide-react";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [assignModal, setAssignModal] = useState(null); // projectId
  const [users, setUsers] = useState([]); // Approved users for assignment
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await api.get("/admin/projects");
    setProjects(res.data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      if (imagePreview) {
        submitData.imageUrl = imagePreview;
      }
      if (editingId) {
        await api.put(`/admin/projects/${editingId}`, submitData);
      } else {
        await api.post("/admin/projects", submitData);
      }
      setShowModal(false);
      setFormData({ name: "", description: "", imageUrl: "" });
      setImageFile(null);
      setImagePreview("");
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      alert("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/admin/projects/${id}`);
      fetchProjects();
    }
  };

  const openAssignModal = async (project) => {
    setAssignModal(project._id);
    setSelectedUsers(project.assignedUsers || []);
    // Fetch approved users
    const res = await api.get("/admin/users?status=approved");
    setUsers(res.data);
  };

  const handleAssignSubmit = async () => {
    try {
      await api.put(`/admin/projects/${assignModal}/assign-users`, {
        userIds: selectedUsers,
      });
      setAssignModal(null);
      fetchProjects();
    } catch (error) {
      alert("Assignment failed");
    }
  };

  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingId(null);
            setFormData({ name: "", description: "", imageUrl: "" });
            setImageFile(null);
            setImagePreview("");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
          >
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.name}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                <Link
                  to={`/admin/projects/${project._id}/tasks`}
                  className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
                >
                  <List className="w-4 h-4 mr-1" /> Tasks
                </Link>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openAssignModal(project)}
                    className="text-gray-400 hover:text-white"
                    title="Assign Users"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(project._id);
                      setFormData({
                        name: project.name,
                        description: project.description,
                        imageUrl: project.imageUrl,
                      });
                      setImagePreview(project.imageUrl || "");
                      setShowModal(true);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Project" : "New Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                )}
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

      {/* Assign Users Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <h2 className="text-xl font-bold mb-4">Assign Users</h2>
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleUserSelection(user._id)}
                  className={`p-3 rounded cursor-pointer flex justify-between items-center ${
                    selectedUsers.includes(user._id)
                      ? "bg-blue-600/20 border border-blue-500"
                      : "bg-gray-700 border border-transparent"
                  }`}
                >
                  <span>{user.name}</span>
                  {selectedUsers.includes(user._id) && (
                    <span className="text-blue-500">✓</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setAssignModal(null)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Save Assignments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
