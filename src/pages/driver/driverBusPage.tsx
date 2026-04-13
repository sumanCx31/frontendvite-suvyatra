"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router"; 
import authSvc from "../../services/Auth.service";
import { Bus, Gauge, Loader2, AlertCircle, Phone, CreditCard, ArrowRight, Plus } from "lucide-react";
import { useAuth } from "../../context/auth.context";

const DriverBusPage = () => {
  const { loggedInUser } = useAuth();
  console.log("_id",loggedInUser?._id);
  
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchDriverBuses = useCallback(async () => {
    if (!loggedInUser?._id) return;

    try {
      setLoading(true);
      const response = await authSvc.getRequest(`/bus/driver/${loggedInUser._id}`);
      
      // Based on your console log, the array is in response.data
      setBuses(response.data || []);
    } catch (err) {
      setError("Unable to load your assigned fleet.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loggedInUser?._id]);

  useEffect(() => {
    fetchDriverBuses();
  }, [fetchDriverBuses]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-emerald-500">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="font-black uppercase tracking-widest text-xs italic">Syncing Fleet...</p>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            My <span className="text-emerald-500">Fleet</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Manage your assigned vehicles, {loggedInUser?.name}
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Active Units</p>
          <p className="text-2xl font-black text-white">{buses.length}</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-500 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}
<button
              onClick={() => navigate(`/driver/add-bus`)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Plus size={20} strokeWidth={3} />
              New Bus
            </button>
      {/* Grid Layout */}
      {buses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buses.map((bus) => (
            <BusCard key={bus._id} bus={bus} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900 rounded-[3rem] border border-dashed border-white/10">
          <Bus className="text-slate-800 mb-4" size={64} />
          <p className="text-slate-500 font-bold italic uppercase tracking-widest">No buses assigned to your ID.</p>
        </div>
      )}
    </div>
  );
};

/* --- Sub-Component: BusCard --- */

const BusCard = ({ bus }: { bus: any }) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/40 transition-all duration-500 shadow-2xl flex flex-col">
      
      {/* Bus Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-800">
        <img 
          src={bus.image?.secureUrl || "https://via.placeholder.com/400x300?text=No+Bus+Image"} 
          alt={bus.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        
        {/* Active/Status Badge */}
        <div className="absolute top-5 right-5">
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
            bus.isActive === "active" 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-amber-500/10 border-amber-500/20 text-amber-400"
          }`}>
            {bus.isActive}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6 flex-grow">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-emerald-400 transition-colors">
            {bus.name}
          </h3>
          <div className="flex items-center gap-2">
            <CreditCard size={12} className="text-slate-500" />
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-[0.2em]">
              {bus.busNumber}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-slate-500">
              <Gauge size={12} />
              <span className="text-[9px] uppercase font-black tracking-widest">Type</span>
            </div>
            <p className="text-sm font-black text-white uppercase italic">{bus.busType}</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-slate-500">
              <Phone size={12} />
              <span className="text-[9px] uppercase font-black tracking-widest">Contact</span>
            </div>
            <p className="text-sm font-black text-white tracking-tighter">{bus.phone}</p>
          </div>
        </div>

        {/* Manifest Navigation Button */}
        <button 
          onClick={() => navigate(`/driver/trip-update/${bus._id}`)} 
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-2xl uppercase text-[10px] tracking-[0.3em] transition-all transform active:scale-95 shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-2 group/btn"
        >
          Manage Manifest <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default DriverBusPage;