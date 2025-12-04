import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import ProjectDetails from "./pages/ProjectDetails";
import Bounties from "./pages/Bounties";
import BountyDebug from "./pages/BountyDebug";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard"; // Placeholder

// Protected Route Component (Simple version for now)
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white font-sans">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute role="user">
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bounties"
              element={
                <ProtectedRoute role="user">
                  <Bounties />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bounty-debug"
              element={
                <ProtectedRoute role="user">
                  <BountyDebug />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute role="user">
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
