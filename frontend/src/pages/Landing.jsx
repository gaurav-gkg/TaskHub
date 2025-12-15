import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { ArrowRight, CheckCircle, Zap, Shield } from "lucide-react";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background -z-10" />

        <nav className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="TaskHub" className="w-8 h-8" />
            <span className="text-xl font-bold text-primary">TaskHub</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-surface border border-border text-sm text-primary mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            v2.0 is now live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Manage Projects & <br />
            <span className="bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
              Earn Crypto Bounties
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            The decentralized platform for project management and task verification.
            Collaborate, complete tasks, and get rewarded instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto group">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-surface/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Zap}
            title="Instant Rewards"
            description="Complete tasks and receive bounty payments directly to your wallet."
          />
          <FeatureCard
            icon={Shield}
            title="Verified Tasks"
            description="Admins review submissions to ensure quality and authenticity."
          />
          <FeatureCard
            icon={CheckCircle}
            title="Project Tracking"
            description="Keep track of progress with our intuitive dashboard and analytics."
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-colors duration-300">
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-text-secondary">{description}</p>
  </div>
);

export default Landing;
