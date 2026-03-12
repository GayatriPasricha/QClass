import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Bell, User, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-[#0f1117]/80 backdrop-blur-xl border-b border-[#2a2d3e]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:bg-indigo-500 transition-colors">
                        <GraduationCap size={18} className="text-white" />
                    </div>
                    <span className="font-poppins font-bold text-xl text-white">Q<span className="text-indigo-400">Class</span></span>
                </Link>

                {/* Nav links */}
                {user ? (
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-sm text-gray-400">
                            {user.role === 'teacher' ? '👨‍🏫' : '🎓'} {user.name}
                        </span>
                        <Link to="/dashboard" className="btn-secondary text-sm py-2 px-4">Dashboard</Link>
                        <button onClick={handleLogout} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Login</Link>
                        <Link to="/signup" className="btn-primary text-sm py-2 px-4">Sign Up Free</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
