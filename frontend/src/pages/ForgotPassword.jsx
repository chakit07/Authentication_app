import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, AlertCircle, CheckCircle2, Loader2, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const { data } = await api.post('/password/forgot', { email });
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Protocol failure. Verification of provided identity failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Background Flair */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-lg glass-card rounded-[3rem] p-10 md:p-16 shadow-2xl border-white/20 dark:border-slate-800/50 relative z-10"
            >
                <div className="text-center space-y-4 mb-10">
                    <motion.div
                        initial={{ scale: 0.5, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30"
                    >
                        <KeyRound className="text-white w-10 h-10" />
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Recover Key</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium px-4 text-center">
                            Lost your encryption key? Provide your registered email to initiate recovery.
                        </p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {message ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 glass rounded-[2.5rem] text-center space-y-6 border border-emerald-100 dark:border-emerald-900/30"
                        >
                            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="text-white w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400">Transmission Successful</h3>
                                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{message}</p>
                            </div>
                            <Link to="/login" className="inline-flex items-center justify-center w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black tracking-widest uppercase text-xs shadow-lg shadow-emerald-500/20 transition-all gap-2">
                                <ArrowLeft size={16} /> Return to Login
                            </Link>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-3xl flex items-center gap-4 text-rose-600 dark:text-rose-400 text-sm font-bold"
                                >
                                    <AlertCircle size={20} className="shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block px-2">Registered Terminal Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-14 pr-6 py-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold tracking-wide"
                                        placeholder="commander@hq.com"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                className="w-full py-6 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-[2.5rem] shadow-2xl transition-all flex items-center justify-center gap-3 group"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span className="tracking-widest uppercase text-sm">Initiate Recovery</span>
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>

                            <div className="text-center pt-4">
                                <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-black text-[10px] uppercase tracking-widest transition-colors">
                                    <ArrowLeft size={16} /> Mission Aborted? Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
