"use client";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router"; // Change this based on your router (Next.js uses next/navigation)
import { motion } from "framer-motion";
import { ArrowRight, Smartphone, AlertCircle } from "lucide-react";
import authSvc from "../../services/Auth.service";
import { toast } from "sonner";

const Activate = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const nextAppUrl = import.meta.env.VITE_NEXTJS_FRONTEND_URL;

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const response: any = await authSvc.postRequest("/auth/activate", {
        email,
        otp,
      });

      if (response.status === "ACTIVATED_SUCCESSFULLY") {
        setStatus("success");
        if (nextAppUrl) {
          window.location.href = nextAppUrl;
        } else {
          window.location.href = "http://localhost:3000/";
        }
        toast.success("Your account has been activated sucessfully!! ", {
          description: "Please login to access our service. ",
        });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <motion.div className="max-w-md w-full bg-slate-900/50 p-10 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-2 italic uppercase">
          Verify <span className="text-emerald-500">OTP</span>
        </h1>

        <form onSubmit={handleActivation} className="space-y-4">
          <div>
            <label className="text-[10px] text-slate-500 uppercase font-black ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white focus:border-emerald-500 outline-none transition-all"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase font-black ml-1">
              6-Digit Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-center text-3xl font-bold tracking-widest text-emerald-500 focus:border-emerald-500 outline-none"
              placeholder="000000"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-emerald-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-950 flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all"
          >
            {status === "loading" ? "Verifying..." : "Activate Account"}
            <ArrowRight size={16} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Activate;
