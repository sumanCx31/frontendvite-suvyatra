"use client";

import { useState } from "react";
import { Ticket, Percent, Plus, Megaphone, Info, Calendar, DollarSign } from "lucide-react";
import authSvc from "../../services/Auth.service";

const AdminOfferPages = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    code: "",
    minAmount: 0,
    discountPercentage: 0,
    isActive: true,
    maxDiscount: 0,
    expiryDate: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mapping the state to your specific API structure
      const response = await authSvc.postRequest("/offers", form);
      if (response) {
        alert("Offer created successfully!");
        // Reset form or redirect
      }
    } catch (err) {
      console.error("Failed to create offer:", err);
      alert("Error creating offer. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-slate-950 min-h-screen text-slate-200">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="size-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-emerald-950 shadow-lg shadow-emerald-500/20">
            <Megaphone size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              Marketing <span className="text-emerald-500">Suite</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
              Create and Deploy Promotional Offers
            </p>
          </div>
        </div>

        {/* CREATE OFFER FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          
          {/* TITLE & DESCRIPTION */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-black uppercase text-emerald-500 tracking-widest mb-2 flex items-center gap-2">
              <Info size={16} /> Basic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Offer Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Super Offer" 
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 mt-1 text-white focus:border-emerald-500 outline-none font-bold"
                  onChange={(e) => setForm({...form, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Promo Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="SUVYATRA73214" 
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 mt-1 text-emerald-400 focus:border-emerald-500 outline-none uppercase font-mono font-bold"
                  onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Short Description</label>
              <textarea 
                rows={2}
                placeholder="Book 4 seats and get 20% discount..." 
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 mt-1 text-white focus:border-emerald-500 outline-none text-sm"
                onChange={(e) => setForm({...form, description: e.target.value})}
              />
            </div>
          </div>

          {/* FINANCIAL RULES */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-emerald-500 tracking-widest mb-2 flex items-center gap-2">
              <DollarSign size={16} /> Discount Rules
            </h3>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Discount Percentage (%)</label>
              <input 
                type="number" 
                placeholder="10" 
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 mt-1 text-white outline-none focus:border-emerald-500 font-bold"
                onChange={(e) => setForm({...form, discountPercentage: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Min. Purchase Amount</label>
              <input 
                type="number" 
                placeholder="0" 
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 mt-1 text-white outline-none focus:border-emerald-500 font-bold"
                onChange={(e) => setForm({...form, minAmount: Number(e.target.value)})}
              />
            </div>
          </div>

          {/* LIMITS & EXPIRY */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-emerald-500 tracking-widest mb-2 flex items-center gap-2">
              <Calendar size={16} /> Limits & Expiry
            </h3>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Max Discount (0 = No limit)</label>
              <input 
                type="number" 
                placeholder="0" 
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 mt-1 text-white outline-none focus:border-emerald-500 font-bold"
                onChange={(e) => setForm({...form, maxDiscount: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Expiry Date</label>
              <input 
                type="date" 
                required
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 mt-1 text-white outline-none focus:border-emerald-500"
                onChange={(e) => setForm({...form, expiryDate: e.target.value})}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="md:col-span-2 pt-4">
            <button 
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl
                ${loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-emerald-500/10'}
              `}
            >
              {loading ? "Transmitting to Server..." : "Deploy Offer to Production"}
            </button>
          </div>

        </form>

        {/* QUICK PREVIEW CARD */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Ticket className="text-emerald-500" size={32} />
                <div>
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Live Preview</p>
                    <p className="text-white font-bold">{form.title || "Untitled Offer"} — {form.code || "CODE"}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-2xl font-black text-emerald-500">{form.discountPercentage}% OFF</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOfferPages;