import React from "react";
import { Disc, MapPin } from "lucide-react";

export const AboutHub: React.FC = () => {
  const services = [
    {
      title: "Live Club Gigs & Festival Performances",
      desc: "High-energy crowd engagement, seamless genre blending (Afrobeat, Amapiano, Reggae, Dancehall, and Gospel), and professional stage presence."
    },
    {
      title: "Audio Mixtape Production & Streaming",
      desc: "Mastering and publishing high-definition studio mixes, live DJ sets, and audio recordings for fans and ravers across Kenya and beyond."
    },
    {
      title: "Event Booking & Entertainment Management",
      desc: "End-to-end sound planning, artist collaborations, and professional event hosting for campus concerts, private parties, and corporate functions."
    },
    {
      title: "Artist Spotlight & Community Hub",
      desc: "Empowering upcoming creators and musicians by giving them a dedicated space to showcase their talent, drop tracks, and connect with ravers."
    }
  ];

  const previousGigs = [
    {
      event: "Freedom 250 Festival",
      venue: "Dedan Kimathi University of Technology (DeKUT)",
      date: "June 2026",
      desc: "Official featured deejay set delivering explosive crowd energy and seamless audio mixing for hundreds of students and festival-goers."
    },
    {
      event: "Youngsters Club & Campus Sessions",
      venue: "Nyeri & Vihiga County",
      date: "2025 – 2026",
      desc: "Recurring high-energy weekend live sessions and underground mix releases focusing on premium Amapiano and Afro House beats."
    },
    {
      event: "Vihiga Regional Youth Showcase",
      venue: "Vihiga County",
      date: "August 2026",
      desc: "Curated community entertainment sets supporting local talent, youth empowerment, and cultural music integration."
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Brand Story Hero */}
      <div className="bg-gradient-to-br from-amber-600/20 via-[#0d111a] to-[#0a0d14] border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black rounded-full uppercase tracking-wider">
          <Disc className="w-4 h-4 animate-spin" style={{ animationDuration: "6s" }} /> Official Entertainment Hub
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          ABOUT <span className="text-amber-400">YOUNGSTERS SOUNDS</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Founded and spearheaded by **DJ Derick**, Youngsters Sounds Entertainment is a premier creative powerhouse bridging the gap between high-energy club entertainment, live audio mix production, and artist empowerment. Rooted in Kenya's vibrant music culture, we specialize in delivering unforgettable sonic experiences across Afrobeat, Amapiano, Reggae, Dancehall, and Gospel genres.
        </p>
      </div>

      {/* What We Offer Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
          ⚡ What We Offer
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s, idx) => (
            <div key={idx} className="bg-[#0d111a] border border-slate-800 rounded-2xl p-6 space-y-2 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center font-black text-xs">
                  0{idx + 1}
                </div>
                <h4 className="text-sm font-black text-white">{s.title}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-11">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Gigs & Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
          🎧 Previous Gigs & Major Performances
        </h3>
        <div className="space-y-4">
          {previousGigs.map((gig, idx) => (
            <div key={idx} className="bg-[#0d111a] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-black rounded-md border border-amber-500/30">
                    {gig.date}
                  </span>
                  <h4 className="font-black text-white text-sm">{gig.event}</h4>
                </div>
                <p className="text-xs text-amber-400/90 flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5" /> {gig.venue}
                </p>
                <p className="text-xs text-slate-400 max-w-2xl">{gig.desc}</p>
              </div>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl shrink-0">
                Verified Gig ✓
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};