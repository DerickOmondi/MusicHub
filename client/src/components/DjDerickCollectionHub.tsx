import React, { useState } from "react";
import {
  Compass,
  Code,
  Disc,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Music,
  Layers,
  Upload,
  Video,
  X,
  Play,
} from "lucide-react";

interface Mixtape {
  id: number;
  title: string;
  genre: string;
  duration: string;
  releaseDate: string;
  description: string;
  mediaType: "audio" | "video";
  mediaUrl?: string;
}

export const DjDerickCollectionHub: React.FC = () => {
  const [activeGenre, setActiveGenre] = useState("All");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Check if admin is logged in from localStorage
  const [isAdminLoggedIn] = useState(() => {
    return localStorage.getItem("isAdminLoggedIn") === "true";
  });

  // Active video preview state
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Initial mixtapes state
  const [musicCollection, setMusicCollection] = useState<Mixtape[]>([
    {
      id: 1,
      title: "Amapiano State of Mind Vol. 1",
      genre: "Amapiano",
      duration: "1h 15m",
      releaseDate: "2026",
      description: "Deep log drums, soulful piano chords, and high-energy club transitions.",
      mediaType: "audio"
    },
    {
      id: 2,
      title: "Afrobeat & Afro House Fusion",
      genre: "Afrobeat",
      duration: "58m",
      releaseDate: "2026",
      description: "Vibrant rhythms blending West African grooves with East African club culture.",
      mediaType: "audio"
    },
    {
      id: 3,
      title: "Live DJ Set @ Campus Festival (Video)",
      genre: "Amapiano",
      duration: "1h 45m",
      releaseDate: "2026",
      description: "Full HD multi-camera live video recording of the main stage closing performance.",
      mediaType: "video",
      mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
      id: 4,
      title: "Reggae & Dancehall Anthem Mix",
      genre: "Reggae",
      duration: "1h 20m",
      releaseDate: "2026",
      description: "Roots rock reggae fused with modern dancehall crowd-pleasers.",
      mediaType: "audio"
    }
  ]);

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    title: "",
    genre: "Amapiano",
    duration: "",
    description: "",
    mediaType: "audio" as "audio" | "video",
    mediaUrl: ""
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.description) return;

    const newMixtape: Mixtape = {
      id: Date.now(),
      title: uploadForm.title,
      genre: uploadForm.genre,
      duration: uploadForm.duration || "45m",
      releaseDate: "2026",
      description: uploadForm.description,
      mediaType: uploadForm.mediaType,
      mediaUrl: uploadForm.mediaUrl
    };

    setMusicCollection([newMixtape, ...musicCollection]);
    setIsUploadOpen(false);
    setUploadForm({
      title: "",
      genre: "Amapiano",
      duration: "",
      description: "",
      mediaType: "audio",
      mediaUrl: ""
    });
  };

  const professionalProfiles = [
    {
      title: "Geomatics Engineer & Land Surveyor",
      icon: Compass,
      description: "Expertise in cadastral surveying, geodetic positioning, topographical mapping, boundary demarcation, and spatial data analysis.",
      tag: "Engineering"
    },
    {
      title: "GIS Specialist",
      icon: Layers,
      description: "Advanced spatial modeling, ArcGIS/QGIS data manipulation, remote sensing, spatial database management, and cartographic design.",
      tag: "Spatial Data"
    },
    {
      title: "Full Stack Developer",
      icon: Code,
      description: "Building scalable web applications, REST APIs, database design (MySQL/Prisma), and modern responsive frontends (React/TypeScript/Tailwind).",
      tag: "Software Engineering"
    },
    {
      title: "Professional Deejay (DJ Derick)",
      icon: Disc,
      description: "Multi-genre crowd control, festival headliner, live club mixing, audio mastering, and Youngsters Sounds platform founder.",
      tag: "Entertainment"
    }
  ];

  const contactInfo = {
    email: "derick@youngsterssounds.com",
    altEmail: "engineering.derick@gmail.com",
    whatsapp: "+254712345678",
    phone: "+254 712 345 678",
    location: "Nyeri & Vihiga County, Kenya",
    socials: {
      tiktok: "@djderick",
      facebook: "facebook.com/djderick",
      instagram: "instagram.com/djderick",
      github: "github.com/djderick-dev",
      linkedin: "linkedin.com/in/derick-omondi"
    }
  };

  const filteredMusic = activeGenre === "All"
    ? musicCollection
    : musicCollection.filter(m => m.genre.toLowerCase() === activeGenre.toLowerCase());

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* BACKGROUND LOGO WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
        <img
          src="/logo.png"
          alt="Watermark Logo"
          className="w-[500px] h-[500px] md:w-[750px] md:h-[750px] object-contain opacity-5 filter grayscale"
          onError={(e) => { e.currentTarget.src = "/logo.svg"; }}
        />
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-12 py-6 px-4">
        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600/30 via-slate-900/90 to-[#0d111a]/90 backdrop-blur-md border border-slate-800 p-8 md:p-12 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Master Portfolio & Collection
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              DJ DERICK <span className="text-amber-400">COLLECTION</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Welcome to my comprehensive professional archive. Bridging precision spatial engineering, software development, and elite music entertainment.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-full md:w-auto">
            {/* ONLY VISIBLE TO LOGGED IN ADMIN */}
            {isAdminLoggedIn && (
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer animate-pulse"
              >
                <Upload className="w-4 h-4" /> Upload Mixtape (Admin Only)
              </button>
            )}

            <a
              href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" /> WhatsApp Direct
            </a>
          </div>
        </div>

        {/* PROFESSIONAL DISCIPLINES */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
              🧭 Professional Expertise & Engineering
            </h3>
            <p className="text-xs text-slate-400">Combining technical precision with creative execution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professionalProfiles.map((prof, idx) => {
              const Icon = prof.icon;
              return (
                <div key={idx} className="bg-[#0d111a]/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-amber-500/40 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black rounded-full uppercase">
                      {prof.tag}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-white">{prof.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{prof.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MUSIC & VIDEO COLLECTION */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                🎧 Audio & Video Mixtape Collection
              </h3>
              <p className="text-xs text-slate-400">Curated sets, mixtapes, and video recordings.</p>
            </div>

            <div className="flex flex-wrap gap-1.5 bg-[#0d111a]/90 backdrop-blur-md p-1 border border-slate-800 rounded-xl text-xs font-bold text-slate-400">
              {["All", "Amapiano", "Afrobeat", "Reggae", "Gospel"].map((genre) => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeGenre === genre ? "bg-amber-500 text-slate-950" : "hover:text-white"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMusic.map((music) => (
              <div key={music.id} className="bg-[#0d111a]/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black rounded-full uppercase">
                        {music.genre}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border ${
                        music.mediaType === "video"
                          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }`}>
                        {music.mediaType === "video" ? <Video className="w-3 h-3" /> : <Music className="w-3 h-3" />}
                        {music.mediaType}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{music.duration}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-white">{music.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{music.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Released: {music.releaseDate}</span>
                  {music.mediaType === "video" && music.mediaUrl ? (
                    <button
                      onClick={() => setActiveVideoUrl(music.mediaUrl || null)}
                      className="px-3 py-1.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" /> Watch Video
                    </button>
                  ) : (
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                      <Music className="w-3.5 h-3.5" /> High Fidelity 320kbps
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT & SOCIAL LINKS */}
        <div className="bg-[#0d111a]/90 backdrop-blur-md border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
            📞 Direct Contacts & Social Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold uppercase block text-[10px]">Primary Email</span>
              <a href={`mailto:${contactInfo.email}`} className="text-amber-400 font-bold hover:underline flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {contactInfo.email}
              </a>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold uppercase block text-[10px]">Engineering Email</span>
              <a href={`mailto:${contactInfo.altEmail}`} className="text-amber-400 font-bold hover:underline flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {contactInfo.altEmail}
              </a>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold uppercase block text-[10px]">WhatsApp & Phone</span>
              <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, "")}`} className="text-emerald-400 font-bold hover:underline flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> {contactInfo.phone}
              </a>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold uppercase block text-[10px]">Location</span>
              <p className="text-slate-200 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> {contactInfo.location}
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold uppercase block text-[10px]">Social Profiles</span>
              <div className="flex gap-3 text-amber-400 pt-1">
                <span>TikTok: {contactInfo.socials.tiktok}</span>
                <span>•</span>
                <span>Instagram: {contactInfo.socials.instagram}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold uppercase block text-[10px]">Developer Profiles</span>
              <div className="flex gap-3 text-amber-400 pt-1">
                <span>GitHub: {contactInfo.socials.github}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPLOAD MIXTAPE MODAL (ADMIN ONLY) */}
      {isAdminLoggedIn && isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg bg-[#0d111a] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white uppercase flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-400" /> Upload Mixtape Archive
              </h3>
              <p className="text-xs text-slate-400">Add an audio or video mixtape to DJ Derick Collection.</p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Media Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadForm({ ...uploadForm, mediaType: "audio" })}
                    className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 border cursor-pointer ${
                      uploadForm.mediaType === "audio"
                        ? "bg-amber-500 text-slate-950 border-amber-500"
                        : "bg-slate-900 text-slate-400 border-slate-800"
                    }`}
                  >
                    <Music className="w-4 h-4" /> Audio Mixtape
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadForm({ ...uploadForm, mediaType: "video" })}
                    className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 border cursor-pointer ${
                      uploadForm.mediaType === "video"
                        ? "bg-purple-500 text-slate-950 border-purple-500"
                        : "bg-slate-900 text-slate-400 border-slate-800"
                    }`}
                  >
                    <Video className="w-4 h-4" /> Video Set / Live Show
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mixtape Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amapiano Sunset Session 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Genre</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                    value={uploadForm.genre}
                    onChange={(e) => setUploadForm({ ...uploadForm, genre: e.target.value })}
                  >
                    <option value="Amapiano">Amapiano</option>
                    <option value="Afrobeat">Afrobeat</option>
                    <option value="Reggae">Reggae</option>
                    <option value="Gospel">Gospel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 1h 10m"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                    value={uploadForm.duration}
                    onChange={(e) => setUploadForm({ ...uploadForm, duration: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the vibe, track highlights, or event location..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Media File / Direct Video Link</label>
                <input
                  type="text"
                  placeholder={uploadForm.mediaType === "video" ? "https://link-to-video.mp4" : "Select or paste MP3 file link..."}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  value={uploadForm.mediaUrl}
                  onChange={(e) => setUploadForm({ ...uploadForm, mediaUrl: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Publish To Collection
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIDEO PLAYER MODAL OVERLAY */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-4 right-4 z-10 p-2.5 text-white bg-slate-900/80 hover:bg-slate-800 rounded-full border border-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <video controls autoPlay className="w-full h-auto max-h-[80vh]">
              <source src={activeVideoUrl} type="video/mp4" />
              Your browser does not support playing this video.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};