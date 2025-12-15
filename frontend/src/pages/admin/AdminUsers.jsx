import { useState, useEffect } from 'react';
import api from '../../services/api';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">User Management</h1>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Users</CardTitle>
                    <div className="flex space-x-2">
                        {['pending', 'approved', 'rejected'].map((status) => (
                            <Button
                                key={status}
                                variant={filter === status ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => setFilter(status)}
                                className="capitalize"
                            >
                                {status}
                            </Button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-text-secondary">Loading users...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 text-sm font-medium text-text-secondary">Name</th>
                                        <th className="px-4 py-3 text-sm font-medium text-text-secondary">Telegram</th>
                                        <th className="px-4 py-3 text-sm font-medium text-text-secondary">Twitter</th>
                                        <th className="px-4 py-3 text-sm font-medium text-text-secondary">Wallet</th>
                                        <th className="px-4 py-3 text-sm font-medium text-text-secondary">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {users
                                        .filter(user => user.telegramUsername !== 'admin' && user.role !== 'admin')
                                        .map((user) => (
                                            <tr key={user._id} className="hover:bg-surfaceHover/50 transition-colors">
                                                <td className="px-4 py-3 text-text-primary font-medium">{user.name}</td>
                                                <td className="px-4 py-3 text-text-secondary">{user.telegramUsername}</td>
                                                <td className="px-4 py-3 text-text-secondary">{user.twitterUsername}</td>
                                                <td className="px-4 py-3 text-text-secondary font-mono text-xs">{user.walletAddress || '-'}</td>
                                                <td className="px-4 py-3 space-x-2">
                                                    {filter === 'pending' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="success"
                                                                onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="danger"
                                                                onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                    {filter === 'approved' && (
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                        >
                                                            Reject
                                                        </Button>
                                                    )}
                                                    {filter === 'rejected' && (
                                                        <Button
                                                            size="sm"
                                                            variant="success"
                                                            onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                        >
                                                            Approve
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-text-muted">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminUsers;
