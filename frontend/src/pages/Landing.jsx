import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
      <div className="text-center max-w-2xl px-4">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="TaskHub Logo" className="h-20 w-20" />
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Project & Bounty Management
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Manage projects, complete tasks, and earn rewards. A decentralized way
          to collaborate and grow.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
