import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { LogOut, User, LayoutDashboard, Shield, Gift } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white">
              BountyPlatform
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      to="/bounties"
                      className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Bounties
                    </Link>
                    <Link
                      to="/profile"
                      className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
