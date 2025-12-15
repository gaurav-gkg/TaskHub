import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Plus, Trash2, Edit, UserPlus, List, X } from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary">Projects</h1>
        <Button
          onClick={() => {
            setShowModal(true);
            setEditingId(null);
            setFormData({ name: "", description: "", imageUrl: "" });
            setImageFile(null);
            setImagePreview("");
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id} className="hover:border-primary/50 transition-colors">
            {project.imageUrl && (
              <div className="h-48 overflow-hidden border-b border-border">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <CardContent>
              <h3 className="text-xl font-bold mb-2 text-text-primary">{project.name}</h3>
              <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Link
                to={`/admin/projects/${project._id}/tasks`}
                className="text-primary hover:text-primaryHover flex items-center text-sm font-medium"
              >
                <List className="w-4 h-4 mr-1" /> Tasks
              </Link>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAssignModal(project)}
                  title="Assign Users"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
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
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(project._id)}
                  className="text-danger hover:text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md animate-fade-in">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{editingId ? "Edit Project" : "New Project"}</CardTitle>
              <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Project Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Project Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-border"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Project
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Assign Users Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[80vh] flex flex-col animate-fade-in">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Assign Users</CardTitle>
              <button onClick={() => setAssignModal(null)} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => toggleUserSelection(user._id)}
                    className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition-all ${selectedUsers.includes(user._id)
                        ? "bg-primary/10 border border-primary text-primary"
                        : "bg-surfaceHover border border-transparent hover:border-border"
                      }`}
                  >
                    <span className="font-medium">{user.name}</span>
                    {selectedUsers.includes(user._id) && (
                      <span className="text-primary">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => setAssignModal(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleAssignSubmit}>
                Save Assignments
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
