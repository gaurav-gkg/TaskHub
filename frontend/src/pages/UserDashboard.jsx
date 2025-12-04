import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">My Projects</h1>
            {projects.length === 0 ? (
                <p className="text-gray-400">No projects assigned yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link
                            key={project._id}
                            to={`/projects/${project._id}`}
                            className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition duration-300"
                        >
                            {project.imageUrl && (
                                <img
                                    src={project.imageUrl}
                                    alt={project.name}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-2">{project.name}</h2>
                                <p className="text-gray-400 line-clamp-3">{project.description}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${project.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-600 text-gray-300'
                                        }`}>
                                        {project.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
