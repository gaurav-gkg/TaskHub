import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

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
    const { signup } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await signup(formData);
            setSuccess(res.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded mb-4">
                        {success}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Telegram Username</label>
                        <input
                            type="text"
                            name="telegramUsername"
                            value={formData.telegramUsername}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Twitter Username</label>
                        <input
                            type="text"
                            name="twitterUsername"
                            value={formData.twitterUsername}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Wallet Address (Optional)</label>
                        <input
                            type="text"
                            name="walletAddress"
                            value={formData.walletAddress}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 mt-4"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
