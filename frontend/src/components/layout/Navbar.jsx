import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
    const { user } = useContext(AuthContext);

    return (
        <header className="h-16 bg-surface/50 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 text-text-secondary hover:text-primary transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                {/* Search Bar (Optional) */}
                <div className="relative w-64 hidden md:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-surfaceHover border border-border rounded-full pl-10 pr-4 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                </button>

                <div className="flex items-center space-x-3 pl-4 border-l border-border">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                        <p className="text-xs text-text-muted capitalize">{user?.role}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
