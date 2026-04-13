"use client";
import { motion } from "framer-motion";
import { Check, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";


const Activate = () => {
  return (
    <div className="flex items-center justify-center min-h-100 w-full p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-md w-full bg-slate-900/40 backdrop-blur-3xl border border-emerald-500/20 rounded-[3rem] p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {/* Decorative Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/20 blur-[60px] -z-10" />

        {/* Animated Checkmark Circle */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="absolute inset-0 bg-emerald-500 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center text-slate-950"
          >
            <Check size={48} strokeWidth={4} />
          </motion.div>
          
          {/* Rotating Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 border-2 border-dashed border-emerald-500/30 rounded-full"
          />
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
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

        {/* Action Button */}
        <a href="/">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="group relative w-full bg-emerald-500 hover:bg-emerald-400 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/20"
        >
          <span className="text-slate-950 font-black text-xs uppercase tracking-widest">Login Now</span>
          
          <ArrowRight size={18} className="text-slate-950 group-hover:translate-x-1 transition-transform" />
          
          {/* Subtle Sparkle Icons */}
          <Sparkles size={14} className="absolute top-2 right-4 text-slate-950/30 group-hover:animate-pulse" />
        </motion.button>
        </a>

      
      </motion.div>
    </div>
  );
};


export default Activate;