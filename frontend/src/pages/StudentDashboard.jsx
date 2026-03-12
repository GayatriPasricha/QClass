import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, GraduationCap, LogOut, Clock, BookOpen, ScanLine } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [joining, setJoining] = useState(false);
    const [joinError, setJoinError] = useState('');
    const [joinSuccess, setJoinSuccess] = useState('');
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const { data } = await API.get('/classrooms/student');
            setClassrooms(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;
        setJoining(true);
        setJoinError('');
        setJoinSuccess('');
        try {
            const { data } = await API.post('/classrooms/join', { code: code.trim() });
            setJoinSuccess(`Joined "${data.classroom.name}" successfully!`);
            setCode('');
            fetchClassrooms();
        } catch (err) {
            setJoinError(err.response?.data?.message || 'Could not join classroom.');
        } finally {
            setJoining(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <div className="min-h-screen bg-[#0f1117]">
            <header className="sticky top-0 z-50 bg-[#0f1117]/80 backdrop-blur-xl border-b border-[#2a2d3e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <GraduationCap size={18} className="text-white" />
                        </div>
                        <span className="font-poppins font-bold text-xl text-white">Q<span className="text-indigo-400">Class</span></span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-sm text-gray-400">🎓 {user?.name}</span>
                        <button onClick={handleLogout} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <div className="mb-10 animate-slide-up">
                    <h1 className="font-poppins font-bold text-3xl text-white mb-1">Hey, {user?.name?.split(' ')[0]} 👋</h1>
                    <p className="text-gray-400">Join a classroom to start asking questions live.</p>
                </div>

                {/* Join Classroom Card */}
                <div className="card mb-8 animate-slide-up">
                    <h2 className="font-poppins font-semibold text-lg text-white mb-4 flex items-center gap-2">
                        <LogIn size={20} className="text-indigo-400" /> Join a Classroom
                    </h2>
                    <form onSubmit={handleJoin} className="flex gap-3">
                        <input
                            id="classroom-code-input"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="Enter classroom code (e.g. AB12CD)"
                            className="input-field flex-1 uppercase tracking-widest font-mono"
                            maxLength={6}
                        />
                        <button
                            id="join-classroom-btn"
                            type="submit"
                            disabled={joining}
                            className="btn-primary px-5 flex items-center gap-2 whitespace-nowrap"
                        >
                            {joining ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Join'}
                        </button>
                    </form>
                    {joinError && <p className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{joinError}</p>}
                    {joinSuccess && <p className="mt-3 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">✓ {joinSuccess}</p>}
                </div>

                {/* Recent Classrooms */}
                <div>
                    <h2 className="font-poppins font-semibold text-xl text-white mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-gray-400" /> Your Classrooms
                    </h2>
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : classrooms.length === 0 ? (
                        <div className="card text-center py-14">
                            <BookOpen size={36} className="text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">You haven't joined any classrooms yet.</p>
                            <p className="text-gray-600 text-sm mt-1">Use a classroom code above to join one.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {classrooms.map((c) => (
                                <div key={c._id} className="card flex items-center justify-between hover:border-emerald-500/30 transition-all duration-200 group">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <BookOpen size={18} className="text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-poppins font-semibold text-white">{c.name}</h3>
                                            <p className="text-sm text-gray-400">{c.subject} · by {c.teacher?.name || 'Teacher'}</p>
                                        </div>
                                    </div>
                                    <Link to={`/classroom/${c._id}`} className="btn-primary text-sm py-2 px-4 ml-4 whitespace-nowrap flex-shrink-0">
                                        Enter
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
