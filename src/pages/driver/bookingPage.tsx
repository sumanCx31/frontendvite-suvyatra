"use client";

import { useEffect, useState } from "react";
import { 
  Ticket, Calendar, User, 
  ChevronLeft, ChevronRight, Eye, 
  Search, Banknote 
} from "lucide-react";
import { useNavigate } from "react-router"; // 1. Import useNavigate
import authSvc from "../../services/Auth.service";
import { useAuth } from "../../context/auth.context";

const DriverBookingPage = () => {
  const { loggedInUser } = useAuth();
  const navigate = useNavigate(); // 2. Initialize navigate
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalRevenue: 0, todayRevenue: 0 });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  const fetchBookings = async (page: number = 1) => {
    // Only proceed if loggedInUser is available
    if (!loggedInUser?._id) return;

    try {
      setLoading(true);
      const response: any = await authSvc.getRequest(
        `/order/my-orders/${loggedInUser._id}?page=${page}&limit=10`
      );
      
      if (response && response.status) {
        setBookings(response.data);
        setStats({
          totalRevenue: response.totalRevenue,
          todayRevenue: response.todayRevenue
        });
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Ensure fetch runs when component mounts OR when user session loads
  useEffect(() => {
    fetchBookings(pagination.currentPage);
  }, [loggedInUser?._id]); 

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchBookings(newPage);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-white/5 p-6 rounded-4xl flex items-center gap-5">
          <div className="size-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <Banknote size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Revenue</p>
            <p className="text-2xl font-black text-white">Rs. {stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-6 rounded-4xl flex items-center gap-5">
          <div className="size-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20">
            <Ticket size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Bookings</p>
            <p className="text-2xl font-black text-white">{pagination.totalItems}</p>
          </div>
        </div>
      </div>

      {/* --- TABLE CONTROLS --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-3xl border border-white/5">
        <h2 className="text-xl font-black italic uppercase text-white tracking-tighter ml-4">
            Booking <span className="text-emerald-500">Logs</span>
        </h2>
        <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-600" size={16} />
            <input type="text" placeholder="Search customer..." className="bg-slate-950 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-emerald-500 w-64" />
        </div>
      </div>

      {/* --- BOOKINGS TABLE --- */}
      <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="p-6">Customer</th>
                <th className="p-6">Trip Date</th>
                <th className="p-6">Bus & Seats</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center animate-pulse text-slate-500 font-black uppercase tracking-[0.3em]">Syncing Bookings...</td>
                </tr>
              ) : bookings.map((order) => (
                <tr key={order._id} className="group hover:bg-white/2 transition-all">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-slate-950 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white tracking-tight">{order.user.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{order.user.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-300">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-emerald-500" />
                        {new Date(order.trip.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-slate-500 truncate max-w-30">
                            {order.trip.bus.name}
                        </span>
                        <div className="flex gap-1 flex-wrap">
                            {order.seats.map((s: string) => (
                                <span key={s} className="bg-emerald-500/10 text-emerald-500 text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-500/20">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                        order.paymentStatus === 'paid' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                    }`}>
                        {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    {/* 4. Action Button with Redirect */}
                    <button 
                      onClick={() => navigate(`/driver/bookings/${order._id}`)}
                      className="p-2.5 bg-white/5 hover:bg-emerald-500 hover:text-emerald-950 text-slate-400 rounded-xl transition-all group-hover:scale-110"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        <div className="p-6 bg-white/2 flex items-center justify-between border-t border-white/5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button 
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                className="p-2 rounded-lg bg-slate-950 border border-white/5 text-slate-400 disabled:opacity-20 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className="p-2 rounded-lg bg-slate-950 border border-white/5 text-slate-400 disabled:opacity-20 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverBookingPage;