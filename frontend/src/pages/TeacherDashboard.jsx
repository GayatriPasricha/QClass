import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Users, BookOpen, MessageSquare, CheckCircle, Copy, LogOut, GraduationCap, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({ totalClassrooms: 0, totalStudents: 0, questionsToday: 0, answeredQuestions: 0 });
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', subject: '', description: '' });
    const [creating, setCreating] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [classroomsRes, dashRes] = await Promise.all([
                API.get('/classrooms/teacher'),
                API.get('/analytics/dashboard'),
            ]);
            setClassrooms(classroomsRes.data);
            setStats(dashRes.data.metrics);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const { data } = await API.post('/classrooms', form);
            setClassrooms([data, ...classrooms]);
            setShowModal(false);
            setForm({ name: '', subject: '', description: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setCreating(false);
        }
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleLogout = () => { logout(); navigate('/'); };

    const statCards = [
        { label: 'Classrooms', value: stats.totalClassrooms, icon: <BookOpen size={20} />, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { label: 'Students', value: stats.totalStudents, icon: <Users size={20} />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { label: "Today's Questions", value: stats.questionsToday, icon: <MessageSquare size={20} />, color: 'text-violet-400', bg: 'bg-violet-400/10' },
        { label: 'Answered', value: stats.answeredQuestions, icon: <CheckCircle size={20} />, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    ];

    return (
        <div className="min-h-screen bg-[#0f1117]">
            {/* Sidebar-style top header */}
            <header className="sticky top-0 z-50 bg-[#0f1117]/80 backdrop-blur-xl border-b border-[#2a2d3e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <GraduationCap size={18} className="text-white" />
                        </div>
                        <span className="font-poppins font-bold text-xl text-white">Q<span className="text-indigo-400">Class</span></span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-sm text-gray-400">👨‍🏫 {user?.name}</span>
                        <button onClick={handleLogout} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {/* Welcome */}
                <div className="mb-10 animate-slide-up">
                    <h1 className="font-poppins font-bold text-3xl text-white mb-1">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                    <p className="text-gray-400">Here's an overview of your classroom activity.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {statCards.map((s, i) => (
                        <div key={i} className="stat-card animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center ${s.color} mb-3`}>
                                {s.icon}
                            </div>
                            <p className="text-3xl font-poppins font-bold text-white">{s.value}</p>
                            <p className="text-sm text-gray-400">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Classrooms */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-poppins font-semibold text-xl text-white">My Classrooms</h2>
                    <button id="create-classroom-btn" onClick={() => setShowModal(true)} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                        <Plus size={16} /> New Classroom
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : classrooms.length === 0 ? (
                    <div className="card text-center py-16">
                        <BookOpen size={40} className="text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400 mb-4">No classrooms yet. Create one to get started!</p>
                        <button onClick={() => setShowModal(true)} className="btn-primary px-6">Create Classroom</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classrooms.map((c) => (
                            <div key={c._id} className="card hover:border-indigo-500/40 transition-all duration-200 hover:-translate-y-0.5 group">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="badge bg-indigo-500/20 text-indigo-300">{c.subject}</span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1"><Users size={12} /> {c.students.length}</span>
                                </div>
                                <h3 className="font-poppins font-semibold text-white text-lg mb-1">{c.name}</h3>
                                <div className="flex items-center gap-1.5 mb-4">
                                    <span className="text-sm font-mono text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-lg">{c.code}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/classroom/${c._id}`} className="btn-primary flex-1 text-xs text-center py-2 px-3">
                                        Enter
                                    </Link>
                                    <button
                                        onClick={() => copyCode(c.code)}
                                        className={`btn-secondary text-xs py-2 px-3 flex items-center gap-1 flex-1 justify-center transition-all ${copiedCode === c.code ? 'text-emerald-400 border-emerald-500/40' : ''}`}
                                    >
                                        {copiedCode === c.code ? <CheckCircle size={13} /> : <Copy size={13} />}
                                        {copiedCode === c.code ? 'Copied!' : 'Copy Code'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Classroom Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
                    <div className="card w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-poppins font-semibold text-xl text-white">Create Classroom</h2>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2d3e] transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Classroom Name</label>
                                <input id="classroom-name" name="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Machine Learning Basics" className="input-field" required />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Subject</label>
                                <input id="classroom-subject" name="subject" type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Computer Science" className="input-field" required />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Description <span className="text-gray-600">(optional)</span></label>
                                <textarea id="classroom-desc" name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." className="input-field resize-none h-20" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
                                <button id="create-classroom-submit" type="submit" disabled={creating} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
                                    {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={16} />}
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
