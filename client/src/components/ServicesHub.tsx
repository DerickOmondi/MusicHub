import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  Zap,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface ServicesHubProps {
  onBookNow: () => void;
  onSelectService?: (serviceId: string) => void;
}

const API_BASE = "http://localhost:5000/api";

export const ServicesHub: React.FC<ServicesHubProps> = ({ onBookNow, onSelectService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [services, setServices] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHubData();
  }, []);

  const fetchHubData = async () => {
    try {
      setLoading(true);
      const [srvRes, portRes] = await Promise.all([
        axios.get(`${API_BASE}/services`).catch(() => ({ data: { success: false, data: [] } })),
        axios.get(`${API_BASE}/portfolio`).catch(() => ({ data: { success: false, data: [] } }))
      ]);

      if (srvRes.data.success && srvRes.data.data.length > 0) {
        setServices(srvRes.data.data);
      } else {
        setServices([
          { id: "srv-1", name: "Professional Sound Systems & Speakers", category: "Equipment", description: "High-definition active PA speakers, subwoofers, and digital mixers.", basePrice: 15000, unit: "event" },
          { id: "srv-2", name: "Event Tents & Canopies", category: "Equipment", description: "Durable waterproof frame tents and luxury VIP canopies.", basePrice: 10000, unit: "day" },
          { id: "srv-3", name: "Grand Piano & Acoustic Setup", category: "Equipment", description: "Stage-ready digital and acoustic pianos with monitoring.", basePrice: 12000, unit: "event" },
          { id: "srv-4", name: "Live Club Deejay & Hype Performance", category: "Performance", description: "Seamless multi-genre mixing with elite crowd control.", basePrice: 20000, unit: "event" },
          { id: "srv-5", name: "Professional Event MC", category: "Performance", description: "Charismatic hosts to keep your crowd engaged.", basePrice: 10000, unit: "event" },
          { id: "srv-6", name: "Live Performing Artists & Bands", category: "Performance", description: "Top-tier vocalists, instrumentalists, and live guest acts.", basePrice: 25000, unit: "event" }
        ]);
      }

      if (portRes.data.success && portRes.data.data.length > 0) {
        setPortfolio(portRes.data.data);
      } else {
        setPortfolio([
          { id: "port-1", title: "Freedom 250 Festival", eventType: "Campus Festival", location: "DeKUT Nyeri", description: "Delivered full sound system setup, stage lighting, and headliner DJ performance.", imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80" },
          { id: "port-2", title: "Kaimosi Youth Gala", eventType: "VIP Gala", location: "Vihiga County", description: "Supplied luxury tents, PA audio reinforcement, and lead MC coordination.", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80" },
          { id: "port-3", title: "Nyeri Club Takeover", eventType: "Club Gig", location: "Nyeri Town", description: "High-energy club mixing with live digital stream integration.", imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80" }
        ]);
      }
    } catch (err) {
      console.error("Error fetching hub data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClick = (serviceId: string) => {
    if (onSelectService) {
      onSelectService(serviceId);
    }
    onBookNow();
  };

  const categories = ["All", "Equipment", "Performance", "Production", "Promotion"];
  const filteredServices = selectedCategory === "All"
    ? services
    : services.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-4">
      {/* Services Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600/30 via-slate-900 to-[#0d111a] border border-slate-800 p-8 md:p-12 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Premium Entertainment & Equipment Hub
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            ELEVATE YOUR EVENT WITH <span className="text-amber-400">YOUNGSTERS SOUNDS</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Explore our comprehensive catalog of sound systems, speakers, tents, grand pianos, expert deejays, MCs, and performing artists.
          </p>
        </div>

        <button
          onClick={onBookNow}
          className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap cursor-pointer"
        >
          Build Custom Quote →
        </button>
      </div>

      {/* CORE SERVICES & EQUIPMENT CATALOG */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
              ⚡ Available Services & Equipment Catalog
            </h3>
            <p className="text-xs text-slate-400">Click select to pre-check any equipment or service in your quote.</p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-[#0d111a] p-1 border border-slate-800 rounded-xl text-xs font-bold text-slate-400">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat ? "bg-amber-500 text-slate-950" : "hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Loading services catalog...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((s) => (
              <div
                key={s.id}
                className="bg-[#0d111a] border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 transition-all shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black rounded-full uppercase">
                      {s.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-white">{s.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Rate / Unit</span>
                    <span className="text-sm font-black text-amber-400">
                      KES {Number(s.basePrice).toLocaleString()} / {s.unit || "event"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSelectClick(s.id)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    Select <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PORTFOLIO HISTORY */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div>
          <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
            🎧 Past Event History & Portfolio Gallery
          </h3>
          <p className="text-xs text-slate-400">Showcasing our past setups, festival sound engineering, and crowd engagement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolio.map((item, idx) => (
            <div key={item.id || idx} className="bg-[#0d111a] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div className="relative h-48 overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d111a] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur text-amber-400 border border-amber-500/30 text-[10px] font-black rounded-full uppercase">
                  {item.eventType}
                </span>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-black text-white">{item.title}</h4>
                  <p className="text-xs text-amber-400/90 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {item.location}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};