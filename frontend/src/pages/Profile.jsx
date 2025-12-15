import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import AuthContext from "../context/AuthContext";
import { User, Mail, MessageCircle, Twitter, Wallet, Save, Shield, CheckCircle, AlertCircle } from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

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
      <h1 className="text-3xl font-bold mb-8 text-white">My Profile</h1>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === "success"
              ? "bg-green-500/10 text-green-500 border border-green-500/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20"
            }`}
        >
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-gray-700/50 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                <span className="text-gray-400 text-sm">Role</span>
                <span className="font-medium capitalize text-white bg-gray-700 px-2 py-1 rounded text-xs">
                  {user?.role}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                <span className="text-gray-400 text-sm">Status</span>
                <span
                  className={`font-medium capitalize px-2 py-1 rounded text-xs ${user?.status === "approved"
                      ? "bg-green-500/10 text-green-500"
                      : user?.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                >
                  {user?.status}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-2">
          <Card className="border-gray-700/50 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl text-white">Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name - Read Only */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-400" />
                    Name
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    disabled
                    className="bg-gray-900/50 border-gray-700 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Name cannot be changed</p>
                </div>

                {/* Telegram Username - Read Only */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-blue-400" />
                    Telegram Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                    <Input
                      type="text"
                      value={formData.telegramUsername}
                      disabled
                      className="pl-8 bg-gray-900/50 border-gray-700 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Telegram username cannot be changed
                  </p>
                </div>

                {/* Twitter Username - Read Only */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                    <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                    Twitter Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                    <Input
                      type="text"
                      value={formData.twitterUsername}
                      disabled
                      className="pl-8 bg-gray-900/50 border-gray-700 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Twitter username cannot be changed
                  </p>
                </div>

                {/* Wallet Address - Editable */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center justify-between">
                    <div className="flex items-center">
                      <Wallet className="w-4 h-4 mr-2 text-blue-400" />
                      Wallet Address
                    </div>
                    <span className="text-green-400 text-xs bg-green-500/10 px-2 py-0.5 rounded">Editable</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.walletAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, walletAddress: e.target.value })
                    }
                    placeholder="Enter your wallet address"
                    className="bg-gray-900/50 border-gray-600 focus:border-blue-500 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can update your wallet address anytime
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
