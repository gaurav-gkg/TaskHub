import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import {
    LayoutDashboard,
    Briefcase,
    Trophy,
    User,
    LogOut,
    Users,
    FileText,
    Settings
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const userLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/bounties', label: 'Bounties', icon: Trophy },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    const adminLinks = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/projects', label: 'Projects', icon: Briefcase },
        { path: '/admin/bounties', label: 'Bounties', icon: Trophy },
        { path: '/admin/submissions', label: 'Submissions', icon: FileText },
        { path: '/admin/export-data', label: 'Export Data', icon: Settings },
    ];

    const links = user?.role === 'admin' ? adminLinks : userLinks;

    return (
        <div className="w-64 h-full bg-surface border-r border-border flex flex-col">
            <div className="p-6 border-b border-border flex items-center gap-3">
                <img src="/logo.png" alt="TaskHub" className="w-8 h-8" />
                <h1 className="text-2xl font-bold text-primary tracking-tight">TaskHub</h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        link.path === '/admin' || link.path === '/dashboard'
                            ? location.pathname === link.path
                            : location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-secondary hover:bg-surfaceHover hover:text-text-primary'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-text-secondary hover:bg-danger/10 hover:text-danger transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
