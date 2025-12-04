import { useState, useEffect } from "react";
import api from "../../services/api";
import { ExternalLink, Check, X } from "lucide-react";

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("submitted");
  const [loading, setLoading] = useState(true);

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
                    colSpan="5"
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
    </div>
  );
};

export default AdminSubmissions;
