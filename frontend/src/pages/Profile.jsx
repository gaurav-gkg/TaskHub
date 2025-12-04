import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import AuthContext from "../context/AuthContext";
import { User, Mail, MessageCircle, Twitter, Wallet, Save } from "lucide-react";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    telegramUsername: "",
    twitterUsername: "",
    walletAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      console.log("Profile data:", res.data);
      setFormData({
        name: res.data.name || "",
        telegramUsername: res.data.telegramUsername || "",
        twitterUsername: res.data.twitterUsername || "",
        walletAddress: res.data.walletAddress || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      console.error("Error details:", error.response?.data);
      const errorMsg =
        error.response?.data?.message || "Failed to load profile";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.put("/user/profile", {
        walletAddress: formData.walletAddress,
      });

      setMessage({
        type: "success",
        text: "Wallet address updated successfully!",
      });

      // Update user context if needed
      if (user) {
        setUser({ ...user, walletAddress: formData.walletAddress });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/20 text-green-500 border border-green-500"
              : "bg-red-500/20 text-red-500 border border-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name - Read Only */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              disabled
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white cursor-not-allowed opacity-60"
            />
            <p className="text-xs text-gray-400 mt-1">Name cannot be changed</p>
          </div>

          {/* Telegram Username - Read Only */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Telegram Username
            </label>
            <div className="flex items-center">
              <span className="bg-gray-700 border border-gray-600 border-r-0 rounded-l px-4 py-3 text-gray-400">
                @
              </span>
              <input
                type="text"
                value={formData.telegramUsername}
                disabled
                className="flex-1 bg-gray-700 border border-gray-600 rounded-r px-4 py-3 text-white cursor-not-allowed opacity-60"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Telegram username cannot be changed
            </p>
          </div>

          {/* Twitter Username - Read Only */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Twitter className="w-4 h-4 mr-2" />
              Twitter Username
            </label>
            <div className="flex items-center">
              <span className="bg-gray-700 border border-gray-600 border-r-0 rounded-l px-4 py-3 text-gray-400">
                @
              </span>
              <input
                type="text"
                value={formData.twitterUsername}
                disabled
                className="flex-1 bg-gray-700 border border-gray-600 rounded-r px-4 py-3 text-white cursor-not-allowed opacity-60"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Twitter username cannot be changed
            </p>
          </div>

          {/* Wallet Address - Editable */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              Wallet Address
              <span className="ml-2 text-green-500 text-xs">(Editable)</span>
            </label>
            <input
              type="text"
              value={formData.walletAddress}
              onChange={(e) =>
                setFormData({ ...formData, walletAddress: e.target.value })
              }
              placeholder="Enter your wallet address"
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              You can update your wallet address anytime
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Account Type:</span>
            <span className="font-medium capitalize">{user?.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Account Status:</span>
            <span
              className={`font-medium capitalize ${
                user?.status === "approved"
                  ? "text-green-500"
                  : user?.status === "pending"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {user?.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
