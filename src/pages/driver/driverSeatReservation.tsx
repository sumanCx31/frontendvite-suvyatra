"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router"; 
import { 
  Armchair, 
  UserCheck, 
  Loader2, 
  ChevronLeft, 
  RefreshCcw,
  Lock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import authSvc from "../../services/Auth.service";

const DriverSeatReservation = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const [seats, setSeats] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchTripData = async () => {
    try {
      setFetching(true);
      const response = await authSvc.getRequest(`/trip-update/${tripId}`);
      
     
      console.log("API Data received:", response.data);

      
      const fetchedSeats = response?.data?.data?.seats || response?.data?.seats || [];
      
      setSeats(fetchedSeats);
     
      setSelectedSeatIds(prev => 
        prev.filter(id => fetchedSeats.find((s: any) => s._id === id && !s.isBooked))
      );
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (tripId) fetchTripData();
  }, [tripId]);

  const toggleSeat = (seatId: string, isBooked: boolean) => {
    if (isBooked) return; 
    setSelectedSeatIds((prev) =>
      prev.includes(seatId) ? prev.filter(i => i !== seatId) : [...prev, seatId]
    );
  };


  const handleUpdate = async () => {
    if (selectedSeatIds.length === 0) return;
    
    setUpdating(true);
    try {
      const formattedSeats = selectedSeatIds.map(id => {
        const seat = seats.find(s => s._id === id);
        return { 
          seatNumber: seat?.seatNumber, 
          isBooked: true 
        };
      });

      const payload = { seats: formattedSeats };
      const res = await authSvc.patchRequest(`/trip-update/seat-reserve/${tripId}`, payload);
      
      setSuccessMsg(res?.data?.message || "Seats Reserved Successfully!");
      
      setSelectedSeatIds([]); 
      await fetchTripData(); // Refresh list to lock the seats

      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error("Update Error:", err);
      alert(err?.response?.data?.message || "Failed to update seats.");
      fetchTripData();
    } finally {
      setUpdating(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500 mb-2" size={32} />
      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] italic">Building Seat Map...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 pb-40 font-sans">
      
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xs animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-2xl shadow-emerald-500/40">
            <CheckCircle2 size={20} />
            <p className="text-xs font-black uppercase tracking-wider">{successMsg}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-md mx-auto flex items-center justify-between mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-md">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-black italic uppercase tracking-tighter">SUV <span className="text-emerald-500">Yatra</span></h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">Trip ID: {tripId?.slice(-6)}</p>
        </div>
        <button onClick={fetchTripData} className="p-3 bg-slate-900/50 rounded-2xl border border-white/5">
          <RefreshCcw size={18} className={fetching ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Vehicle Map */}
      <div className="max-w-xs mx-auto">
        {seats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600 border-2 border-dashed border-slate-900 rounded-3xl">
            <AlertCircle size={40} className="mb-4 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest">No Seat Data Found</p>
            <button onClick={fetchTripData} className="mt-4 text-emerald-500 text-[10px] font-black uppercase underline">Retry Sync</button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 gap-y-4">
            {seats.map((seat) => {
              const isSelected = selectedSeatIds.includes(seat._id);
              const isLocked = seat.isBooked;

              return (
                <button
                  key={seat._id}
                  disabled={isLocked}
                  onClick={() => toggleSeat(seat._id, isLocked)}
                  className={`
                    h-16 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 relative group
                    ${isLocked 
                      ? 'bg-slate-950 border-slate-900/50 text-slate-800 cursor-not-allowed opacity-60' 
                      : isSelected
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-105 z-10 shadow-xl shadow-emerald-500/30'
                        : 'bg-slate-900/40 border-white/5 text-slate-500 hover:border-emerald-500/40 hover:bg-slate-800'}
                  `}
                >
                  {isLocked ? (
                     <Lock size={14} className="opacity-40 mb-1" />
                  ) : (
                     <Armchair size={18} className={`${isSelected ? "text-slate-950" : "group-hover:text-emerald-500"} transition-colors`} />
                  )}
                  
                  <span className={`text-[10px] font-black mt-1 uppercase ${isSelected ? 'text-slate-950' : ''}`}>
                    {seat.seatNumber}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-[#020617]/80 backdrop-blur-2xl border-t border-white/5 flex flex-col items-center gap-4">
        <div className="max-w-xs w-full flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-slate-800 border border-white/10" /> Avail.
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500" /> Selected
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-900" /> Booked
           </div>
        </div>

        <div className="max-w-xs w-full">
          <button
            onClick={handleUpdate}
            disabled={selectedSeatIds.length === 0 || updating}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-900 disabled:text-slate-700 py-4 rounded-2xl text-slate-950 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-emerald-500/20"
          >
            {updating ? <Loader2 className="animate-spin" size={18} /> : <UserCheck size={18} />}
            Reserve {selectedSeatIds.length || ""} Seats
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverSeatReservation;