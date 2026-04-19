"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Bus,
  Users,
  Ticket,
  Settings,
  Menu,
  X,
  Gift,
  Image as ImageIcon,
  ChevronDown,
  LogOut, // Added Logout Icon
} from "lucide-react";
import { Outlet, useLocation, useNavigate, Link } from "react-router"; 
import { useAuth } from "../../../context/auth.context";
import { toast } from "sonner";

const AdminPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false); 
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ Destructure logout from Auth Context
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
      toast.error("Please login first!");
      navigate("/login");
    } else if (loggedInUser.role !== 'admin') {
      toast.error("Access Denied!", {
        description: "Only Admin can access this route!!"
      });
      navigate("/");
    }
  }, [loggedInUser, navigate, isAuthorizing]);

  // ✅ Logout Handler
  const handleLogout = () => {
   localStorage.clear();
    toast.success("Logged out successfully!", {
        description: "See you again soon!"
    });
    navigate("/");
  };

  if (isAuthorizing || !loggedInUser || loggedInUser.role !== 'admin') {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500 mb-4"></div>
        <p className="text-slate-400 font-medium">Verifying Admin Session...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-72 
        bg-slate-900 border-r border-white/5 
        transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 flex flex-col p-6 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-10">
          <div className="text-2xl font-black text-white tracking-tighter italic">
            Suv<span className="text-emerald-500">Yatra</span>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5">
          <Link to="/admin" onClick={() => setIsOpen(false)}>
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              active={location.pathname === "/admin"}
            />
          </Link>

          <Link to="/admin/manage-buses" onClick={() => setIsOpen(false)}>
            <NavItem
              icon={<Bus size={20} />}
              label="Manage Buses"
              active={location.pathname.includes("/admin/manage-buses")}
            />
          </Link>

          <Link to="/admin/banners" onClick={() => setIsOpen(false)}>
            <NavItem
              icon={<ImageIcon size={20} />}
              label="Banners"
              active={location.pathname.includes("/admin/banners")}
            />
          </Link>

          <Link to="/admin/bookings" onClick={() => setIsOpen(false)}>
            <NavItem
              icon={<Ticket size={20} />}
              label="Bookings"
              active={location.pathname.includes("/admin/bookings")}
            />
          </Link>

          <Link to="/admin/users" onClick={() => setIsOpen(false)}>
            <NavItem
              icon={<Users size={20} />}
              label="Customers"
              active={location.pathname.includes("/admin/users")}
            />
          </Link>

          <Link to="/admin/promos" onClick={() => setIsOpen(false)}>
            <NavItem
              icon={<Gift size={20} />}
              label="Promos"
              active={location.pathname.includes("/admin/promos")}
            />
          </Link>

          {/* Settings Group */}
          <div className="space-y-1">
            <button 
              onClick={() => setSettingsOpen(!settingsOpen)} 
              className="w-full text-left outline-none"
            >
              <NavItem 
                icon={<Settings size={20} />} 
                label="Settings" 
                active={location.pathname.includes("/admin/settings")} 
                isDropdown
                isOpen={settingsOpen}
              />
            </button>

            {settingsOpen && (
              <div className="pl-10 space-y-1 animate-in slide-in-from-top-2 duration-200">
                <Link to="/admin/settings/profile" onClick={() => setIsOpen(false)} className="block">
                  <SubNavItem label="Profile" active={location.pathname === "/admin/settings/profile"} />
                </Link>
                <Link to="/admin/settings/password" onClick={() => setIsOpen(false)} className="block">
                  <SubNavItem label="Password" active={location.pathname === "/admin/settings/password"} />
                </Link>
                
                {/* ✅ Logout Action */}
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left outline-none block"
                >
                  <SubNavItem 
                    label="Logout" 
                    isDanger={true} 
                  />
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 px-2">
                <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold overflow-hidden">
                    {loggedInUser?.image?.secureUrl ? (
                        <img src={loggedInUser.image.secureUrl} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                        loggedInUser?.name?.charAt(0) || 'A'
                    )}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{loggedInUser?.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Administrator</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-slate-900">
          <div className="flex items-center">
             <button onClick={() => setIsOpen(true)} className="text-slate-400 hover:text-white">
               <Menu size={24} />
             </button>
             <h1 className="ml-4 font-black uppercase tracking-tighter text-white italic">SuvYatra</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

/* Nav Item Component */
const NavItem = ({ icon, label, active = false, isDropdown = false, isOpen = false }: any) => (
  <div
    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer group
    ${
      active
        ? "bg-emerald-500 text-emerald-950 font-black shadow-lg shadow-emerald-500/10"
        : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={`${active ? "text-emerald-950" : "text-slate-500 group-hover:text-emerald-500"} transition-colors`}>
          {icon}
      </span>
      <span className="text-sm tracking-tight">{label}</span>
    </div>
    {isDropdown && (
      <ChevronDown 
        size={16} 
        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${active ? "text-emerald-950" : "text-slate-500"}`} 
      />
    )}
  </div>
);

/* ✅ Sub Nav Item Component Updated */
const SubNavItem = ({ label, active = false, isDanger = false }: any) => (
  <div className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
    active 
    ? "text-emerald-500 bg-emerald-500/5" 
    : isDanger
    ? "text-slate-500 hover:text-red-400 hover:bg-red-500/5 hover:pl-5"
    : "text-slate-500 hover:text-slate-300 hover:pl-5"
  }`}>
    {isDanger && <LogOut size={12} />}
    {label}
  </div>
);

export default AdminPage;