import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ThumbsUp, Pin, CheckCircle, Send, ArrowLeft, GraduationCap, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const SOCKET_URL = 'http://localhost:5000';

const LiveClassroom = () => {
    const { classroomId } = useParams();
    const { user } = useAuth();
    const socketRef = useRef(null);

    const [classroom, setClassroom] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [questionText, setQuestionText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const isTeacher = user?.role === 'teacher';

    useEffect(() => {
        // Fetch initial classroom data
        const init = async () => {
            try {
                const [classroomRes, questionsRes] = await Promise.all([
                    API.get(`/classrooms/${classroomId}`),
                    API.get(`/questions/classroom/${classroomId}`),
                ]);
                setClassroom(classroomRes.data);
                setQuestions(questionsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        init();

        // Setup socket
        const socket = io(SOCKET_URL);
        socketRef.current = socket;

        socket.emit('join_classroom', { classroomId });

        socket.on('new_question', (question) => {
            setQuestions((prev) => [question, ...prev].sort((a, b) => b.upvotes.length - a.upvotes.length));
        });

        socket.on('question_upvoted', ({ questionId, upvotes }) => {
            setQuestions((prev) =>
                [...prev.map((q) => q._id === questionId ? { ...q, upvotes } : q)]
                    .sort((a, b) => b.upvotes.length - a.upvotes.length)
            );
            setActiveQuestion((prev) => prev?._id === questionId ? { ...prev, upvotes } : prev);
        });

        socket.on('question_status_changed', ({ questionId, status }) => {
            setQuestions((prev) =>
                prev.map((q) => q._id === questionId ? { ...q, status } : q)
            );
            setActiveQuestion((prev) => prev?._id === questionId ? { ...prev, status } : prev);
        });

        return () => {
            socket.emit('leave_classroom', { classroomId });
            socket.disconnect();
        };
    }, [classroomId]);

    const handleSubmitQuestion = (e) => {
        e.preventDefault();
        if (!questionText.trim() || submitting) return;
        setSubmitting(true);
        socketRef.current.emit('ask_question', {
            classroomId,
            studentId: user._id,
            text: questionText.trim(),
        });
        setQuestionText('');
        setTimeout(() => setSubmitting(false), 500);
    };

    const handleUpvote = (questionId) => {
        socketRef.current.emit('upvote_question', {
            questionId,
            studentId: user._id,
            classroomId,
        });
    };

    const handleTeacherAction = (questionId, action) => {
        socketRef.current.emit('teacher_action', { questionId, action, classroomId });
        if (action === 'pinned') {
            const q = questions.find((q) => q._id === questionId);
            setActiveQuestion(q);
        }
    };

    const statusColor = (status) => {
        if (status === 'answered') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
        if (status === 'pinned') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
        return 'text-gray-400 bg-[#2a2d3e] border-transparent';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1117] flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0c0f18]/90 backdrop-blur-xl border-b border-[#2a2d3e] flex-shrink-0">
                <div className="max-w-screen-2xl mx-auto px-4 flex items-center justify-between h-14">
                    <div className="flex items-center gap-3">
                        <Link to="/dashboard" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2d3e] transition-colors">
                            <ArrowLeft size={18} />
                        </Link>
                        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <GraduationCap size={15} className="text-white" />
                        </div>
                        <div>
                            <span className="font-poppins font-bold text-white text-sm">{classroom?.name}</span>
                            <span className="ml-2 text-xs text-gray-500">{classroom?.subject}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Users size={12} /> {classroom?.students?.length || 0}</span>
                        {isTeacher && <span className="badge bg-indigo-500/20 text-indigo-300">Teacher View</span>}
                    </div>
                </div>
            </header>

            {/* 3-Panel Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 max-w-screen-2xl w-full mx-auto overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>

                {/* Left — Question Feed */}
                <div className="border-r border-[#2a2d3e] flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#2a2d3e] flex items-center justify-between">
                        <h2 className="font-poppins font-semibold text-sm text-gray-300">Questions ({questions.length})</h2>
                        <span className="text-xs text-gray-500">Sorted by votes</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {questions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10">
                                <p className="text-gray-500 text-sm">No questions yet.</p>
                                <p className="text-gray-600 text-xs mt-1">Be the first to ask!</p>
                            </div>
                        ) : questions.map((q) => (
                            <div
                                key={q._id}
                                onClick={() => setActiveQuestion(q)}
                                className={`bg-[#1e2130] border rounded-xl p-3 cursor-pointer transition-all duration-200 hover:border-indigo-500/50 ${activeQuestion?._id === q._id ? 'border-indigo-500/60 bg-indigo-500/5' : 'border-[#2a2d3e]'}`}
                            >
                                <div className="flex items-start gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleUpvote(q._id); }}
                                        className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-0.5 group"
                                        disabled={isTeacher}
                                    >
                                        <ThumbsUp size={14} className={`transition-colors ${isTeacher ? 'text-gray-600' : 'text-gray-500 group-hover:text-emerald-400'}`} />
                                        <span className="text-xs font-bold text-emerald-400">{q.upvotes?.length || 0}</span>
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-200 leading-snug">{q.text}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-xs text-gray-500">{q.student?.name || 'Student'}</span>
                                            <span className={`badge border text-xs px-1.5 py-0 ${statusColor(q.status)}`}>{q.status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center — Active Question */}
                <div className="border-r border-[#2a2d3e] flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#2a2d3e]">
                        <h2 className="font-poppins font-semibold text-sm text-gray-300">Active Question</h2>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                        {activeQuestion ? (
                            <div className="w-full max-w-sm animate-fade-in">
                                <div className={`card border mb-4 ${activeQuestion.status === 'answered' ? 'border-emerald-500/40' : activeQuestion.status === 'pinned' ? 'border-yellow-500/40' : 'border-indigo-500/40'}`}>
                                    <p className="text-lg text-white font-medium leading-relaxed mb-3">"{activeQuestion.text}"</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">{activeQuestion.student?.name || 'Student'}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                                                <ThumbsUp size={13} /> {activeQuestion.upvotes?.length || 0}
                                            </span>
                                            <span className={`badge border text-xs ${statusColor(activeQuestion.status)}`}>
                                                {activeQuestion.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {isTeacher && (
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleTeacherAction(activeQuestion._id, 'answered')}
                                            className="btn-accent py-2 flex items-center justify-center gap-2 w-full"
                                            disabled={activeQuestion.status === 'answered'}
                                        >
                                            <CheckCircle size={16} /> Mark Answered
                                        </button>
                                        <button
                                            onClick={() => handleTeacherAction(activeQuestion._id, 'pinned')}
                                            className="btn-secondary py-2 flex items-center justify-center gap-2 w-full"
                                            disabled={activeQuestion.status === 'pinned'}
                                        >
                                            <Pin size={16} /> Pin Question
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Pin size={24} className="text-indigo-400" />
                                </div>
                                <p className="text-gray-400 text-sm">Click a question from the feed to view it here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right — Ask Question */}
                <div className="flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#2a2d3e]">
                        <h2 className="font-poppins font-semibold text-sm text-gray-300">
                            {isTeacher ? 'Session Info' : 'Ask a Question'}
                        </h2>
                    </div>
                    <div className="flex-1 p-4 flex flex-col">
                        {isTeacher ? (
                            <div className="space-y-4">
                                <div className="card">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Room Code</p>
                                    <p className="font-mono font-bold text-2xl text-indigo-400 tracking-widest">{classroom?.code}</p>
                                    <p className="text-xs text-gray-500 mt-1">Share this code with students</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="card text-center py-4">
                                        <p className="text-2xl font-bold text-white">{questions.length}</p>
                                        <p className="text-xs text-gray-500 mt-1">Total Questions</p>
                                    </div>
                                    <div className="card text-center py-4">
                                        <p className="text-2xl font-bold text-emerald-400">{questions.filter(q => q.status === 'answered').length}</p>
                                        <p className="text-xs text-gray-500 mt-1">Answered</p>
                                    </div>
                                </div>
                                <div className="card">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Pending Questions</p>
                                    <p className="text-xl font-bold text-yellow-400">{questions.filter(q => q.status === 'pending').length}</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitQuestion} className="flex flex-col h-full">
                                <textarea
                                    id="question-input"
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    placeholder="What would you like to ask? Be clear and specific..."
                                    className="input-field flex-1 resize-none text-sm"
                                    maxLength={300}
                                />
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs text-gray-500">{questionText.length}/300</span>
                                    <button
                                        id="submit-question-btn"
                                        type="submit"
                                        disabled={submitting || !questionText.trim()}
                                        className="btn-primary py-2 px-5 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={15} /> Submit
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveClassroom;
