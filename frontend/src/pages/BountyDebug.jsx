import { useState, useEffect } from "react";
import api from "../services/api";

const BountyDebug = () => {
  const [bounties, setBounties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const res = await api.get("/user/bounties/all");
        setBounties(res.data);
      } catch (error) {
        console.error("Error fetching bounties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "long",
    });
  };

  const formatDateUTC = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Bounty Debug Information</h1>
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Current Time</h2>
        <p className="text-gray-400">UTC: {new Date().toISOString()}</p>
        <p className="text-gray-400">
          IST: {new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString()}{" "}
          (calculated)
        </p>
        <p className="text-gray-400">Local: {new Date().toLocaleString()}</p>
      </div>

      <div className="space-y-6">
        {bounties.map((bounty) => (
          <div
            key={bounty._id}
            className="bg-gray-800 rounded-lg p-6 border-2"
            style={{
              borderColor:
                bounty.status === "active"
                  ? "#22c55e"
                  : bounty.status === "upcoming"
                  ? "#3b82f6"
                  : "#6b7280",
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{bounty.title}</h2>
                <span
                  className={`px-3 py-1 rounded text-sm font-bold ${
                    bounty.status === "active"
                      ? "bg-green-500 text-white"
                      : bounty.status === "upcoming"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {bounty.status.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold text-xl">
                  {bounty.reward}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="font-bold mb-2">Duration</h3>
                <p className="text-2xl text-green-400">
                  {bounty.durationHours || 0}h {bounty.durationMinutes || 0}m
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="font-bold mb-2">Started At</h3>
                <p className="text-sm text-gray-300">
                  UTC: {formatDateUTC(bounty.startTime)}
                </p>
                <p className="text-sm text-green-400">
                  Local: {formatDate(bounty.startTime)}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-700 rounded">
              <h3 className="font-bold mb-2">Time Info</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Ends At (UTC): {formatDateUTC(bounty.endTime)}</div>
                <div>DB Status: {bounty.status}</div>
                <div>
                  Before End?{" "}
                  <span
                    className={
                      bounty.isBeforeEnd ? "text-green-400" : "text-red-400"
                    }
                  >
                    {bounty.isBeforeEnd ? "YES" : "NO"}
                  </span>
                </div>
                <div>
                  Should Be Active?{" "}
                  <span
                    className={
                      bounty.shouldBeActive
                        ? "text-green-400 font-bold"
                        : "text-gray-400"
                    }
                  >
                    {bounty.shouldBeActive ? "YES" : "NO"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BountyDebug;
