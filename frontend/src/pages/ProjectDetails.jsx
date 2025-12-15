import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Upload,
  X,
  Calendar,
  AlertCircle
} from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const ProjectDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null); // Ideally fetch project details too
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null); // taskId being submitted
  const [tweetLink, setTweetLink] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/user/projects/${id}/tasks`);
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + screenshots.length > 5) {
      alert("You can upload maximum 5 screenshots");
      return;
    }

    setScreenshots([...screenshots, ...files]);

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setScreenshotPreviews([...screenshotPreviews, ...newPreviews]);
  };

  const removeScreenshot = (index) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index);
    const newPreviews = screenshotPreviews.filter((_, i) => i !== index);

    // Revoke the URL to free memory
    URL.revokeObjectURL(screenshotPreviews[index]);

    setScreenshots(newScreenshots);
    setScreenshotPreviews(newPreviews);
  };

  const handleSubmit = async (taskId) => {
    try {
      const formData = new FormData();
      formData.append("tweetLink", tweetLink);

      // Append all screenshot files
      screenshots.forEach((file) => {
        formData.append("screenshots", file);
      });

      await api.post(`/user/tasks/${taskId}/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh tasks
      const res = await api.get(`/user/projects/${id}/tasks`);
      setTasks(res.data);
      setSubmitting(null);
      setTweetLink("");
      setScreenshots([]);
      setScreenshotPreviews([]);
    } catch (error) {
      alert(error.response?.data?.message || "Submission failed");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Project Tasks</h1>
      <div className="space-y-6">
        {tasks.map((task) => (
          <Card key={task._id} className="overflow-hidden border-gray-700/50 bg-gray-800/50 hover:border-gray-600 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-xl text-white mb-2">{task.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide">
                      {task.type}
                    </span>
                    {task.requiresScreenshots && (
                      <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                        <Upload className="w-3 h-3" /> Screenshots Required
                      </span>
                    )}
                    {task.deadline && (
                      <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {/* Status Badge for non-submitting state */}
                {task.submissionStatus !== "none" && (
                  <div className="flex items-center gap-2">
                    {task.submissionStatus === "submitted" && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-sm font-medium">
                        <Clock className="w-4 h-4" /> Pending Review
                      </span>
                    )}
                    {task.submissionStatus === "approved" && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Approved
                      </span>
                    )}
                    {task.submissionStatus === "rejected" && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-medium">
                        <XCircle className="w-4 h-4" /> Rejected
                      </span>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="pb-4">
              <p className="text-gray-300 leading-relaxed">{task.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center text-xs text-gray-500">
                <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-900/30 border-t border-gray-700/50 p-4">
              <div className="w-full">
                {task.submissionStatus === "none" ? (
                  submitting === task._id ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Submission Details</label>
                        <Input
                          type="text"
                          placeholder="Paste your tweet link here..."
                          value={tweetLink}
                          onChange={(e) => setTweetLink(e.target.value)}
                          className="bg-gray-800 border-gray-600 focus:border-blue-500"
                        />
                      </div>

                      {/* File upload section */}
                      {task.requiresScreenshots && (
                        <div className="space-y-3">
                          <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-gray-800 border-2 border-gray-600 border-dashed rounded-lg hover:bg-gray-700/50 hover:border-gray-500 cursor-pointer group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-blue-400 transition-colors" />
                              <p className="mb-1 text-sm text-gray-400 group-hover:text-gray-300">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                Max 5 screenshots (PNG, JPG)
                              </p>
                            </div>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>

                          {/* Preview uploaded images */}
                          {screenshotPreviews.length > 0 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                              {screenshotPreviews.map((preview, index) => (
                                <div key={index} className="relative group aspect-square">
                                  <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg border border-gray-600"
                                  />
                                  <button
                                    onClick={() => removeScreenshot(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => handleSubmit(task._id)}
                          disabled={
                            !tweetLink.trim() ||
                            (task.requiresScreenshots && screenshots.length === 0)
                          }
                          className="flex-1"
                        >
                          Submit Work
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSubmitting(null);
                            setTweetLink("");
                            setScreenshots([]);
                            setScreenshotPreviews([]);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSubmitting(task._id)}
                      className="w-full sm:w-auto"
                    >
                      Submit Work
                    </Button>
                  )
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-gray-400">
                      Submission sent on {task.submission?.createdAt ? new Date(task.submission.createdAt).toLocaleDateString() : 'Unknown date'}
                    </span>
                    {task.submission?.tweetLink && (
                      <a
                        href={task.submission.tweetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                      >
                        View Submission <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No active tasks found for this project.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
