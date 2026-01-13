import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, Loader2, ShieldAlert, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        if (formData.password.length < 8) {
            return setError('Password must be at least 8 characters');
        }
        setLoading(true);
        setError('');
        try {
            await api.put(`/password/reset/${token}`, formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Override error. Provided token is invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Background Flair */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-lg glass-card rounded-[3rem] p-10 md:p-16 shadow-2xl border-white/20 dark:border-slate-800/50 relative z-10"
            >
                <div className="text-center space-y-4 mb-10">
                    <motion.div
                        initial={{ scale: 0.5, y: -10 }}
                        animate={{ scale: 1, y: 0 }}
                        className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30"
                    >
                        <ShieldAlert className="text-white w-10 h-10" />
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">New Security Key</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium px-4">
                            Update your credentials to regain access to the TaskMaster operative terminal.
                        </p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 glass rounded-[2.5rem] text-center space-y-6 border-emerald-100 dark:border-emerald-900/30"
                        >
                            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="text-white w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400">Update Successful</h3>
                                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">Your password has been securely updated. Redirecting to login terminal...</p>
                            </div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block px-2">New Security Key</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        required
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold tracking-wide"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block px-2">Confirm Key</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        required
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold tracking-wide"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                className="w-full py-5 bg-primary-600 hover:bg-primary-700 disabled:opacity-70 text-white font-black rounded-[1.5rem] shadow-xl shadow-primary-500/30 transition-all flex items-center justify-center gap-3 mt-4 group"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span className="tracking-widest uppercase text-sm">Update Terminal Access</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
