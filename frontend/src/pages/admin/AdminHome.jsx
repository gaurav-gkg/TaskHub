import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminHome = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        userCount: 0,
        projectCount: 0,
        activeBountiesCount: 0,
        pendingSubmissionsCount: 0,
        recentSubmissions: [],
        recentUsers: [],
        recentBounties: [],
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setError(null);
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
                setError(error.response?.data?.message || 'Failed to load dashboard statistics. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Users', value: stats.userCount, color: 'text-blue-500' },
        { title: 'Total Projects', value: stats.projectCount, color: 'text-green-500' },
        { title: 'Active Bounties', value: stats.activeBountiesCount, color: 'text-purple-500' },
        { title: 'Pending Submissions', value: stats.pendingSubmissionsCount, color: 'text-yellow-500' },
    ];

    if (loading) {
        return <div className="text-center py-8 text-text-secondary">Loading dashboard...</div>;
    }

    if (error) {
        return (
            <div className="p-4 bg-danger/10 text-danger rounded-lg border border-danger/20">
                <p className="font-medium">Error loading dashboard:</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
                <div className="space-x-2">
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate('/admin/bounties')}
                    >
                        Create Bounty
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate('/admin/projects')}
                    >
                        Create Project
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-text-secondary">
                                {stat.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Submissions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="pb-2 text-sm font-medium text-text-secondary">User</th>
                                        <th className="pb-2 text-sm font-medium text-text-secondary">Task</th>
                                        <th className="pb-2 text-sm font-medium text-text-secondary">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {stats.recentSubmissions && stats.recentSubmissions.length > 0 ? (
                                        stats.recentSubmissions.map((sub) => (
                                            <tr key={sub._id}>
                                                <td className="py-2 text-sm text-text-primary">{sub.userId?.name || 'Unknown'}</td>
                                                <td className="py-2 text-sm text-text-secondary">{sub.taskId?.title || 'Unknown'}</td>
                                                <td className="py-2 text-sm">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${sub.status === 'approved' ? 'bg-success/10 text-success' :
                                                        sub.status === 'rejected' ? 'bg-danger/10 text-danger' :
                                                            'bg-primary/10 text-primary'
                                                        }`}>
                                                        {sub.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="py-4 text-center text-sm text-text-secondary">No recent submissions</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-right">
                            <Link to="/admin/submissions" className="text-sm text-primary hover:underline">View All</Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Users */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="pb-2 text-sm font-medium text-text-secondary">Name</th>
                                        <th className="pb-2 text-sm font-medium text-text-secondary">Email</th>
                                        <th className="pb-2 text-sm font-medium text-text-secondary">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {stats.recentUsers && stats.recentUsers.length > 0 ? (
                                        stats.recentUsers.map((user) => (
                                            <tr key={user._id}>
                                                <td className="py-2 text-sm text-text-primary">{user.name}</td>
                                                <td className="py-2 text-sm text-text-secondary">{user.email}</td>
                                                <td className="py-2 text-sm">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'approved' ? 'bg-success/10 text-success' :
                                                        user.status === 'rejected' ? 'bg-danger/10 text-danger' :
                                                            'bg-primary/10 text-primary'
                                                        }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="py-4 text-center text-sm text-text-secondary">No recent users</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-right">
                            <Link to="/admin/users" className="text-sm text-primary hover:underline">View All</Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminHome;
