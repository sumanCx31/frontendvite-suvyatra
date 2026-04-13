"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Bus,
  Users,
  Ticket,
  Bell,
  Search,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import authSvc from "../../services/Auth.service";
import StatCard from "../../components/layout/card";
import { useAuth } from "../../context/auth.context";

// 1. Define the Response Interface to fix TypeScript errors
interface BookingStatsResponse {
  status: string;
  data: {
    totalTicketsSold: number;
    totalRevenue: number;
    todayRevenue: number;
  };
  message: string;
}

const Dashboard = () => {
  const { loggedInUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [busCount, setBusCount] = useState<number>(0);
  const [stats, setStats] = useState<any>(null);
  
  // 2. Initialize state
  const [bookingData, setBookingData] = useState({
    totalTicketsSold: 0,
    totalRevenue: 0,
    todayRevenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 3. Fetch data simultaneously
        const [statsRes, busRes, bookingRes] = await Promise.all([
          authSvc.getRequest("/auth/user"),
          authSvc.getRequest("/bus"),
          authSvc.getRequest("/order/tickets-sold") as Promise<any>, 
        ]);

        setStats(statsRes.data);
        setBusCount(busRes.data?.length || 0);
        
        if (bookingRes.status === "SUCCESS" && bookingRes.data) {
          setBookingData({
            totalTicketsSold: bookingRes.data.totalTicketsSold || 0,
            totalRevenue: bookingRes.data.totalRevenue || 0,
            todayRevenue: bookingRes.data.todayRevenue || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500 mb-4"></div>
        <p className="text-slate-500 text-sm font-medium animate-pulse uppercase tracking-widest">
          Syncing Analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
        <div className="border border-white/10 rounded-[2rem] px-8 py-6 w-full bg-white/[0.02] backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <LayoutDashboard size={120} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase italic">
            Admin <span className="text-emerald-500">Console</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 font-medium">
            Welcome back, <span className="text-emerald-400">{loggedInUser?.name}</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
          <div className="relative w-full sm:w-72 group">
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" 
              size={18} 
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm transition-all text-white"
            />
          </div>

          <button className="relative p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            <Bell size={22} className="text-slate-300" />
            <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
          </button>
        </div>
      </header>

      {/* Stats Cards Grid - 5 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        
        {/* Today's Revenue */}
        <StatCard
          title="Today's Revenue"
          value={`₹${bookingData.todayRevenue.toLocaleString()}`}
          change="Since Midnight"
          icon={<TrendingUp className="text-emerald-400" />}
        />

        {/* Total Revenue */}
        <StatCard
          title="Total Revenue"
          value={`₹${bookingData.totalRevenue.toLocaleString()}`}
          change="All-time"
          icon={<IndianRupee className="text-emerald-600" />}
        />
        
        {/* Total Tickets */}
        <StatCard
          title="Seats Sold"
          value={bookingData.totalTicketsSold}
          change="Booked"
          icon={<Ticket className="text-orange-500" />}
        />

        {/* Bus Count */}
        <StatCard
          title="Active Buses"
          value={busCount}
          change="On Fleet"
          icon={<Bus className="text-blue-500" />}
        />

        {/* User Count */}
        <StatCard
          title="Customers"
          value={stats?.TotalUsers || 0}
          change="Registered"
          icon={<Users className="text-purple-500" />}
        />
      </div>

    </div>
  );
};

export default Dashboard;