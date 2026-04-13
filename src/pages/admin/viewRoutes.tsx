"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import authSvc from "../../services/Auth.service";
import { Loader2 } from "lucide-react";
import { format } from "date-fns"; // Recommended for consistent date formatting

const ViewRoutes: React.FC = () => {
  const { busId } = useParams();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await authSvc.getRequest(`/trip-update/bus/${busId}`);
        setTrips(response.data || []);
      } catch (err) {
        console.error("Error fetching bus schedule:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [busId]);

  if (loading) return <div className="text-emerald-500 p-20 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          Fleet Schedule <span className="text-slate-600">/ {busId?.slice(-4)}</span>
        </h1>
        <p className="text-slate-500 text-sm">Managing all route manifests for this vehicle.</p>
      </div>

      {trips.length > 0 ? (
        <TripTable trips={trips} />
      ) : (
        <div className="text-slate-500 text-center py-10 bg-slate-900 rounded-3xl border border-white/5">
          No scheduled trips found.
        </div>
      )}
    </div>
  );
};

/* --- Table Component --- */

const TripTable = ({ trips }: { trips: any[] }) => {
  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-slate-500 uppercase text-[10px] font-black tracking-widest">
            <th className="px-6 py-4">Source</th>
            <th className="px-6 py-4">Destination</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {trips.map((trip) => (
            <tr key={trip._id} className="hover:bg-emerald-500/5 transition-colors">
              <td className="px-6 py-4 text-white font-bold">{trip.from}</td>
              <td className="px-6 py-4 text-white font-bold">{trip.to}</td>
              <td className="px-6 py-4 text-slate-400 font-mono">
                {format(new Date(trip.date), "MMM dd, yyyy")}
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-emerald-500 font-bold text-xs uppercase">Scheduled</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRoutes;