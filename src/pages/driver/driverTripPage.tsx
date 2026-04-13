"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import authSvc from "../../services/Auth.service";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Loader2,
  ChevronLeft,
  Plus,
  Edit3,
  Bus,
  AlertTriangle,
  Trash2,
  LayoutGrid,
  Ticket,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const DriverTripPage = () => {
  const { busId } = useParams();
  const navigate = useNavigate();

  const [allTrips, setAllTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("");

  // Confirmation Modal State
  const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; id: string | null }>({
    show: false,
    id: null,
  });

  const fetchTripsByBus = useCallback(async () => {
    if (!busId) {
      setError("No Bus ID provided.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await authSvc.getRequest(`/trip-update/bus/${busId}`);
      const tripData = response.data?.data || response.data || [];
      setAllTrips(Array.isArray(tripData) ? tripData : []);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setAllTrips([]);
        setError(null);
      } else {
        setError("Connection failed. Please check your network.");
      }
    } finally {
      setLoading(false);
    }
  }, [busId]);

  useEffect(() => {
    fetchTripsByBus();
  }, [fetchTripsByBus]);

  // Execute actual deletion
  const executeDelete = async () => {
    if (!confirmDelete.id) return;

    const tripId = confirmDelete.id;
    setConfirmDelete({ show: false, id: null }); // Close modal

    const toastId = toast.loading("Removing trip from schedule...");

    try {
      await authSvc.deleteRequest(`/trip-update/${tripId}`);
      setAllTrips((prev) => prev.filter((t) => t._id !== tripId));
      toast.success("Trip deleted successfully", { id: toastId });
    } catch (err) {
      toast.error("Failed to delete trip. Please try again.", { id: toastId });
    }
  };

  const filteredTrips = useMemo(() => {
    if (!dateFilter) return allTrips;
    return allTrips.filter((trip) => {
      if (!trip.date) return false;
      const tripDate = new Date(trip.date).toISOString().split("T")[0];
      return tripDate === dateFilter;
    });
  }, [dateFilter, allTrips]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-emerald-500">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-black uppercase tracking-widest text-[10px] italic text-slate-500">
          Syncing Manifests...
        </p>
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24 relative">
      
      {/* --- CUSTOM CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {confirmDelete.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete({ show: false, id: null })}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                <AlertTriangle className="text-rose-500" size={40} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic mb-2">Confirm Delete</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Are you sure? This will permanently remove the trip and all associated ticket data.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete({ show: false, id: null })}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest transition-all border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-rose-500/30"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- HEADER SECTION --- */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("/admin/driver-bus")}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-500 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                Trip <span className="text-emerald-500">Schedules</span>
              </h1>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                Manage your fleet availability
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-grow md:flex-grow-0">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white text-xs font-bold focus:outline-none focus:border-emerald-500/50 transition-all"
              />
              {dateFilter && (
                <button onClick={() => setDateFilter("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 font-black text-[10px]">
                  CLEAR
                </button>
              )}
            </div>

            <button
              onClick={() => navigate(`/driver/add-trip/${busId}`)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Plus size={20} strokeWidth={3} />
              New Trip
            </button>
          </div>
        </div>
      </div>

      {/* --- TRIPS GRID --- */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripSummaryCard
              key={trip._id}
              trip={trip}
              onEdit={() => navigate(`/driver/trip/edit/${trip._id}`)}
              onDelete={() => setConfirmDelete({ show: true, id: trip._id })}
              onManifest={() => navigate(`/admin/manifest/${trip._id}`)}
              onViewSeats={() => navigate(`/driver/seat-reservation/${trip._id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <Bus className="mx-auto text-slate-800 mb-6 opacity-20" size={64} />
          <p className="text-slate-500 font-bold italic uppercase tracking-widest text-sm">
            No active trips found.
          </p>
        </div>
      )}

      {/* --- MOBILE FLOATING ACTION BUTTON --- */}
      <button
        onClick={() => navigate(`/driver/add-trip/${busId}`)}
        className="md:hidden fixed bottom-8 right-6 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 shadow-2xl z-50 active:scale-90 transition-transform"
      >
        <Plus size={32} strokeWidth={3} />
      </button>
    </div>
  );
};

// --- SUB-COMPONENT: TRIP CARD ---
const TripSummaryCard = ({ trip, onEdit, onDelete, onManifest, onViewSeats }: any) => {
  const bookedCount = trip.seats?.filter((s: any) => s.isBooked).length || 0;
  const totalSeats = trip.seats?.length || 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-6 hover:border-emerald-500/40 transition-all duration-300 relative group"
    >
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 bg-slate-950/40 p-3 rounded-2xl border border-white/5">
            <span className="text-lg font-black text-white italic">{trip.departureTime}</span>
            <ArrowRight className="text-emerald-500" size={14} />
            <span className="text-lg font-black text-white italic">{trip.arrivalTime}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-3 bg-white/5 hover:bg-emerald-500 text-slate-400 hover:text-slate-950 rounded-xl transition-all border border-white/10"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-3 bg-white/5 hover:bg-rose-500 text-slate-400 hover:text-white rounded-xl transition-all border border-white/10"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
          <MapPin className="text-emerald-500" size={20} />
          <p className="text-lg font-black text-white uppercase italic tracking-tighter truncate">
            {trip.from} <span className="text-slate-600 font-normal text-xs lowercase">to</span> {trip.to}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatBox label="Date" value={new Date(trip.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} />
          <StatBox label="Load" value={`${bookedCount}/${totalSeats}`} />
          <StatBox label="Fare" value={`Rs.${trip.price}`} highlight />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={onViewSeats} className="py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/10 transition-colors">
            <Ticket size={14} className="inline mr-2" />
            Booking
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const StatBox = ({ label, value, highlight }: any) => (
  <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 text-center">
    <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest block mb-1">{label}</span>
    <p className={`font-bold text-xs truncate ${highlight ? "text-emerald-400" : "text-white"}`}>{value}</p>
  </div>
);

export default DriverTripPage;