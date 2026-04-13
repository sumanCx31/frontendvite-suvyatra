"use client";

import { useEffect, useState, useMemo } from "react";
import { TrendingUp, Banknote, History, ArrowUpRight, Bus, Users } from "lucide-react";
import authSvc from "../../services/Auth.service";
import { useAuth } from "../../context/auth.context";


const DriverDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    orderCount: 0
  });
  const {loggedInUser} = useAuth();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const driverId = loggedInUser?._id; 
        const response: any = await authSvc.getRequest(`/order/my-orders/${driverId}`);
        
        // Logic: authSvc usually returns response.data directly or the full Axios object
        const result = response; 

        if (result && result.status) {
          setStats({
            totalRevenue: result.totalRevenue || 0,
            todayRevenue: result.todayRevenue || 0,
            orderCount: result.orderCount || 0
          });
          setBookings(result.data || []);
        }
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data = useMemo(() => {
    return { 
        lifetime: stats.totalRevenue, 
        todayRevenue: stats.todayRevenue, 
        orderCount: stats.orderCount,
        recent: Array.isArray(bookings) ? bookings.slice(0, 6) : []
    };
  }, [bookings, stats]);

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-emerald-500">
      <div className="size-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
      <div className="font-black tracking-widest animate-pulse">SYNCING SUVIYATRA...</div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-10 bg-slate-950 min-h-screen text-slate-200">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            Driver <span className="text-emerald-500">Analytics</span>
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <span className="size-2 bg-emerald-500 rounded-full animate-ping"></span>
            Live Revenue Stream
          </p>
        </div>
        <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="text-right">
                <p className="text-[10px] text-slate-500 font-black uppercase">Fleet ID</p>
                <p className="text-white font-mono font-bold">SUV-DRV-69B3</p>
            </div>
            <div className="size-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <Bus size={20} />
            </div>
        </div>
      </div>

      {/* --- TOP KPI ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-emerald-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-emerald-900/40 relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <TrendingUp className="absolute -right-6 -bottom-6 size-40 opacity-10 group-hover:opacity-20 transition-opacity" />
            <p className="text-xs font-black uppercase opacity-70 tracking-widest">Lifetime Collection</p>
            <h2 className="text-5xl font-black mt-3 italic">Rs. {data.lifetime.toLocaleString()}</h2>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold bg-black/20 w-fit px-3 py-1.5 rounded-full">
                <ArrowUpRight size={14} /> System Verified
            </div>
        </div>

        {/* Today's Revenue Card */}
        <div className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <Banknote className="absolute -right-6 -bottom-6 size-40 opacity-5 group-hover:opacity-10" />
            <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Today's Revenue</p>
            <h2 className="text-5xl font-black mt-3 text-white italic">Rs. {data.todayRevenue.toLocaleString()}</h2>
            <p className="text-[10px] text-emerald-500 font-black mt-6 uppercase tracking-widest">Available for withdrawal</p>
        </div>

        {/* Order Count Card */}
        <div className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] group hover:border-blue-500/50 transition-colors">
            <Users className="text-blue-500 mb-4" size={28} />
            <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Total Manifests</p>
            <h2 className="text-5xl font-black mt-1 text-white italic">{data.orderCount}</h2>
            <p className="text-[10px] text-slate-500 font-black mt-6 uppercase tracking-widest">Successful Trips</p>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-12">
        <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                <History size={24} className="text-emerald-500" /> 
                Recent Passenger Activity
            </h3>
            <button className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors border border-white/5">
                View Full Logs
            </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {data.recent.length > 0 ? data.recent.map((order: any, i: number) => (
                <div key={order._id || i} className="group flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-6">
                        <div className="size-14 rounded-2xl bg-emerald-500/10 flex flex-col items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <span className="text-[10px] font-black leading-none">SEAT</span>
                            <span className="text-lg font-black">{order.seats?.[0] || "N/A"}</span>
                        </div>
                        <div>
                            <p className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">{order.user?.name || "Anonymous Passenger"}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                                {order.paymentMethod || "Digital"} • {order.paymentStatus || "Paid"}
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-left md:text-right">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Trip Route</p>
                            <p className="text-sm font-bold text-slate-300">{order.trip?.from || "Source"} → {order.trip?.to || "Dest"}</p>
                        </div>
                        <div className="bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-500/20">
                            <p className="text-xl font-black text-emerald-400">Rs. {order.totalAmount}</p>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white/[0.01] rounded-[2rem] border-2 border-dashed border-white/5">
                    <div className="size-20 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                        <History size={32} className="text-slate-700" />
                    </div>
                    <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-sm">No transaction history found</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;