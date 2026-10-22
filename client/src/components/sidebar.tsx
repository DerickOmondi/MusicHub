import React from "react";
import { Disc, Home, Users, Radio, MessageSquare, Briefcase, Info, Sparkles, Calendar } from "lucide-react";

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onOpenArtistAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav, onOpenArtistAuth }) => {
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

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800/80 bg-[#0d111a] p-5 justify-between shrink-0">
      <div className="space-y-6">
        {/* LOGO INTEGRATION */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveNav("Home")}>
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/30 flex items-center justify-center bg-slate-900 shadow-lg shadow-amber-500/10 shrink-0">
            {/* If your logo is a PNG, use /logo.png. Change extension if it's .svg / .jpg / .webp */}
            <img
              src="/logo.png"
              alt="Youngsters Sounds Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to logo icon if the file extension differs
                e.currentTarget.src = "/logo.svg";
              }}
            />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-amber-400">YOUNGSTERS SOUNDS</h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider">OFFICIAL DJ DERICK HUB</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveNav(item.name)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20" : "text-slate-400 hover:text-white hover:bg-slate-900"
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

        {/* Join as Artist Banner */}
        <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-amber-400 text-xs font-black">
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Join as an Artist</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Register your profile, showcase your talent, and drop your tracks.
          </p>
          <button
            onClick={onOpenArtistAuth}
            className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Become an Artist →
          </button>
        </div>
      </div>
    </aside>
  );
};