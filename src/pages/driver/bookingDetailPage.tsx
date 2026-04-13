"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Armchair,
  Printer,
  AlertCircle,
  Bus,
  Tag,
  Fingerprint,
  ShieldCheck,
  Hash,
} from "lucide-react";
import authSvc from "../../services/Auth.service";

const BookingDetailPage = () => {
  const { _id } = useParams<{ _id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response: any = await authSvc.getRequest(`/order/${_id}`);

        // Handling the nested response: data.order
        if (response && response.data && response.data.order) {
          setOrder(response.data.order);
        }
        console.log("busname:", order?.busName);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (_id) fetchOrderDetail();
  }, [_id]);

  if (loading) {
    return (
      <div className="h-96 w-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500 mb-4"></div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">
          Verifying Ticket...
        </p>
      </div>
    );
  }

  if (!order)
    return (
      <div className="text-center p-20">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-white font-black uppercase">Order Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-emerald-500 text-sm font-bold"
        >
          Return to List
        </button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group w-fit"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-xs font-black uppercase tracking-widest">
            Back to Dashboard
          </span>
        </button>

        <div className="flex gap-2">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">
              Verified Booking
            </span>
          </div>
          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-all">
            <Printer size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: PRIMARY INFO (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {/* TICKET STUB DESIGN */}
          <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 size-64 bg-emerald-500/5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-2">
                    Bus Service
                  </p>
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                    {order.busName}{" "}
                    <span className="text-emerald-500">[{order.busType}]</span>
                  </h2>
                  <p className="text-xs font-bold text-slate-400 mt-1 opacity-60">
                    Plate: {order.busNumber}
                  </p>
                </div>
                <div
                  className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${
                    order.paymentStatus === "paid"
                      ? "bg-emerald-500 text-emerald-950 border-emerald-400"
                      : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                  }`}
                >
                  {order.paymentStatus}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-10 py-10 border-y border-white/5 border-dashed">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">
                    Departure
                  </p>
                  <h4 className="text-4xl font-black text-white tracking-tighter">
                    {order.trip.from}
                  </h4>
                </div>

                <div className="flex-1 flex flex-col items-center group">
                  <div className="w-full h-px bg-white/10 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-4 py-1 border border-white/5 rounded-full text-emerald-500 group-hover:scale-110 transition-transform">
                      <Bus size={18} />
                    </div>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">
                    Arrival
                  </p>
                  <h4 className="text-4xl font-black text-white tracking-tighter">
                    {order.trip.to}
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-10">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">
                    Travel Date
                  </p>
                  <p className="text-sm font-bold text-slate-200">
                    {new Date(order.trip.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">
                    Booking ID
                  </p>
                  <p className="text-sm font-mono font-bold text-slate-200">
                    #{order._id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">
                    Method
                  </p>
                  <p className="text-sm font-bold text-emerald-500 uppercase">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CUSTOMER & TRANSACTION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                <User size={14} /> Passenger Info
              </p>
              <div className="space-y-1">
                <p className="text-lg font-black text-white tracking-tight">
                  {order.user.name}
                </p>
                <p className="text-xs text-slate-400">{order.user.email}</p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                <Fingerprint size={14} className="text-slate-600" />
                <span className="text-[10px] font-mono text-slate-500 truncate">
                  {order.user._id}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                <Hash size={14} /> Digital Ledger
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-bold text-slate-600 uppercase">
                    PIDX
                  </p>
                  <p className="text-[10px] font-mono text-slate-300 truncate">
                    {order.pidx || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-600 uppercase">
                    Transaction ID
                  </p>
                  <p className="text-[10px] font-mono text-emerald-500 truncate">
                    {order.transactionId || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* SEAT INVENTORY */}
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-2 mb-6">
              <Armchair size={20} className="text-emerald-500" />
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Selected Seats
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {order.seats.map((seat: string) => (
                <div
                  key={seat}
                  className="bg-emerald-500 flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg shadow-emerald-500/10"
                >
                  <span className="text-[10px] font-black uppercase text-emerald-950/50">
                    Seat
                  </span>
                  <span className="text-2xl font-black text-emerald-950">
                    {seat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FINAL FARE CARD */}
          <div className="bg-emerald-500 rounded-[2.5rem] p-8 text-emerald-950 shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              {/* <Ticket size={80} /> */}
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-center border-b border-emerald-950/10 pb-4">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                  <Tag size={14} /> Coupon
                </span>
                <span className="text-xs font-black bg-emerald-950/10 px-2 py-1 rounded">
                  {order.promoCode || "NO PROMO"}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase opacity-60">
                  Total Fare
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black">Rs.</span>
                  <span className="text-5xl font-black tracking-tighter">
                    {order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <button className="w-full py-4 bg-emerald-950 text-emerald-500 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-colors">
                Download Receipt
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Last Updated: {new Date(order.updatedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
