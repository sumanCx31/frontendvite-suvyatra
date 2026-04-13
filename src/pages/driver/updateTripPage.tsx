"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Save, 
  MapPin, 
  Clock, 
  Calendar, 
  Banknote,
  Loader2,
  Bus
} from "lucide-react";
import { toast } from "sonner";
import authSvc from "../../services/Auth.service";
import { useNavigate, useParams } from "react-router";

export default function UpdateTripPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
  });

  // 1. Fetch existing trip data
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await authSvc.getRequest(`/trip-update/${tripId}`);
        const data = response.data?.data || response.data;
        
        // Format date to YYYY-MM-DD for the input field
        const formattedDate = data.date ? new Date(data.date).toISOString().split('T')[0] : "";
        
        setFormData({
          from: data.from || "",
          to: data.to || "",
          date: formattedDate,
          departureTime: data.departureTime || "",
          arrivalTime: data.arrivalTime || "",
          price: data.price || "",
        });
      } catch (err) {
        toast.error("Failed to load trip details");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [tripId, navigate]);

  // 2. Handle update submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await authSvc.putRequest(`/trip-update/${tripId}`, formData);
      toast.success("Trip updated successfully!");
      navigate(-1); // Go back to the trip list
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update trip");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs italic">Loading Trip Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 mb-8 transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Trips</span>
        </button>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl"
        >
          <div className="mb-10">
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
              Update <span className="text-emerald-500">Trip</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
              Modifying Schedule ID: {tripId?.toString().slice(-8)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Route Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Origin</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <input 
                    type="text"
                    required
                    value={formData.from}
                    onChange={(e) => setFormData({...formData, from: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-emerald-500/50 outline-none transition-all"
                    placeholder="From"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={18} />
                  <input 
                    type="text"
                    required
                    value={formData.to}
                    onChange={(e) => setFormData({...formData, to: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-emerald-500/50 outline-none transition-all"
                    placeholder="To"
                  />
                </div>
              </div>
            </div>

            {/* Date & Price Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Journey Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <input 
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-emerald-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ticket Price (NPR)</label>
                <div className="relative">
                  <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-emerald-500/50 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Timing Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Departure Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <input 
                    type="time"
                    required
                    value={formData.departureTime}
                    onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-emerald-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arrival Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="time"
                    required
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-emerald-500/50 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={updating}
              className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {updating ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={20} strokeWidth={3} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}