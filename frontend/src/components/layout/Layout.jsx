import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const publicPaths = ['/', '/login', '/signup'];
    const isPublic = publicPaths.includes(location.pathname);

    // Close mobile menu on route change
    React.useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    if (isPublic) {
        return (
            <div className="min-h-screen bg-background text-text-primary font-sans antialiased">
                {children}
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background text-text-primary font-sans antialiased overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-64 bg-surface shadow-2xl animate-slide-right">
                        <Sidebar />
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
