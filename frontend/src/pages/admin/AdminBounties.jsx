import { useState, useEffect } from "react";
import api from "../../services/api";
import { Plus, Edit, XCircle, Users, X, Clock, ExternalLink } from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const AdminBounties = () => {
  const [bounties, setBounties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward: "",
    durationHours: "1",
    durationMinutes: "0",
  });
  const [editingId, setEditingId] = useState(null);
  const [showSubmissions, setShowSubmissions] = useState(null); // bountyId
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchBounties();
  }, []);

  const fetchBounties = async () => {
    try {
      const res = await api.get("/admin/bounties");
      setBounties(res.data);
    } catch (error) {
      console.error("Error fetching bounties:", error);
      alert(
        "Failed to load bounties: " +
        (error.response?.data?.message || error.message)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        reward: formData.reward,
        durationHours: parseInt(formData.durationHours) || 0,
        durationMinutes: parseInt(formData.durationMinutes) || 0,
      };

      if (editingId) {
        await api.put(`/admin/bounties/${editingId}`, payload);
      } else {
        await api.post("/admin/bounties", payload);
      }
      setShowModal(false);
      resetForm();
      fetchBounties();
    } catch (error) {
      alert(
        "Operation failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const closeBounty = async (id) => {
    if (window.confirm("Close this bounty early?")) {
      await api.put(`/admin/bounties/${id}/close`);
      fetchBounties();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      reward: "",
      durationHours: "1",
      durationMinutes: "0",
    });
    setEditingId(null);
  };

  const getTimeRemaining = (endTime) => {
    if (!endTime) return "N/A";

    try {
      const now = new Date();
      const end = new Date(endTime);

      if (isNaN(end.getTime())) return "Invalid date";

      const diffMs = end - now;

      if (diffMs <= 0) return "Ended";

      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}m remaining`;
      }
      return `${minutes}m remaining`;
    } catch (error) {
      console.error("Error calculating time remaining:", error);
      return "Error";
    }
  };

  const viewSubmissions = async (bountyId) => {
    setShowSubmissions(bountyId);
    try {
      const res = await api.get(
        `/admin/bounty-submissions?bountyId=${bountyId}`
      );
      setSubmissions(res.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      alert(
        "Failed to load submissions: " +
        (error.response?.data?.message || error.message)
      );
    }
  };

  const updateSubmissionStatus = async (submissionId, status) => {
    try {
      await api.put(`/admin/bounty-submissions/${submissionId}`, { status });
      // Refresh submissions
      const res = await api.get(
        `/admin/bounty-submissions?bountyId=${showSubmissions}`
      );
      setSubmissions(res.data);
    } catch (error) {
      alert("Failed to update submission status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary">Bounties</h1>
        <Button
          onClick={() => {
            setShowModal(true);
            resetForm();
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Create Bounty
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bounties.map((bounty) => (
          <Card key={bounty._id} className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row justify-between items-start pb-2">
              <div>
                <h3 className="text-xl font-bold text-text-primary">{bounty.title}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${bounty.status === "active"
                      ? "bg-success/10 text-success"
                      : "bg-surfaceHover text-text-muted"
                    }`}
                >
                  {bounty.status.toUpperCase()}
                </span>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingId(bounty._id);
                    setFormData({
                      title: bounty.title,
                      description: bounty.description,
                      reward: bounty.reward,
                      durationHours: bounty.durationHours?.toString() || "1",
                      durationMinutes:
                        bounty.durationMinutes?.toString() || "0",
                    });
                    setShowModal(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                {bounty.status !== "closed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => closeBounty(bounty._id)}
                    title="Close Early"
                    className="text-danger hover:text-danger"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary mb-4 line-clamp-3">{bounty.description}</p>
              <div className="flex justify-between items-center text-sm p-3 bg-surfaceHover/30 rounded-lg">
                <span className="text-success font-bold text-lg">{bounty.reward}</span>
                <div className="text-right">
                  <div className="text-text-muted text-xs">
                    Duration: {bounty.durationHours}h {bounty.durationMinutes}m
                  </div>
                  <div
                    className={`flex items-center justify-end mt-1 ${bounty.status === "active"
                        ? "text-warning font-medium"
                        : "text-text-muted"
                      }`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {getTimeRemaining(bounty.endTime)}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                onClick={() => viewSubmissions(bounty._id)}
                className="w-full justify-center text-primary hover:text-primaryHover"
              >
                <Users className="w-4 h-4 mr-2" />
                View Submissions ({bounty.submissionCount || 0})
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md animate-fade-in">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{editingId ? "Edit Bounty" : "New Bounty"}</CardTitle>
              <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Title"
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
                <Input
                  label="Reward (e.g. 50 USDT)"
                  value={formData.reward}
                  onChange={(e) =>
                    setFormData({ ...formData, reward: e.target.value })
                  }
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Duration
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Hours"
                      type="number"
                      min="0"
                      max="168"
                      value={formData.durationHours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationHours: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      label="Minutes"
                      type="number"
                      min="0"
                      max="59"
                      value={formData.durationMinutes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationMinutes: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Bounty will be active immediately and close after this duration
                  </p>
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
                    Save Bounty
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[85vh] flex flex-col animate-fade-in">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Bounty Submissions</CardTitle>
              <button onClick={() => setShowSubmissions(null)} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto bg-surface/50">
              {submissions.length === 0 ? (
                <div className="text-center py-12 text-text-muted">No submissions yet.</div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div key={sub._id} className="bg-surface border border-border rounded-lg p-4 hover:border-border/80 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-text-primary">
                            {sub.userId?.name || "Unknown User"}
                          </h4>
                          <p className="text-sm text-text-secondary">
                            {sub.userId?.telegramUsername &&
                              `@${sub.userId.telegramUsername}`}
                            {sub.userId?.telegramUsername &&
                              sub.userId?.twitterUsername &&
                              " • "}
                            {sub.userId?.twitterUsername &&
                              `@${sub.userId.twitterUsername}`}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${sub.status === "approved"
                              ? "bg-success/10 text-success"
                              : sub.status === "rejected"
                                ? "bg-danger/10 text-danger"
                                : "bg-warning/10 text-warning"
                            }`}
                        >
                          {sub.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3 bg-surfaceHover/30 p-3 rounded-md">
                        {sub.description}
                      </p>
                      <a
                        href={sub.submissionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primaryHover text-sm break-all flex items-center mb-4"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        {sub.submissionLink}
                      </a>
                      <div className="flex justify-between items-center pt-3 border-t border-border/50">
                        <p className="text-xs text-text-muted">
                          Submitted: {new Date(sub.createdAt).toLocaleString()}
                        </p>
                        <div className="flex gap-2">
                          {sub.status === "submitted" && (
                            <>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() =>
                                  updateSubmissionStatus(sub._id, "approved")
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() =>
                                  updateSubmissionStatus(sub._id, "rejected")
                                }
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowSubmissions(null)}
              >
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminBounties;
