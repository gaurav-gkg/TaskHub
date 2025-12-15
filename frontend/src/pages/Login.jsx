import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
    const [telegramUsername, setTelegramUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(telegramUsername, password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="mb-8 flex items-center gap-3">
                <img src="/logo.png" alt="TaskHub" className="w-10 h-10" />
                <span className="text-2xl font-bold text-primary">TaskHub</span>
            </div>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                    <p className="text-text-secondary text-center mt-2">Login to access your dashboard</p>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Telegram Username"
                            value={telegramUsername}
                            onChange={(e) => setTelegramUsername(e.target.value)}
                            placeholder="@username"
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={loading}
                        >
                            Login
                        </Button>
                    </form>
                    <div className="mt-6 text-center text-sm text-text-secondary">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary hover:text-primaryHover font-medium">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
