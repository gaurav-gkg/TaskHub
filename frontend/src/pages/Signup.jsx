import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        telegramUsername: '',
        twitterUsername: '',
        walletAddress: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const res = await signup(formData);
            setSuccess(res.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
            <div className="mb-8 flex items-center gap-3">
                <img src="/logo.png" alt="TaskHub" className="w-10 h-10" />
                <span className="text-2xl font-bold text-primary">TaskHub</span>
            </div>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                    <p className="text-text-secondary text-center mt-2">Join TaskHub today</p>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-lg mb-6 text-sm">
                            {success}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                        <Input
                            label="Telegram Username"
                            name="telegramUsername"
                            value={formData.telegramUsername}
                            onChange={handleChange}
                            placeholder="@username"
                            required
                        />
                        <Input
                            label="Twitter Username"
                            name="twitterUsername"
                            value={formData.twitterUsername}
                            onChange={handleChange}
                            placeholder="@username"
                            required
                        />
                        <Input
                            label="Wallet Address (Optional)"
                            name="walletAddress"
                            value={formData.walletAddress}
                            onChange={handleChange}
                            placeholder="0x..."
                        />
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                        <Button
                            type="submit"
                            className="w-full mt-2"
                            isLoading={loading}
                        >
                            Sign Up
                        </Button>
                    </form>
                    <div className="mt-6 text-center text-sm text-text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primaryHover font-medium">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Signup;
