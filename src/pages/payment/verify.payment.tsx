"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router"; 
import { Loader2, CheckCircle2, XCircle, Ticket } from "lucide-react";
import authSvc from "../../services/Auth.service";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your transaction with Khalti...");
  
  const hasCalled = useRef(false);

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    const orderId = searchParams.get("purchase_order_id");

    if (pidx && orderId && !hasCalled.current) {
      hasCalled.current = true;
      verifyPayment(pidx, orderId);
    } else if (!pidx || !orderId) {
      setStatus("error");
      setMessage("Missing payment credentials. Please try booking again.");
    }
  }, [searchParams]);

  const verifyPayment = async (pidx: string, orderId: string) => {
    try {
      const res = await authSvc.postRequest("order/payment/verify", {
        pidx,
        purchase_order_id: orderId,
      });

      // --- DEBUGGING STEP ---
      console.log("Raw Response Object:", res);

      // --- ROBUST DATA EXTRACTION ---
      // We check if 'status' exists directly on 'res'. 
      // If not, we check 'res.data' (standard Axios).
      const result = res.status ? res : (res.data ? res.data : res);
      
      console.log("Extracted JSON Body:", result);

      // ✅ BULLETPROOF CONDITION
      // We check for YOUR backend success string OR the nested Khalti success string
      const isSuccessful = 
        result.status === "PAYMENT_SUCCESS" || 
        result.data?.status === "Completed";

      if (isSuccessful) {
        setStatus("success");
        setMessage(result.message || "Payment Verified! Your seats are reserved.");
        
        // Auto-redirect to tickets after 5 seconds
        setTimeout(() => navigate("/tickets"), 5000);
      } else {
        // This is where it was failing before because result.status was undefined
        throw new Error(result.message || "The payment status was not confirmed by the server.");
      }
    } catch (err: any) {
      console.error("Final Verification Error:", err);
      setStatus("error");
      
      // Attempt to get error message from Axios error object
      const errorMsg = err?.response?.data?.message || err.message || "Something went wrong during verification.";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans text-slate-200">
      <div className="max-w-md w-full bg-slate-900/50 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-3xl text-center shadow-2xl">
        
        {/* --- LOADING --- */}
        {status === "loading" && (
          <div className="space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <Loader2 className="animate-spin text-emerald-500 w-full h-full" size={48} strokeWidth={1} />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest italic">Verifying...</h2>
            <p className="text-slate-500 text-xs font-bold leading-relaxed">{message}</p>
          </div>
        )}

        {/* --- SUCCESS --- */}
        {status === "success" && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="text-emerald-500" size={48} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter text-emerald-400">Seat Secured</h2>
              <p className="text-slate-400 text-sm mt-4 px-4 leading-relaxed">{message}</p>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Link 
                to="/tickets" 
                className="flex items-center justify-center gap-3 w-full bg-emerald-500 py-4 rounded-2xl text-slate-950 font-black uppercase text-xs tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-xl"
              >
                View My Tickets <Ticket size={16} />
              </Link>
              <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                Redirecting to your tickets in 5s...
              </p>
            </div>
          </div>
        )}

        {/* --- ERROR --- */}
        {status === "error" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <XCircle className="text-red-500" size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Failed</h2>
              <p className="text-slate-400 text-sm mt-3 px-4">{message}</p>
            </div>
            <div className="pt-4 space-y-3">
              <button 
                onClick={() => navigate("/")} 
                className="w-full bg-slate-800 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all border border-white/5"
              >
                Back to Home
              </button>
              <Link to="/contact" className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-white">
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;