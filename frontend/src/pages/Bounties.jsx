import { useState, useEffect } from "react";
import api from "../services/api";
import { ExternalLink, Clock, CheckCircle, XCircle } from "lucide-react";

const Bounties = () => {
  const [bounties, setBounties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null); // bountyId being submitted
  const [submissionLink, setSubmissionLink] = useState("");
  const [description, setDescription] = useState("");

  const fetchBounties = async () => {
    try {
      const res = await api.get("/user/bounties/active");
      setBounties(res.data);
    } catch (error) {
      console.error("Error fetching bounties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBounties();
  }, []);

  const handleSubmit = async (bountyId) => {
    if (!submissionLink.trim()) {
      alert("Please provide a submission link");
      return;
    }

    try {
      await api.post(`/user/bounties/${bountyId}/submit`, {
        submissionLink,
        description,
      });
      setSubmitting(null);
      setSubmissionLink("");
      setDescription("");
      fetchBounties(); // Refresh to update status
      alert("Submission successful!");
    } catch (error) {
      alert(error.response?.data?.message || "Submission failed");
    }
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diffMs = end - now;

    if (diffMs <= 0) return "Ended";

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Active Bounties</h1>
      {bounties.length === 0 ? (
        <p className="text-gray-400">No active bounties at the moment.</p>
      ) : (
        <div className="space-y-6">
          {bounties.map((bounty) => (
            <div
              key={bounty._id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{bounty.title}</h2>
                  <p className="text-gray-400 mb-4">{bounty.description}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-green-400 font-bold text-xl">
                      {bounty.reward}
                    </span>
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm">
                      Active
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>
                      Duration: {bounty.durationHours}h {bounty.durationMinutes}
                      m
                    </div>
                    <div className="text-yellow-400 font-semibold mt-1">
                      {getTimeRemaining(bounty.endTime)}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {bounty.hasSubmitted ? (
                    <div className="text-center">
                      {bounty.userSubmission?.status === "submitted" && (
                        <div className="text-yellow-500 flex flex-col items-center gap-2">
                          <Clock className="w-8 h-8" />
                          <span className="text-sm">Pending Review</span>
                        </div>
                      )}
                      {bounty.userSubmission?.status === "approved" && (
                        <div className="text-green-500 flex flex-col items-center gap-2">
                          <CheckCircle className="w-8 h-8" />
                          <span className="text-sm">Approved</span>
                        </div>
                      )}
                      {bounty.userSubmission?.status === "rejected" && (
                        <div className="text-red-500 flex flex-col items-center gap-2">
                          <XCircle className="w-8 h-8" />
                          <span className="text-sm">Rejected</span>
                        </div>
                      )}
                    </div>
                  ) : submitting === bounty._id ? (
                    <div className="space-y-3 min-w-[300px]">
                      <input
                        type="text"
                        placeholder="Submission Link (Required)"
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none"
                      />
                      <textarea
                        placeholder="Description (Optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none"
                        rows="2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmit(bounty._id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => {
                            setSubmitting(null);
                            setSubmissionLink("");
                            setDescription("");
                          }}
                          className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSubmitting(bounty._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium"
                    >
                      Submit Entry
                    </button>
                  )}
                </div>
              </div>
              {bounty.hasSubmitted && bounty.userSubmission && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Your Submission:</p>
                  <a
                    href={bounty.userSubmission.submissionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {bounty.userSubmission.submissionLink}
                  </a>
                  {bounty.userSubmission.description && (
                    <p className="text-sm text-gray-400 mt-2">
                      {bounty.userSubmission.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bounties;
