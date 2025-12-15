import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card, { CardContent } from '../components/ui/Card';

const UserDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/user/projects');
                setProjects(res.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8 text-white">My Projects</h1>
            {projects.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No projects assigned yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link
                            key={project._id}
                            to={`/projects/${project._id}`}
                            className="block group"
                        >
                            <Card className="h-full overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                                {project.imageUrl && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={project.imageUrl}
                                            alt={project.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                                    </div>
                                )}
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                            {project.name}
                                        </h2>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${project.status === 'active'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-gray-700/50 text-gray-400 border-gray-600'
                                            }`}>
                                            {project.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 line-clamp-3 text-sm leading-relaxed">
                                        {project.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
