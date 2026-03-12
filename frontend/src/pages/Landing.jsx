import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, Zap, ThumbsUp, Shield, Radio, ChevronRight, GraduationCap } from 'lucide-react';

const features = [
    { icon: <Zap size={22} className="text-indigo-400" />, title: 'Real-Time Questions', desc: 'Students submit questions instantly — no delays, no interruptions.' },
    { icon: <ThumbsUp size={22} className="text-emerald-400" />, title: 'Upvote System', desc: 'Students vote on what matters. Teachers answer the most important first.' },
    { icon: <Shield size={22} className="text-violet-400" />, title: 'Teacher Control', desc: 'Pin, highlight, and mark questions answered to guide the discussion.' },
    { icon: <Radio size={22} className="text-cyan-400" />, title: 'Live Interaction', desc: 'Classroom updates appear instantly for everyone. No refresh needed.' },
];

const steps = [
    { num: '01', title: 'Teacher Creates Classroom', desc: 'Set up a room in seconds and share a short invite code.' },
    { num: '02', title: 'Students Join via Code', desc: 'Enter the code on the student dashboard to join instantly.' },
    { num: '03', title: 'Questions Flow Live', desc: 'Students ask and upvote. The best questions rise to the top.' },
];

const Landing = () => {
    return (
        <div className="min-h-screen bg-[#0f1117] text-gray-100">
            <Navbar />

            {/* Hero */}
            <section className="relative overflow-hidden pt-24 pb-32 px-4">
                {/* glow blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-40 right-0 w-[400px] h-[300px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-4xl mx-auto text-center">
                    <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                        <Radio size={14} className="animate-pulse" /> Real-Time Q&A for Classrooms
                    </span>
                    <h1 className="font-poppins font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6">
                        Ask Smart.<br />
                        <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                            Answer What Matters.
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        QClass lets students ask questions silently during lectures. Votes surface the most pressing ones so teachers can focus where it counts.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
                            Get Started Free <ArrowRight size={18} />
                        </Link>
                        <Link to="/signup?role=teacher" className="btn-secondary text-base px-8 py-3">
                            Create a Classroom
                        </Link>
                    </div>

                    {/* fake dashboard preview */}
                    <div className="mt-20 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-transparent to-transparent z-10 pointer-events-none" />
                        <div className="card border-indigo-500/20 text-left overflow-hidden">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                                <span className="ml-2 text-xs text-gray-500 font-mono">QClass — Live Session</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-1 bg-[#0f1117] rounded-xl p-3 space-y-2">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Questions (4)</p>
                                    {['How does gradient descent work?', 'Can you explain backpropagation?', 'What is the learning rate?'].map((q, i) => (
                                        <div key={i} className="bg-[#1e2130] rounded-lg p-2.5 flex items-start gap-2">
                                            <span className="text-emerald-400 text-xs font-bold mt-0.5">{[12, 8, 3][i]}▲</span>
                                            <span className="text-xs text-gray-300 leading-snug">{q}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="col-span-1 bg-[#0f1117] rounded-xl p-3">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Active Question</p>
                                    <div className="bg-indigo-600/20 border border-indigo-500/40 rounded-lg p-3">
                                        <p className="text-sm text-white font-medium mb-2">How does gradient descent work?</p>
                                        <span className="badge bg-indigo-500/20 text-indigo-300">12 upvotes</span>
                                    </div>
                                </div>
                                <div className="col-span-1 bg-[#0f1117] rounded-xl p-3">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Ask a Question</p>
                                    <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-lg p-2 text-xs text-gray-500">What is dropout regularization?</div>
                                    <div className="mt-2 w-full bg-indigo-600 text-white text-xs text-center py-1.5 rounded-lg">Submit</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 px-4 bg-[#0c0f18]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-poppins font-bold text-4xl text-white mb-4">Everything you need for live Q&A</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">Built for lectures. Designed to keep classrooms focused and interactive.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="card hover:border-indigo-500/40 transition-all duration-200 hover:-translate-y-1 group">
                                <div className="w-11 h-11 bg-[#0f1117] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    {f.icon}
                                </div>
                                <h3 className="font-poppins font-semibold text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-poppins font-bold text-4xl text-white mb-4">Up and running in 3 steps</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {steps.map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-5xl font-poppins font-extrabold text-indigo-500/20 mb-3">{s.num}</div>
                                <h3 className="font-poppins font-semibold text-white mb-2">{s.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 bg-gradient-to-br from-indigo-900/40 to-violet-900/20 border-t border-b border-indigo-500/20">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="font-poppins font-bold text-4xl text-white mb-4">Ready to transform your classroom?</h2>
                    <p className="text-gray-400 mb-8">Join thousands of educators making lectures more engaging with QClass.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
                            Get Started Free <ArrowRight size={18} />
                        </Link>
                        <Link to="/signup?role=teacher" className="btn-accent text-base px-8 py-3">
                            Create Classroom
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 px-4 border-t border-[#2a2d3e]">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <GraduationCap size={15} className="text-white" />
                        </div>
                        <span className="font-poppins font-bold text-white">Q<span className="text-indigo-400">Class</span></span>
                    </div>
                    <p className="text-sm text-gray-500">© 2026 QClass. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
