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
} from "lucide-react";

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

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Tasks</h1>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
              <p className="text-gray-400 mb-2">{task.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                  {task.type.toUpperCase()}
                </span>
                {task.requiresScreenshots && (
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs flex items-center">
                    📸 Screenshots Required
                  </span>
                )}
                {task.deadline && (
                  <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">
                    📅 Due: {new Date(task.deadline).toLocaleDateString()}{" "}
                    {new Date(task.deadline).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Created: {new Date(task.createdAt).toLocaleDateString()} at{" "}
                {new Date(task.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="w-full md:w-auto">
              {task.submissionStatus === "none" ? (
                submitting === task._id ? (
                  <div className="flex flex-col gap-3 w-full">
                    <input
                      type="text"
                      placeholder="Tweet Link"
                      value={tweetLink}
                      onChange={(e) => setTweetLink(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* File upload section - Only show if task requires screenshots */}
                    {task.requiresScreenshots && (
                      <div className="space-y-2">
                        <label className="flex items-center justify-center w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded cursor-pointer hover:bg-gray-600 transition">
                          <Upload className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            Upload Screenshots (Max 5){" "}
                            <span className="text-red-400">*Required</span>
                          </span>
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
                          <div className="grid grid-cols-3 gap-2">
                            {screenshotPreviews.map((preview, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-20 object-cover rounded border border-gray-600"
                                />
                                <button
                                  onClick={() => removeScreenshot(index)}
                                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSubmit(task._id)}
                        disabled={
                          !tweetLink.trim() ||
                          (task.requiresScreenshots && screenshots.length === 0)
                        }
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium flex-1"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => {
                          setSubmitting(null);
                          setTweetLink("");
                          setScreenshots([]);
                          setScreenshotPreviews([]);
                        }}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSubmitting(task._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
                  >
                    Submit Work
                  </button>
                )
              ) : (
                <div className="flex items-center gap-2">
                  {task.submissionStatus === "submitted" && (
                    <span className="text-yellow-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Pending Review
                    </span>
                  )}
                  {task.submissionStatus === "approved" && (
                    <span className="text-green-500 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Approved
                    </span>
                  )}
                  {task.submissionStatus === "rejected" && (
                    <span className="text-red-500 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Rejected
                    </span>
                  )}
                  {task.submission && (
                    <a
                      href={task.submission.tweetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-gray-400">No active tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
