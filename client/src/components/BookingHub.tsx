import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2, Sparkles, MapPin } from "lucide-react";

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  unit: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  eventType: string;
  location: string;
  description: string;
  imageUrl: string;
}

interface BookingHubProps {
  initialSelectedServiceId?: string | null;
}

const API_BASE = "http://localhost:5000/api";

export const BookingHub: React.FC<BookingHubProps> = ({ initialSelectedServiceId }) => {
  const [activeSubTab, setActiveSubTab] = useState<"calculator" | "portfolio">("calculator");
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [selectedServices, setSelectedServices] = useState<{ [id: string]: number }>({});

  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventType: "Club / Festival Gig",
    eventDate: "",
    location: "",
    notes: ""
  });

  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServicesAndPortfolio();
  }, []);

  // Pre-select service if passed from ServicesHub
  useEffect(() => {
    if (initialSelectedServiceId) {
      setSelectedServices(prev => ({ ...prev, [initialSelectedServiceId]: 1 }));
    }
  }, [initialSelectedServiceId]);

  const fetchServicesAndPortfolio = async () => {
    try {
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
          { id: "srv-3", name: "Grand Piano & Acoustic Setup", category: "Equipment", description: "Stage-ready digital and acoustic pianos with professional monitoring.", basePrice: 12000, unit: "event" },
          { id: "srv-4", name: "Live Club Deejay & Hype Performance", category: "Performance", description: "Seamless multi-genre mixing with elite crowd control.", basePrice: 20000, unit: "event" },
          { id: "srv-5", name: "Professional Event MC", category: "Performance", description: "Charismatic hosts to keep your crowd engaged.", basePrice: 10000, unit: "event" },
          { id: "srv-6", name: "Live Performing Artists & Bands", category: "Performance", description: "Top-tier vocalists and instrumentalists.", basePrice: 25000, unit: "event" }
        ]);
      }

      if (portRes.data.success && portRes.data.data.length > 0) {
        setPortfolio(portRes.data.data);
      } else {
        setPortfolio([
          { id: "port-1", title: "Freedom 250 Festival", eventType: "Campus Festival", location: "DeKUT Nyeri", description: "Delivered full sound system setup.", imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80" },
          { id: "port-2", title: "Kaimosi Youth Gala", eventType: "VIP Gala", location: "Vihiga County", description: "Supplied luxury tents and PA audio.", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80" },
          { id: "port-3", title: "Nyeri Club Takeover", eventType: "Club Gig", location: "Nyeri Town", description: "High-energy club mixing.", imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80" }
        ]);
      }
    } catch (err) {
      console.error("Error loading services/portfolio:", err);
    }
  };

  const handleToggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const updated = { ...prev };
      if (updated[serviceId]) delete updated[serviceId];
      else updated[serviceId] = 1;
      return updated;
    });
  };

  const handleQuantityChange = (serviceId: string, qty: number) => {
    if (qty < 1) return;
    setSelectedServices(prev => ({ ...prev, [serviceId]: qty }));
  };

  const calculateTotal = () => {
    return Object.entries(selectedServices).reduce((sum, [id, qty]) => {
      const srv = services.find(s => s.id === id);
      return sum + (srv ? srv.basePrice * qty : 0);
    }, 0);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceList = Object.entries(selectedServices).map(([serviceId, quantity]) => ({
      serviceId,
      quantity
    }));

    if (serviceList.length === 0) {
      alert("Please select at least one service or equipment package.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post(`${API_BASE}/bookings/multi-service`, {
        ...form,
        selectedServices: serviceList
      });

      if (res.data.success) {
        setCreatedBooking(res.data.data);
      }
    } catch (err) {
      alert("Failed to create booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <div className="flex gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveSubTab("calculator")}
          className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === "calculator"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          Custom Package & Booking Quote
        </button>
        <button
          onClick={() => setActiveSubTab("portfolio")}
          className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === "portfolio"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          Past Events & Portfolio Gallery ({portfolio.length})
        </button>
      </div>

      {activeSubTab === "calculator" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Select Offered Services & Gear
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map(srv => {
                const isSelected = Boolean(selectedServices[srv.id]);
                return (
                  <div
                    key={srv.id}
                    onClick={() => handleToggleService(srv.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-500/10"
                        : "bg-[#0d111a] border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-800 text-amber-400 rounded-md">
                          {srv.category}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                      </div>
                      <h4 className="font-bold text-sm text-white mt-2">{srv.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{srv.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center">
                      <span className="text-xs font-black text-amber-400">
                        KES {Number(srv.basePrice).toLocaleString()} / {srv.unit}
                      </span>

                      {isSelected && (
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleQuantityChange(srv.id, (selectedServices[srv.id] || 1) - 1)}
                            className="px-2 py-0.5 bg-slate-800 rounded text-xs font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold">{selectedServices[srv.id]}</span>
                          <button
                            onClick={() => handleQuantityChange(srv.id, (selectedServices[srv.id] || 1) + 1)}
                            className="px-2 py-0.5 bg-slate-800 rounded text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0d111a] border border-slate-800 rounded-3xl p-6 space-y-6 h-fit sticky top-6">
            <h3 className="text-base font-black text-white">Event Booking Summary</h3>

            <div className="bg-slate-950 p-4 rounded-xl space-y-2 border border-slate-800">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Selected Items:</span>
                <span>{Object.keys(selectedServices).length}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                <span>Estimated Price:</span>
                <span className="text-amber-400">KES {calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            {!createdBooking ? (
              <form onSubmit={handleSubmitBooking} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  className="w-full bg-[#0a0d14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  value={form.clientName}
                  onChange={e => setForm({ ...form, clientName: e.target.value })}
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full bg-[#0a0d14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  value={form.clientEmail}
                  onChange={e => setForm({ ...form, clientEmail: e.target.value })}
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number (e.g., 0712345678)"
                  className="w-full bg-[#0a0d14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  value={form.clientPhone}
                  onChange={e => setForm({ ...form, clientPhone: e.target.value })}
                />
                <input
                  type="date"
                  required
                  className="w-full bg-[#0a0d14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  value={form.eventDate}
                  onChange={e => setForm({ ...form, eventDate: e.target.value })}
                />
                <input
                  type="text"
                  required
                  placeholder="Venue Location"
                  className="w-full bg-[#0a0d14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase cursor-pointer"
                >
                  {isSubmitting ? "Processing..." : "Submit Booking Request"}
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 space-y-2">
                <p className="font-bold">✓ Booking Submitted Successfully!</p>
                <p>Reference: {createdBooking.id}</p>
                <p className="text-white font-black text-sm">
                  Total Quote: KES {createdBooking.totalAmount.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === "portfolio" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolio.map(item => (
            <div key={item.id} className="bg-[#0d111a] border border-slate-800 rounded-2xl overflow-hidden space-y-3">
              <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4 space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase">{item.eventType}</span>
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.description}</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};