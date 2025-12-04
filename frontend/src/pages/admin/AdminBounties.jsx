import { useState, useEffect } from "react";
import api from "../../services/api";
import { Plus, Edit, XCircle, Users } from "lucide-react";

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
      console.log("Fetched bounties:", res.data);
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
      console.log("Fetching submissions for bounty:", bountyId);
      const res = await api.get(
        `/admin/bounty-submissions?bountyId=${bountyId}`
      );
      console.log("Submissions response:", res.data);
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bounties</h1>
        <button
          onClick={() => {
            setShowModal(true);
            resetForm();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Bounty
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bounties.map((bounty) => (
          <div
            key={bounty._id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{bounty.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    bounty.status === "active"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-gray-600 text-gray-300"
                  }`}
                >
                  {bounty.status.toUpperCase()}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
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
                  className="text-gray-400 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {bounty.status !== "closed" && (
                  <button
                    onClick={() => closeBounty(bounty._id)}
                    className="text-red-400 hover:text-red-300"
                    title="Close Early"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-400 mb-4">{bounty.description}</p>
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-green-400 font-bold">{bounty.reward}</span>
              <div className="text-gray-500">
                <div>
                  Duration: {bounty.durationHours}h {bounty.durationMinutes}m
                </div>
                <div
                  className={
                    bounty.status === "active"
                      ? "text-yellow-400 font-semibold"
                      : ""
                  }
                >
                  {getTimeRemaining(bounty.endTime)}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
              <button
                onClick={() => viewSubmissions(bounty._id)}
                className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
              >
                <Users className="w-4 h-4 mr-1" />
                Submissions ({bounty.submissionCount || 0})
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Bounty" : "New Bounty"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
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
              <input
                type="text"
                placeholder="Reward (e.g. 50 USDT)"
                value={formData.reward}
                onChange={(e) =>
                  setFormData({ ...formData, reward: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                required
              />
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Duration
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Hours
                    </label>
                    <input
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
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Minutes
                    </label>
                    <input
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
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Bounty will be active immediately and close after this
                  duration
                </p>
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

      {/* Submissions Modal */}
      {showSubmissions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
            <h2 className="text-xl font-bold mb-4">Bounty Submissions</h2>
            <div className="flex-1 overflow-y-auto">
              {submissions.length === 0 ? (
                <p className="text-gray-400">No submissions yet.</p>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div key={sub._id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">
                            {sub.userId?.name || "Unknown User"}
                          </h4>
                          <p className="text-sm text-gray-400">
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
                          className={`px-2 py-1 rounded text-xs ${
                            sub.status === "approved"
                              ? "bg-green-500/20 text-green-500"
                              : sub.status === "rejected"
                              ? "bg-red-500/20 text-red-500"
                              : "bg-yellow-500/20 text-yellow-500"
                          }`}
                        >
                          {sub.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {sub.description}
                      </p>
                      <a
                        href={sub.submissionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm break-all"
                      >
                        {sub.submissionLink}
                      </a>
                      <div className="flex gap-2 mt-3">
                        {sub.status === "submitted" && (
                          <>
                            <button
                              onClick={() =>
                                updateSubmissionStatus(sub._id, "approved")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                updateSubmissionStatus(sub._id, "rejected")
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted: {new Date(sub.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowSubmissions(null)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBounties;
