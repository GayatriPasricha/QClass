import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Signup = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/register', form);
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Sign up failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4 py-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative w-full max-w-md animate-fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                            <GraduationCap size={20} className="text-white" />
                        </div>
                        <span className="font-poppins font-bold text-2xl text-white">Q<span className="text-indigo-400">Class</span></span>
                    </Link>
                    <h1 className="font-poppins font-bold text-3xl text-white mb-2">Create your account</h1>
                    <p className="text-gray-400 text-sm">Start your classroom Q&A journey</p>
                </div>

                <div className="card">
                    {/* Role Toggle */}
                    <div className="flex gap-2 bg-[#0f1117] rounded-xl p-1 mb-5">
                        {['student', 'teacher'].map((r) => (
                            <button
                                key={r}
                                type="button"
                                id={`role-${r}`}
                                onClick={() => setForm({ ...form, role: r })}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${form.role === r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                {r === 'student' ? '🎓' : '👨‍🏫'} {r}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Jane Smith" className="input-field pl-10" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-field pl-10" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="input-field pl-10" required />
                            </div>
                        </div>
                        <button
                            id="signup-btn"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
