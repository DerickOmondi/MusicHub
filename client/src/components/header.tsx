import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  Briefcase,
  Info,
  Users,
  Disc,
  Sparkles,
  Radio,
  MessageSquare,
  Calendar,
  Search,
} from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  currentUser: any;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  activeNav,
  setActiveNav,
  currentUser
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: Home },
    { name: "Services & Gigs", icon: Briefcase },
    { name: "About Us", icon: Info },
    { name: "Artists", icon: Users },
    { name: "DJs", icon: Disc },
    { name: "DJ Derick Collection", icon: Sparkles },
    { name: "Live Streaming", icon: Radio, badge: "LIVE" },
    { name: "Community", icon: MessageSquare },
    { name: "Bookings", icon: Calendar },
  ];

  const handleNavClick = (navName: string) => {
    setActiveNav(navName);
    setIsMobileMenuOpen(false); // Close drawer on selection
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d111a]/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">

      {/* Left: Mobile Hamburger & Logo Branding */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button (Visible on small screens) */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 rounded-xl transition-all cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveNav("Home")}>
          <img
            src="/logo.png"
            alt="Logo"
            className="w-8 h-8 rounded-lg object-cover border border-amber-500/30 shadow-md"
            onError={(e) => { e.currentTarget.src = "/logo.svg"; }}
          />
          <div className="hidden sm:block">
            <h1 className="text-xs font-black uppercase tracking-wider text-amber-400">YOUNGSTERS SOUNDS</h1>
            <p className="text-[9px] text-slate-400 font-semibold tracking-wider">OFFICIAL HUB</p>
          </div>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search mixes, artists, services..."
          className="w-full bg-[#0a0d14] border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Right: User Profile Chip */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-2xl">
          <div className="w-6 h-6 bg-amber-500 text-slate-950 font-black rounded-lg flex items-center justify-center text-xs">
            {currentUser.initial || "U"}
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-xs font-black text-white truncate max-w-[100px]">{currentUser.artisticName || currentUser.name}</p>
            <p className="text-[9px] text-amber-400 font-bold uppercase">{currentUser.role}</p>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MOBILE SLIDE-OUT DRAWER MENU             */}
      {/* ========================================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-80 max-w-[85%] bg-[#0d111a] border-r border-slate-800 h-full flex flex-col justify-between p-6 z-10 shadow-2xl overflow-y-auto">
            <div className="space-y-6">

              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover border border-amber-500/30" />
                  <div>
                    <h2 className="text-xs font-black uppercase text-amber-400">YOUNGSTERS SOUNDS</h2>
                    <p className="text-[9px] text-slate-400">NAVIGATION MENU</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                          : "text-slate-300 hover:bg-slate-900 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

            </div>

            {/* Drawer Footer Info */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 text-slate-950 font-black rounded-xl flex items-center justify-center text-xs">
                  {currentUser.initial || "U"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-white truncate">{currentUser.artisticName || currentUser.name}</p>
                  <p className="text-[10px] text-amber-400 font-bold">{currentUser.role}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};