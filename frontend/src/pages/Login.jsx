import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [googleUser, setGoogleUser] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    useEffect(() => {
        if (!googleClientId) {
            console.warn("Google Client ID is missing. Google Sign-In button will not render.");
            return;
        }

        const initGoogle = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: googleClientId,
                    callback: handleGoogleResponse,
                });
                window.google.accounts.id.renderButton(
                    document.getElementById('googleSignInButton'),
                    {
                        theme: 'filled_black',
                        size: 'large',
                        width: '100%',
                        text: 'signin_with',
                        shape: 'rectangular',
                    }
                );
            } else {
                setTimeout(initGoogle, 500);
            }
        };

        initGoogle();
    }, [googleClientId]);

    const handleGoogleResponse = async (response) => {
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/google', { credential: response.credential });
            login(data);
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.status === 404) {
                // User does not exist, open the role selection modal
                setGoogleUser({
                    credential: response.credential,
                    email: err.response.data.email,
                    name: err.response.data.name,
                    avatar: err.response.data.avatar,
                    googleId: err.response.data.googleId,
                });
                setShowRoleModal(true);
            } else {
                setError(err.response?.data?.message || 'Google login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterGoogle = async (role) => {
        setLoading(true);
        setError('');
        setShowRoleModal(false);
        try {
            const { data } = await API.post('/auth/google', {
                credential: googleUser.credential,
                role,
            });
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Google registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/login', form);
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative w-full max-w-md animate-fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:bg-indigo-500 transition-colors">
                            <GraduationCap size={20} className="text-white" />
                        </div>
                        <span className="font-poppins font-bold text-2xl text-white">Q<span className="text-indigo-400">Class</span></span>
                    </Link>
                    <h1 className="font-poppins font-bold text-3xl text-white mb-2">Welcome back</h1>
                    <p className="text-gray-400 text-sm">Sign in to your workspace</p>
                </div>

                <div className="card">
                    {error && (
                        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                            {error}
                        </div>
                    )}
                    
                    {!googleClientId && (
                        <div className="mb-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs rounded-xl px-4 py-3">
                            Google Sign-in is available! To configure it, set <code className="bg-amber-950/40 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> in your frontend .env file.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm text-gray-400">Password</label>
                                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input-field pl-10 pr-10"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button
                            id="login-btn"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign in to Workspace'}
                        </button>
                    </form>

                    {googleClientId && (
                        <>
                            <div className="relative my-5">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700/50"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#161922] px-3 text-gray-500 font-medium">Or continue with</span>
                                </div>
                            </div>

                            <div className="w-full flex justify-center">
                                <div id="googleSignInButton" className="w-full"></div>
                            </div>
                        </>
                    )}

                    <p className="text-center text-sm text-gray-500 mt-5">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Create one</Link>
                    </p>
                </div>
            </div>

            {/* Role Selection Modal for Google Auth */}
            {showRoleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-sm p-6 bg-[#161922]/95 border border-gray-700/50 rounded-2xl shadow-2xl backdrop-blur-xl">
                        <div className="text-center mb-6">
                            {googleUser?.avatar ? (
                                <img src={googleUser.avatar} alt="Avatar" className="w-16 h-16 rounded-full mx-auto border-2 border-indigo-500 mb-3 shadow-lg" />
                            ) : (
                                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg">
                                    {googleUser?.name?.charAt(0)}
                                </div>
                            )}
                            <h3 className="font-poppins font-bold text-xl text-white">Complete Your Registration</h3>
                            <p className="text-gray-400 text-xs mt-1.5">
                                Hi, <span className="text-white font-medium">{googleUser?.name}</span>! Select your role to continue.
                            </p>
                        </div>
                        
                        <div className="flex gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => handleRegisterGoogle('student')}
                                className="flex-1 py-5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 hover:border-indigo-500/40 text-white font-medium flex flex-col items-center gap-2 transition-all duration-200 shadow-md"
                            >
                                <span className="text-2xl">🎓</span>
                                <span className="text-sm">Student</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRegisterGoogle('teacher')}
                                className="flex-1 py-5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 hover:border-indigo-500/40 text-white font-medium flex flex-col items-center gap-2 transition-all duration-200 shadow-md"
                            >
                                <span className="text-2xl">👨‍🏫</span>
                                <span className="text-sm">Teacher</span>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowRoleModal(false)}
                            className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
