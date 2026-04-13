"use client";

import { useEffect, useState } from "react";
import { Ticket, MapPin, Calendar, Clock, Bus, QrCode, ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import authSvc from "../../services/Auth.service";

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // Replace with your actual endpoint to get paid orders
      const res = await authSvc.getRequest("order/my-tickets");
      const data = res.data ? res.data : res;
      setTickets(data.data || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Loading your tickets...</div>;

  return (
    <div className="min-h-screen bg-[#020617] p-6 text-slate-200">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-slate-900 rounded-full border border-white/10">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">My Tickets</h1>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-white/10">
            <Ticket className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-bold">No active tickets found.</p>
          </div>
        ) : (
          tickets.map((ticket: any) => (
            <div key={ticket._id} className="relative bg-white text-slate-950 rounded-[2rem] overflow-hidden shadow-2xl">
              
              {/* Top Section: Bus Info */}
              <div className="p-6 bg-emerald-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Bus Service</p>
                    <h2 className="text-xl font-black uppercase italic leading-none">{ticket.busName || "SuvYatra Express"}</h2>
                  </div>
                  <Bus size={24} strokeWidth={2.5} />
                </div>
              </div>

              {/* Middle Section: Route */}
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center relative">
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">From</p>
                    <p className="text-lg font-black">{ticket.from || "Kathmandu"}</p>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-4 relative">
                     <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-500 rounded-full" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">To</p>
                    <p className="text-lg font-black">{ticket.to || "Pokhara"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-600" />
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Date</p>
                      <p className="text-sm font-bold">{new Date(ticket.departureDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-emerald-600" />
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Time</p>
                      <p className="text-sm font-bold">{ticket.departureTime || "07:00 AM"}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Seats</p>
                    <p className="text-lg font-black text-emerald-600">{ticket.seats?.join(", ") || "A1, A2"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Total Paid</p>
                    <p className="text-lg font-black">Rs. {ticket.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Section: QR Code Area */}
              <div className="bg-slate-50 p-6 flex flex-col items-center border-t-2 border-dashed border-slate-200 relative">
                {/* Side Cuts for Ticket Look */}
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#020617] rounded-full" />
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#020617] rounded-full" />
                
                <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl mb-3">
                  <QrCode size={80} className="text-slate-800" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Scan for Check-in</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketsPage;