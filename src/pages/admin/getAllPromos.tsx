"use client";

import { useEffect, useState } from "react";
import { 
  Ticket, Plus, Trash2, Clock, 
  Search, Filter, ChevronRight,
  ShieldCheck, AlertTriangle, Calendar
} from "lucide-react";
import authSvc from "../../services/Auth.service";
import { Navigate, useNavigate } from "react-router";

const PromoListPage = () => {
  const [loading, setLoading] = useState(true);
  const [promos, setPromos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const response: any = await authSvc.getRequest("/offers");
      // Mapping based on your provided response structure: { data: [...], status: "success" }
      if (response && response.data) {
        setPromos(response.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const filteredPromos = promos.filter(p => 
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 bg-slate-950 min-h-screen text-slate-200">
      <div className="max-w-350 mx-auto space-y-8">
        
        {/* --- TOP NAVIGATION BAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900/50 p-6 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <Ticket size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                Promo <span className="text-emerald-500">Vault</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                Active Inventory Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-4 top-3.5 text-slate-600" size={16} />
              <input 
                type="text" 
                placeholder="Search codes..." 
                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-bold outline-none focus:border-emerald-500 transition-all"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* ADD PROMO BUTTON */}
            <button 
              onClick={() =>  navigate('/admin/promos/add-promo')} // Adjust path to your route
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
            >
              <Plus size={18} /> Add Promo
            </button>
          </div>
        </div>

        {/* --- STATS OVERVIEW --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/40 p-5 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Promos</p>
                <p className="text-2xl font-black text-white mt-1">{promos.length}</p>
            </div>
            <div className="bg-slate-900/40 p-5 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">High Discount (20%+)</p>
                <p className="text-2xl font-black text-emerald-500 mt-1">{promos.filter(p => p.discountPercentage >= 20).length}</p>
            </div>
        </div>

        {/* --- PROMO INVENTORY TABLE --- */}
        <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="p-6">Promo Code & Identity</th>
                  <th className="p-6">Value</th>
                  <th className="p-6">Usage Rules</th>
                  <th className="p-6">Expiration</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-32 text-center">
                        <div className="inline-block size-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-xs font-black uppercase text-slate-500 tracking-widest animate-pulse">Fetching Promos...</p>
                    </td>
                  </tr>
                ) : filteredPromos.map((promo) => (
                  <tr key={promo._id} className="group hover:bg-white/[0.02] transition-all">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-slate-950 flex items-center justify-center text-emerald-500 border border-white/5 group-hover:border-emerald-500/50 transition-all">
                          <Ticket size={20} />
                        </div>
                        <div>
                          <p className="text-lg font-black text-white italic tracking-tight group-hover:text-emerald-400 transition-colors">
                            {promo.code}
                          </p>
                          <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">
                            {promo.title || "Suvyatra Exclusive"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-emerald-500 font-black text-xl italic">{promo.discountPercentage}%</span>
                        <span className="text-[10px] text-slate-500 font-black uppercase">Off Each Seat</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                           <ShieldCheck size={14} className="text-emerald-600" />
                           Min: Rs. {promo.minAmount}
                        </div>
                        {promo.maxDiscount > 0 && (
                          <p className="text-[10px] text-slate-500 font-black ml-5">MAX CAP: Rs. {promo.maxDiscount}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black border ${
                        new Date(promo.expiryDate) < new Date() 
                        ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                        : 'bg-white/5 text-slate-400 border-white/10'
                      }`}>
                        <Calendar size={12} />
                        {new Date(promo.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button 
                          className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition-colors border border-white/5"
                          title="View Details"
                        >
                          <ChevronRight size={18} />
                        </button>
                        <button 
                          className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                          title="Delete Promo"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* EMPTY STATE */}
            {!loading && filteredPromos.length === 0 && (
                <div className="p-32 text-center">
                    <div className="size-20 bg-slate-950 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/5">
                        <AlertTriangle className="text-slate-800" size={32} />
                    </div>
                    <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">No Active Records Found</p>
                    <button 
                        onClick={() => window.location.href = '/admin/offers/add'}
                        className="mt-6 text-emerald-500 font-black text-[10px] uppercase tracking-widest border-b border-emerald-500/50 pb-1 hover:text-emerald-400 transition-colors"
                    >
                        Create your first promo code
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoListPage;