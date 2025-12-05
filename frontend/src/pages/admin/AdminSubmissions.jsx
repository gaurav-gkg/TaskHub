import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  ExternalLink,
  Check,
  X,
  Image,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
    <div>
      <h1 className="text-2xl font-bold mb-6">Task Submissions</h1>

      <div className="flex space-x-4 mb-6">
        {["submitted", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded capitalize ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Project / Task</th>
                <th className="px-6 py-3">Link</th>
                <th className="px-6 py-3">Screenshots</th>
                <th className="px-6 py-3">Submitted</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {submissions.map((sub) => (
                <tr key={sub._id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{sub.userId?.name}</div>
                    <div className="text-sm text-gray-400">
                      @{sub.userId?.telegramUsername}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{sub.projectId?.name}</div>
                    <div className="text-sm text-gray-400">
                      {sub.taskId?.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={sub.tweetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      View Tweet <ExternalLink className="w-4 h-4 ml-1" />
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
                                src={`http://localhost:5000${screenshot}`}
                                alt={`Screenshot ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded border border-gray-600 cursor-pointer hover:border-blue-500 transition"
                                onClick={() =>
                                  openImageModal(sub.screenshots, idx)
                                }
                              />
                            ))}
                          {sub.screenshots.length > 3 && (
                            <button
                              onClick={() => openImageModal(sub.screenshots, 3)}
                              className="w-16 h-16 bg-gray-700 rounded border border-gray-600 hover:border-blue-500 flex items-center justify-center text-xs text-gray-300"
                            >
                              +{sub.screenshots.length - 3} more
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        No screenshots
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>{new Date(sub.createdAt).toLocaleDateString()}</div>
                      <div className="text-gray-400">
                        {new Date(sub.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {filter === "submitted" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReview(sub._id, "approved")}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const comment = prompt(
                              "Reason for rejection (optional):"
                            );
                            if (comment !== null)
                              handleReview(sub._id, "rejected", comment);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {filter !== "submitted" && (
                      <span
                        className={`px-2 py-1 rounded text-xs capitalize ${
                          sub.status === "approved"
                            ? "text-green-500"
                            : "text-red-500"
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
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Modal */}
      {showModal && selectedImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-gray-800 rounded-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full p-2 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Display */}
            <div className="flex items-center justify-center">
              <img
                src={`http://localhost:5000${selectedImages[currentImageIndex]}`}
                alt={`Screenshot ${currentImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded"
              />
            </div>

            {/* Navigation Controls */}
            {selectedImages.length > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={prevImage}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-white">
                  {currentImageIndex + 1} / {selectedImages.length}
                </span>
                <button
                  onClick={nextImage}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Open in New Tab */}
            <div className="text-center mt-2">
              <a
                href={`http://localhost:5000${selectedImages[currentImageIndex]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center"
              >
                Open in new tab <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
