"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Bus,
  Ticket,
  Settings,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Outlet, useLocation, useNavigate, Link } from "react-router";
import { useAuth } from "../../../context/auth.context";
import { toast } from "sonner";

const DriverPage = () => {
  const [open, setOpen] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthorizing(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthorizing) return;

    if (!loggedInUser) {
      toast.error("Please login to continue.");
      navigate("/login");
    } else if (loggedInUser.role !== 'driver') {
      toast.error("Access Denied: Drivers only.");
      navigate("/");
    }
  }, [loggedInUser, navigate, isAuthorizing]);

  if (isAuthorizing || !loggedInUser) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500 mb-4"></div>
        <p className="text-slate-400 animate-pulse">Verifying Driver Session...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-200 font-sans">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-slate-900 border-b border-white/10">
        <h1 className="text-lg font-bold text-white">
          Suv<span className="text-emerald-500">Yatra</span>
        </h1>
        <button onClick={() => setOpen(true)} className="p-2 hover:bg-white/5 rounded-lg">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:flex bg-slate-900 border-r border-white/10 flex flex-col p-6 space-y-8 overflow-y-auto shadow-xl`}>
        
        <div className="flex justify-between items-center shrink-0">
          <div className="text-2xl font-bold text-white">
            Suv<span className="text-emerald-500">Yatra</span>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <Link to="/driver" onClick={() => setOpen(false)} className="block">
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
              active={location.pathname === "/driver"} 
            />
          </Link>
          <Link to="/driver/my-bus" onClick={() => setOpen(false)} className="block">
            <NavItem 
              icon={<Bus size={20} />} 
              label="My Bus" 
              active={location.pathname.includes("/driver/my-bus")} 
            />
          </Link>
          <Link to="/driver/booking" onClick={() => setOpen(false)} className="block">
            <NavItem 
              icon={<Ticket size={20} />} 
              label="Bookings" 
              active={location.pathname.includes("/driver/booking")} 
            />
          </Link>
          {/* <Link to="/driver/chat" onClick={() => setOpen(false)} className="block">
            <NavItem 
              icon={<MessageCircle size={20} />} 
              label="Chat" 
              active={location.pathname.includes("/driver/chat")} 
            />
          </Link> */}

          {/* Settings Dropdown Group */}
          <div className="space-y-1">
            <button 
              onClick={() => setSettingsOpen(!settingsOpen)} 
              className="w-full text-left outline-none"
            >
              <NavItem 
                icon={<Settings size={20} />} 
                label="Settings" 
                active={location.pathname.includes("/driver/settings")} 
                isDropdown
                isOpen={settingsOpen}
              />
            </button>

            {settingsOpen && (
              <div className="pl-10 space-y-1 animate-in slide-in-from-top-2 duration-200">
                <Link to="/driver/settings/profile" onClick={() => setOpen(false)} className="block">
                  <SubNavItem label="Profile" active={location.pathname === "/driver/settings/profile"} />
                </Link>
                <Link to="/driver/settings/password" onClick={() => setOpen(false)} className="block">
                  <SubNavItem label="Password" active={location.pathname === "/driver/settings/password"} />
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="pt-4 border-t border-white/10 text-xs text-slate-500 shrink-0">
          Logged in as: <span className="text-emerald-400">{loggedInUser.name}</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

/* Components */

const NavItem = ({ icon, label, active = false, isDropdown = false, isOpen = false }: any) => (
  <div className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all 
    ${active ? "bg-emerald-500/10 text-emerald-400 font-bold" : "text-slate-400 hover:bg-white/5"}`}>
    <div className="flex items-center gap-3">
        {icon} 
        <span className="text-sm font-medium">{label}</span>
    </div>
    {isDropdown && (
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    )}
  </div>
);

const SubNavItem = ({ label, active = false }: any) => (
  <div className={`py-2 px-4 text-xs font-medium rounded-lg transition-all
    ${active ? "text-emerald-400 bg-emerald-500/5 font-bold" : "text-slate-500 hover:text-slate-300"}`}>
    {label}
  </div>
);

export default DriverPage;