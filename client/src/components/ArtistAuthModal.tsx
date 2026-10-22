import React, { useState } from "react";
import { Sparkles, X, User, Music, Phone, ArrowRight, Share2 } from "lucide-react";

interface ArtistAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (artistData: any) => void;
}

export const ArtistAuthModal: React.FC<ArtistAuthModalProps> = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    artisticName: "",
    genre: "Afrobeat & Amapiano",
    phone: "",
    bio: "",
    tiktokLink: "",
    facebookLink: "",
    instagramLink: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.artisticName || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    alert(`Welcome aboard, ${formData.artisticName}! 🎧 Your live stream channels are linked.`);
    onRegisterSuccess(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-[#0d111a] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Artist Sign Up & Stream Channels</h3>
          <p className="text-xs text-slate-400">
            Register your details and social channels to link your live streams across platforms.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" /> Full Legal Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Derick Omondi"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-amber-400" /> Stage / Artistic Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DJ Derick"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                value={formData.artisticName}
                onChange={(e) => setFormData({ ...formData, artisticName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Music Genre</label>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              >
                <option value="Afrobeat & Amapiano">Afrobeat & Amapiano</option>
                <option value="Reggae & Dancehall">Reggae & Dancehall</option>
                <option value="Gospel">Gospel</option>
                <option value="Hip Hop / Trap">Hip Hop / Trap</option>
                <option value="Gengetone">Gengetone</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone Number
              </label>
              <input
                type="text"
                required
                placeholder="0712345678"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Social / Stream Broadcast Links Section */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
              <Share2 className="w-3.5 h-3.5" /> Live Broadcast Social Links
            </label>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">TikTok Live Handle / Link</label>
              <input
                type="text"
                placeholder="https://tiktok.com/@username or @username"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-pink-500"
                value={formData.tiktokLink}
                onChange={(e) => setFormData({ ...formData, tiktokLink: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Facebook Page / Stream Link</label>
              <input
                type="text"
                placeholder="https://facebook.com/yourpage"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                value={formData.facebookLink}
                onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Instagram Profile / Stream Link</label>
              <input
                type="text"
                placeholder="https://instagram.com/username"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                value={formData.instagramLink}
                onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Complete Profile & Link Channels <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};