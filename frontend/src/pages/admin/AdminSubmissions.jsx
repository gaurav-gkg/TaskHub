import { useState, useEffect } from "react";
import api, { BASE_URL } from "../../services/api";
import {
  ExternalLink,
  Check,
  X,
  Image,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("submitted");
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/submissions?status=${filter}`);
      setSubmissions(res.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status, comment = "") => {
    try {
      await api.put(`/admin/submissions/${id}`, {
        status,
        adminComment: comment,
      });
      fetchSubmissions();
    } catch (error) {
      alert("Review failed");
    }
  };

  const openImageModal = (screenshots, index = 0) => {
    setSelectedImages(screenshots);
    setCurrentImageIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImages([]);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary">Task Submissions</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Submissions</CardTitle>
          <div className="flex space-x-2">
            {["submitted", "approved", "rejected"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "primary" : "secondary"}
                size="sm"
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8 text-text-secondary">Loading submissions...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surfaceHover/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-text-secondary">User</th>
                    <th className="px-6 py-4 text-sm font-medium text-text-secondary">Project / Task</th>
                    <th className="px-6 py-4 text-sm font-medium text-text-secondary">Link</th>
                    <th className="px-6 py-4 text-sm font-medium text-text-secondary">Screenshots</th>
                    <th className="px-6 py-4 text-sm font-medium text-text-secondary">Submitted</th>
                    <th className="px-6 py-4 text-sm font-medium text-text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {submissions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-surfaceHover/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-text-primary">{sub.userId?.name}</div>
                        <div className="text-sm text-text-secondary">
                          @{sub.userId?.telegramUsername}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-text-primary">{sub.projectId?.name}</div>
                        <div className="text-sm text-text-secondary line-clamp-1">
                          {sub.taskId?.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={sub.tweetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primaryHover flex items-center text-sm"
                        >
                          View Tweet <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        {sub.screenshots && sub.screenshots.length > 0 ? (
                          <div className="flex flex-col space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {sub.screenshots
                                .slice(0, 3)
                                .map((screenshot, idx) => (
                                  <img
                                    key={idx}
                                    src={`${BASE_URL}${screenshot}`}
                                    alt={`Screenshot ${idx + 1}`}
                                    className="w-12 h-12 object-cover rounded border border-border cursor-pointer hover:border-primary transition"
                                    onClick={() =>
                                      openImageModal(sub.screenshots, idx)
                                    }
                                  />
                                ))}
                              {sub.screenshots.length > 3 && (
                                <button
                                  onClick={() => openImageModal(sub.screenshots, 3)}
                                  className="w-12 h-12 bg-surfaceHover rounded border border-border hover:border-primary flex items-center justify-center text-xs text-text-secondary"
                                >
                                  +{sub.screenshots.length - 3}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-text-muted text-sm">
                            No screenshots
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-text-primary">{new Date(sub.createdAt).toLocaleDateString()}</div>
                          <div className="text-text-muted text-xs">
                            {new Date(sub.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {filter === "submitted" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleReview(sub._id, "approved")}
                              title="Approve"
                              className="px-2"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => {
                                const comment = prompt(
                                  "Reason for rejection (optional):"
                                );
                                if (comment !== null)
                                  handleReview(sub._id, "rejected", comment);
                              }}
                              title="Reject"
                              className="px-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        {filter !== "submitted" && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${sub.status === "approved"
                              ? "bg-success/10 text-success"
                              : "bg-danger/10 text-danger"
                              }`}
                          >
                            {sub.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-text-muted"
                      >
                        No submissions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Modal */}
      {showModal && selectedImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] bg-surface border border-border rounded-xl p-4 shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-4 -right-4 text-white bg-danger hover:bg-dangerHover rounded-full p-2 z-10 shadow-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Display */}
            <div className="flex items-center justify-center bg-black/50 rounded-lg overflow-hidden">
              <img
                src={`${BASE_URL}${selectedImages[currentImageIndex]}`}
                alt={`Screenshot ${currentImageIndex + 1}`}
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>

            {/* Navigation Controls */}
            {selectedImages.length > 1 && (
              <div className="flex items-center justify-between mt-4 px-4">
                <Button
                  variant="secondary"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-text-primary font-medium">
                  {currentImageIndex + 1} / {selectedImages.length}
                </span>
                <Button
                  variant="secondary"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}

            {/* Open in New Tab */}
            <div className="text-center mt-4">
              <a
                href={`${BASE_URL}${selectedImages[currentImageIndex]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primaryHover text-sm flex items-center justify-center font-medium"
              >
                Open original in new tab <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
