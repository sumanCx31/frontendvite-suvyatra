"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ticket, Eye, QrCode, Calendar, RotateCcw, 
  ChevronLeft, ChevronRight, Hash 
} from "lucide-react";
import authSvc from "../../services/Auth.service";

const BookingsPage = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; 

  // Filter States
  const [busFilter, setBusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await authSvc.getRequest(`/order?page=${currentPage}&limit=${limit}`);
        const result = response.data;

        // Handling the direct array response seen in your console logs
        if (Array.isArray(result)) {
          setBookings(result);
          // If metadata is missing, we default to a safe page count
          setTotalPages(15); 
        } 
        // Handling the wrapped object response
        else if (result && result.data) {
          setBookings(result.data);
          setTotalPages(result.pagination?.totalPages || 1);
        }
      } catch (err) {
        console.error("SuvYatra Fetch Error:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [currentPage]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const busName = b.trip?.bus?.name || b.busNumber || "Unassigned";
      const travelDate = b.trip?.date || b.createdAt || "";
      const matchesBus = busName.toLowerCase().includes(busFilter.toLowerCase());
      const matchesDate = dateFilter ? travelDate.includes(dateFilter) : true;
      return matchesBus && matchesDate;
    });
  }, [bookings, busFilter, dateFilter]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <header className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div className="border border-white/10 rounded-[2rem] px-8 py-4 bg-slate-900/50 backdrop-blur-md">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Suv<span className="text-emerald-500">Yatra</span> Manifests
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
            Passenger Logs & Schedule
          </p>
        </div>

        <div className="flex flex-wrap gap-3 bg-slate-900/50 p-3 rounded-[1.5rem] border border-white/5">
          <div className="relative">
            <input 
              type="text"
              placeholder="Filter Bus..."
              value={busFilter}
              onChange={(e) => setBusFilter(e.target.value)}
              className="pl-4 pr-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-[11px] font-bold text-white focus:border-emerald-500 outline-none w-40"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-[11px] font-bold text-white focus:border-emerald-500 outline-none scheme-dark"
            />
          </div>
          <button 
            onClick={() => {setBusFilter(""); setDateFilter("");}}
            className="p-2.5 hover:bg-emerald-500/10 rounded-xl text-slate-500 hover:text-emerald-500 transition-colors border border-white/5"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      <div className="bg-slate-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-500 uppercase text-[10px] tracking-[0.2em] font-black">
              <tr>
                <th className="px-8 py-5">Passenger / ID</th>
                <th className="px-8 py-5">Route Detail</th>
                <th className="px-8 py-5">Schedule</th>
                <th className="px-8 py-5 text-right">View Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-20 text-slate-500 italic animate-pulse font-bold">Syncing Manifests...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-20 text-slate-500 italic font-bold">No Records Found.</td></tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-emerald-500/[0.03] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="text-white font-bold group-hover:text-emerald-400 transition-colors">
                        {b.user?.name || b.passengerName || "Guest User"}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono uppercase mt-0.5">
                        <Hash size={8} /> {b._id.slice(-8)}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-slate-300 text-xs font-bold uppercase tracking-tight">
                        {b.trip ? `${b.trip.from} → ${b.trip.to}` : "Unspecified Route"}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-400 text-xs font-medium">
                      {b.trip?.date ? new Date(b.trip.date).toLocaleDateString() : new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {/* REDIRECT TO MODAL (As per your request) */}
                      <button 
                        onClick={() => setSelectedBooking(b)} 
                        className="p-2.5 bg-slate-900 rounded-xl text-slate-500 hover:text-emerald-500 border border-white/5 transition-all active:scale-90"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-3">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2.5 bg-slate-900 border border-white/5 rounded-xl text-slate-400 hover:text-emerald-500 disabled:opacity-20 disabled:grayscale transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2.5 bg-slate-900 border border-white/5 rounded-xl text-slate-400 hover:text-emerald-500 disabled:opacity-20 disabled:grayscale transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// MODAL COMPONENT (Detail Page)
const BookingModal = ({ booking, onClose }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      exit={{ scale: 0.95, opacity: 0 }} 
      className="bg-slate-900 border border-emerald-500/20 rounded-[3rem] w-full max-w-sm p-10 shadow-2xl"
    >
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic leading-none">Ticket</h2>
          <p className="text-emerald-500 text-[9px] font-black tracking-[0.3em] uppercase mt-2">SuvYatra Official</p>
        </div>
        <QrCode className="text-emerald-500" size={44} />
      </div>
      <div className="space-y-4">
        <Detail title="Passenger" val={booking.user?.name || booking.passengerName} />
        <Detail title="Route" val={booking.trip ? `${booking.trip.from} to ${booking.trip.to}` : "N/A"} />
        <Detail title="Bus Plate" val={booking.trip?.bus?.busNumber || "Pending"} />
        <Detail title="Seats" val={booking.seats?.join(", ") || "N/A"} />
        <Detail title="Amount" val={`Rs. ${booking.totalAmount}`} />
      </div>
      <button 
        onClick={onClose} 
        className="w-full mt-10 bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl uppercase tracking-tighter italic hover:bg-emerald-400 transition-all active:scale-95"
      >
        Close Detail
      </button>
    </motion.div>
  </div>
);

const Detail = ({ title, val }: any) => (
  <div className="flex justify-between border-b border-white/5 pb-2.5">
    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{title}</span>
    <span className="text-xs font-bold text-white tracking-tight">{val || "N/A"}</span>
  </div>
);

export default BookingsPage;