import { useState, useEffect } from "react";
import api from "../services/api";
import { ExternalLink, Clock, CheckCircle, XCircle, Timer, DollarSign, AlertCircle } from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

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

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Active Bounties</h1>
      {bounties.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No active bounties at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bounties.map((bounty) => (
            <Card key={bounty._id} className="border-gray-700/50 bg-gray-800/50 hover:border-gray-600 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl text-white mb-2">{bounty.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {bounty.reward}
                      </span>
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <div className="text-sm text-gray-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Duration: {bounty.durationHours}h {bounty.durationMinutes}m
                    </div>
                    <div className="text-yellow-500 font-semibold mt-1 flex items-center gap-1 text-sm">
                      <Timer className="w-4 h-4" />
                      {getTimeRemaining(bounty.endTime)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <p className="text-gray-300 leading-relaxed text-lg">{bounty.description}</p>
              </CardContent>

              <CardFooter className="bg-gray-900/30 border-t border-gray-700/50 p-6">
                <div className="w-full">
                  {bounty.hasSubmitted ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                        {bounty.userSubmission?.status === "submitted" && (
                          <>
                            <Clock className="w-6 h-6 text-yellow-500" />
                            <div>
                              <p className="text-yellow-500 font-medium">Submission Pending Review</p>
                              <p className="text-xs text-gray-500">Submitted just now</p>
                            </div>
                          </>
                        )}
                        {bounty.userSubmission?.status === "approved" && (
                          <>
                            <CheckCircle className="w-6 h-6 text-green-500" />
                            <div>
                              <p className="text-green-500 font-medium">Submission Approved!</p>
                              <p className="text-xs text-gray-500">Great job!</p>
                            </div>
                          </>
                        )}
                        {bounty.userSubmission?.status === "rejected" && (
                          <>
                            <XCircle className="w-6 h-6 text-red-500" />
                            <div>
                              <p className="text-red-500 font-medium">Submission Rejected</p>
                              <p className="text-xs text-gray-500">Check feedback and try again</p>
                            </div>
                          </>
                        )}
                      </div>

                      {bounty.userSubmission && (
                        <div className="pl-2 border-l-2 border-gray-700">
                          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Your Submission</p>
                          <a
                            href={bounty.userSubmission.submissionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 mb-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {bounty.userSubmission.submissionLink}
                          </a>
                          {bounty.userSubmission.description && (
                            <p className="text-sm text-gray-400 italic">
                              "{bounty.userSubmission.description}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : submitting === bounty._id ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-1 block">Submission Link <span className="text-red-400">*</span></label>
                          <Input
                            type="text"
                            placeholder="https://..."
                            value={submissionLink}
                            onChange={(e) => setSubmissionLink(e.target.value)}
                            className="bg-gray-800 border-gray-600 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-1 block">Description <span className="text-gray-500 text-xs">(Optional)</span></label>
                          <textarea
                            placeholder="Add any notes about your submission..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-h-[80px]"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleSubmit(bounty._id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Submit Entry
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSubmitting(null);
                            setSubmissionLink("");
                            setDescription("");
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSubmitting(bounty._id)}
                      className="w-full sm:w-auto px-8"
                    >
                      Submit Entry
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bounties;
