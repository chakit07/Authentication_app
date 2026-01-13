import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifyOTP = () => {
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const email = location.state?.email;
  const phoneNumber = location.state?.phoneNumber;
  const verificationMethod = location.state?.verificationMethod || "email";

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const otpString = otp.join("");
      await verifyOtp({ otp: otpString, email, phoneNumber });
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Verification failed. The code may be invalid or expired."
      );
    } finally {
      setLoading(false);
    }
  };

  const getSuccessMessage = () => {
    switch (verificationMethod) {
      case "email":
        return "Verification code sent successfully to your email!";
      case "sms":
        return "OTP sent successfully to your phone!";
      case "phone":
        return "Verification call initiated successfully!";
      default:
        return "Verification code sent successfully!";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 p-4">
      {/* Background Flair */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg glass-card rounded-[3rem] p-10 md:p-16 shadow-2xl border-white/20 dark:border-slate-800/50 relative z-10"
      >
        <div className="text-center space-y-4 mb-10">
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30"
          >
            <ShieldCheck className="text-white w-10 h-10" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Verify Access
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium px-4">
              A secure 6-digit code has been dispatched to{" "}
              <span className="text-primary-600 dark:text-primary-400 font-bold">
                {email || phoneNumber || "your terminal"}
              </span>
              .
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="mb-8 p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl flex items-center gap-4 text-emerald-600 dark:text-emerald-400 text-sm font-bold"
            >
              <ShieldCheck size={20} className="shrink-0" />
              {successMessage}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="mb-8 p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-3xl flex items-center gap-4 text-rose-600 dark:text-rose-400 text-sm font-bold"
            >
              <AlertCircle size={20} className="shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4 text-center">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block">
              Verification Code
            </label>
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(index, e.target.value.replace(/\D/g, ""))
                  }
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-center text-3xl font-black bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-800"
                  placeholder="0"
                />
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || otp.some((digit) => digit === "")}
            className="w-full py-6 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-black rounded-[2rem] shadow-xl shadow-primary-500/30 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span className="relative z-10 tracking-widest uppercase text-sm">
                  Establish Connection
                </span>
                <ArrowRight
                  size={20}
                  className="relative z-10 group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </motion.button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-4">
          <button className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-primary-600 transition-colors">
            Didn't receive the handshake?{" "}
            <span className="text-primary-600 border-b border-primary-600/20">
              Resend Code
            </span>
          </button>
          <Link
            to="/login"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-xs">Abort & Return</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
