"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ShieldCheck, Sparkles, Loader2, XCircle, AlertCircle } from "lucide-react";
import authSvc from "../../services/Auth.service";

const Activate = () => {
  const { token } = useParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const hasCalledApi = useRef(false);

  useEffect(() => {
    if (hasCalledApi.current) return;
    
    const activateAccount = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid activation link.");
        return;
      }

      try {
        hasCalledApi.current = true;
        const response: any = await authSvc.getRequest(`/auth/activate/${token}`);

        if (response.status === "ACTIVATED SUCCESSFULLY") {
          setStatus("success");
        } else {
          setStatus("error");
          setMessage(response.message || "Activation failed or link expired.");
        }
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage("Unable to connect to the server.");
      }
    };

    activateAccount();
  }, [token]);

  const handleRedirect = () => {
    // Accessing the Vite environment variable
    const nextAppUrl = import.meta.env.VITE_NEXTJS_FRONTEND_URL;
    
    if (nextAppUrl) {
      window.location.href = nextAppUrl;
    } else {
      // Fallback if ENV is missing
      window.location.href = "https://nextjs-suvyatra-fe42.vercel.app";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-6 bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-md w-full bg-slate-900/40 backdrop-blur-3xl border border-emerald-500/20 rounded-[3rem] p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[60px] -z-10 transition-colors duration-700 ${
          status === 'error' ? 'bg-red-500/20' : 'bg-emerald-500/20'
        }`} />

        <div className="relative mx-auto w-24 h-24 mb-8">
          <AnimatePresence mode="wait">
            {status === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={40} className="text-emerald-500 animate-spin" />
              </motion.div>
            )}

            {status === "success" && (
              <motion.div
                key="success"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute inset-0 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              >
                <Check size={48} strokeWidth={4} />
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500"
              >
                <XCircle size={48} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className={`absolute -inset-2 border-2 border-dashed rounded-full transition-colors duration-500 ${
              status === 'error' ? 'border-red-500/20' : 'border-emerald-500/30'
            }`}
          />
        </div>

        <div className="min-h-[160px]">
          {status === "loading" && (
            <p className="text-slate-400 font-medium animate-pulse">Verifying your credentials...</p>
          )}

          {status === "success" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-center gap-2 text-emerald-500 mb-3">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Verified</span>
              </div>
              <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">
                Account <span className="text-emerald-500">Activated</span>
              </h1>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                Welcome to the future of travel. You can now book premium fleets across Nepal.
              </p>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-center gap-2 text-red-500 mb-3">
                <AlertCircle size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Verification Failed</span>
              </div>
              <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">
                Invalid <span className="text-red-500">Link</span>
              </h1>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                {message || "The activation token is invalid or has expired."}
              </p>
            </motion.div>
          )}
        </div>

        <motion.button
          onClick={handleRedirect}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`group relative w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl font-black text-xs uppercase tracking-widest ${
            status === "error" 
              ? "bg-slate-800 text-white hover:bg-slate-700" 
              : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20"
          }`}
        >
          <span>{status === "error" ? "Return to Home" : "Login Now"}</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          {status !== "error" && <Sparkles size={14} className="absolute top-2 right-4 text-slate-950/30 group-hover:animate-pulse" />}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Activate;