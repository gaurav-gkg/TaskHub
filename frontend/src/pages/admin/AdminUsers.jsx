import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/users?status=${filter}`);
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const handleStatusUpdate = async (userId, newStatus) => {
        try {
            await api.put(`/admin/users/${userId}/status`, { status: newStatus });
            fetchUsers();
        } catch (error) {
            console.error('Update failed:', error);
            alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            <div className="flex space-x-4 mb-6">
                {['pending', 'approved', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded capitalize ${filter === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Telegram</th>
                                <th className="px-6 py-3">Twitter</th>
                                <th className="px-6 py-3">Wallet</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4">{user.name}</td>
                                    <td className="px-6 py-4">{user.telegramUsername}</td>
                                    <td className="px-6 py-4">{user.twitterUsername}</td>
                                    <td className="px-6 py-4 font-mono text-sm">{user.walletAddress || '-'}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        {filter === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {filter === 'approved' && (
                                            <button
                                                onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Reject
                                            </button>
                                        )}
                                        {filter === 'rejected' && (
                                            <button
                                                onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
