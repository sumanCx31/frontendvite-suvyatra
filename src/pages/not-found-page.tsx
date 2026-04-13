import { motion } from "framer-motion";
import { Home, ArrowLeft, Ghost } from "lucide-react";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />

      <div className="max-w-2xl w-full text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated 404 Text */}
          <div className="relative inline-block">
            <motion.h1 
              className="text-[12rem] font-black text-white/5 leading-none select-none"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              404
            </motion.h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <Ghost size={80} className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              </motion.div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mt-8 mb-4">
            Lost in the <span className="text-emerald-500">Journey?</span>
          </h2>
          
          <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
            The page you are looking for has been moved, deleted, or perhaps never existed in our route schedule.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              <ArrowLeft size={18} />
              Go Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 text-slate-900 font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
            >
              <Home size={18} />
              Return Dashboard
            </motion.button>
          </div>
        </motion.div>

        {/* Floating Breadcrumbs (Visual Decor) */}
        <motion.div 
          className="mt-16 flex justify-center gap-8 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 0.5 }}
        >
          <div className="h-px w-24 bg-linear-to-r from-transparent via-white to-transparent" />
          <div className="h-px w-24 bg-linear-to-r from-transparent via-white to-transparent" />
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;