import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { AudioPlayerBar } from "./components/AudioPlayerBar";
import { AboutHub } from "./components/AboutHub";
import { ServicesHub } from "./components/ServicesHub";
import { LiveStreamHub } from "./components/LiveStreamHub";
import { ArtistPaymentModal } from "./components/ArtistPaymentModal";
import { ArtistAuthModal } from "./components/ArtistAuthModal";
import { DjDerickCollectionHub } from "./components/DjDerickCollectionHub";
import { BookingHub } from "./components/BookingHub";

import {
  Disc,
  Play,
  Upload,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  X,
  Lock,
  LogOut,
  UserCheck,
  Users,
  MessageSquare,
  ThumbsUp,
  Radio,
  Search,
  Sparkles,
  Home,
  Briefcase,
  Calendar
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const defaultGuest = {
  name: "Guest Listener",
  artisticName: "Visitor",
  role: "User",
  genre: "General",
  location: "Kenya",
  initial: "V",
  isVerified: false,
  socials: { tiktok: "", facebook: "", instagram: "" }
};

export default function App() {
  // Navigation & Modal States
  const [activeNav, setActiveNav] = useState("Home");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Bridge state for selecting a service and passing to BookingHub
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Persistent User Session
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : defaultGuest;
  });

  // Persistent Admin Session & Modal States
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("isAdminLoggedIn") === "true";
  });
  const [adminAuthForm, setAdminAuthForm] = useState({ email: "", password: "" });
  const [adminAuthError, setAdminAuthError] = useState("");

  // Community Feed States
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 1,
      author: "DJ Derick",
      role: "Resident DJ",
      avatar: "D",
      time: "2 hours ago",
      content: "Dropping a brand new Amapiano x Afrobeat mixtape this Friday! Who's ready for the heat? 🔥🎧",
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      author: "Brian K.",
      role: "Event Organizer",
      avatar: "B",
      time: "5 hours ago",
      content: "Huge shoutout to Youngsters Sounds for powering our campus festival PA setup last weekend. Unmatched audio quality!",
      likes: 18,
      comments: 3
    }
  ]);
  const [newPostContent, setNewPostContent] = useState("");

  // Registered Artists Roster
  const [artistRoster, setArtistRoster] = useState<any[]>([
    { id: 1, name: "Derick Omondi", artisticName: "DJ Derick", genre: "Afrobeat & Amapiano", category: "DJ", isVerified: true, img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80" },
    { id: 2, name: "Alex K", artisticName: "AfroVibe", genre: "Afrobeats", category: "Artist", isVerified: true, img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80" },
    { id: 3, name: "Amapiano King", artisticName: "DJ King", genre: "Amapiano", category: "DJ", isVerified: true, img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80" },
    { id: 4, name: "Reggaz", artisticName: "MC Reggaz", genre: "Reggae & Hype", category: "MC", isVerified: false, img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80" }
  ]);

  const [mixes, setMixes] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([
    { id: "BK-101", clientName: "Brian K.", clientPhone: "0712345678", eventType: "Campus Party", location: "DeKUT Nyeri", status: "Pending Verification" },
    { id: "BK-102", clientName: "Lilian M.", clientPhone: "0722334455", eventType: "Club Gig", location: "Vihiga Town", status: "Approved & Confirmed" }
  ]);

  const [currentPlaying, setCurrentPlaying] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Form states
  const [mixForm, setMixForm] = useState({
    title: "",
    genre: currentUser.genre || "Afrobeat & Amapiano",
    djName: currentUser.artisticName || "DJ Derick"
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchMixes();
    fetchBookings();
  }, []);

  const fetchMixes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/mixes`);
      if (res.data.success) setMixes(res.data.data);
    } catch (err) {
      console.error("Error fetching mixes:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/bookings`);
      if (res.data.success && res.data.data.length > 0) setBookings(res.data.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handlePlayMix = (mix: any) => {
    if (currentPlaying?.id === mix.id) {
      if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
      else { audioRef.current?.play(); setIsPlaying(true); }
    } else {
      setCurrentPlaying(mix);
      setIsPlaying(true);
    }
  };

  const handleCreateCommunityPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: currentUser.artisticName || currentUser.name,
      role: currentUser.role,
      avatar: currentUser.initial || "U",
      time: "Just now",
      content: newPostContent,
      likes: 0,
      comments: 0
    };

    setCommunityPosts([newPost, ...communityPosts]);
    setNewPostContent("");
  };

  // Database-driven Admin Authentication
  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError("");

    try {
      const res = await axios.post(`${API_BASE}/admin/login`, {
        email: adminAuthForm.email,
        password: adminAuthForm.password
      });

      if (res.data?.success && res.data?.admin?.role === "ADMIN") {
        setIsAdminLoggedIn(true);
        localStorage.setItem("isAdminLoggedIn", "true");
        if (res.data.token) {
          localStorage.setItem("adminToken", res.data.token);
        }
        setAdminAuthForm({ email: "", password: "" });
      } else {
        setAdminAuthError("Access denied: Account does not have Administrator privileges.");
      }
    } catch (err: any) {
      console.error("Admin Authentication Error:", err);
      setAdminAuthError(
        err.response?.data?.message || "Server error. Could not verify credentials against database."
      );
    }
  };

  const handleAdminSignOut = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminToken");
  };

  // Creator / Artist Sign Out
  const handleCreatorSignOut = () => {
    setCurrentUser(defaultGuest);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("artistToken");
    alert("Successfully signed out of profile.");
  };

  const handlePublishClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) { alert("Please select an audio file."); return; }
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async () => {
    if (!audioFile) {
      alert("No audio file selected.");
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("title", mixForm.title);
    formData.append("genre", mixForm.genre);
    formData.append("djName", mixForm.djName);
    formData.append("audio", audioFile);
    if (coverFile) formData.append("cover", coverFile);

    try {
      await axios.post(`${API_BASE}/mixes/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Payment verified & mix published successfully! 🎧🔥");
      setMixForm({ title: "", genre: currentUser.genre, djName: currentUser.artisticName });
      setAudioFile(null);
      setCoverFile(null);
      setActiveNav("Home");
      fetchMixes();
    } catch (err) {
      console.error("Error uploading mix:", err);
      alert("Failed to upload mix.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleArtistRegisterSuccess = (artistData: any) => {
    const newArtist = {
      id: Date.now(),
      name: artistData.fullName,
      artisticName: artistData.artisticName,
      role: "Artist",
      genre: artistData.genre,
      category: "Artist",
      location: "Kenya",
      initial: artistData.artisticName.charAt(0).toUpperCase(),
      isVerified: false,
      socials: {
        tiktok: artistData.tiktokLink || "",
        facebook: artistData.facebookLink || "",
        instagram: artistData.instagramLink || ""
      }
    };

    setArtistRoster(prev => [...prev, newArtist]);
    setCurrentUser(newArtist);
    localStorage.setItem("currentUser", JSON.stringify(newArtist));

    setMixForm(prev => ({
      ...prev,
      djName: artistData.artisticName,
      genre: artistData.genre
    }));
    setActiveNav("Upload");
  };

  const toggleArtistVerification = (artistId: number) => {
    setArtistRoster(prev =>
      prev.map(artist => {
        if (artist.id === artistId) {
          const updatedStatus = !artist.isVerified;
          if (currentUser.artisticName === artist.artisticName) {
            const updatedProfile = { ...currentUser, isVerified: updatedStatus };
            setCurrentUser(updatedProfile);
            localStorage.setItem("currentUser", JSON.stringify(updatedProfile));
          }
          return { ...artist, isVerified: updatedStatus };
        }
        return artist;
      })
    );
  };

  const handleApproveBooking = (bookingId: any, newStatus: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 font-sans flex flex-col justify-between pb-16 lg:pb-0">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onOpenArtistAuth={() => setIsAuthOpen(true)}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            currentUser={currentUser}
          />

          <main className="p-6 space-y-8">
            {/* HOME TAB */}
            {activeNav === "Home" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-3 relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-amber-600/30 via-slate-900 to-slate-950 p-8 md:p-10 flex flex-col justify-between shadow-2xl">
                    <div className="relative z-10 space-y-3 max-w-xl">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[11px] font-bold">
                        ⭐ Welcome to Youngsters Sounds
                      </span>
                      <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
                        FEEL THE RHYTHM OF <span className="text-amber-400">YOUNGSTERS SOUNDS</span>
                      </h2>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        A creative hub for DJs, upcoming artists, event bookings and a growing community of music lovers.
                      </p>
                    </div>
                    <div className="relative z-10 flex items-center gap-3 pt-4">
                      <button onClick={() => setActiveNav("Services & Gigs")} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer">Explore Services & Gigs</button>
                      <button onClick={() => setActiveNav("Bookings")} className="px-5 py-2.5 bg-slate-900 text-slate-200 border border-slate-700 font-black rounded-xl text-xs cursor-pointer">Book an Event</button>
                    </div>
                  </div>
                </div>

                {/* Featured Artists Roster */}
                <div className="space-y-4">
                  <h3 className="text-base font-black uppercase text-white">🔥 Featured Roster</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {artistRoster.map((artist) => (
                      <div key={artist.id} className="bg-[#0d111a] border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                        <div className="relative rounded-xl overflow-hidden h-32 mb-3 bg-slate-900">
                          <img src={artist.img || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80"} alt={artist.artisticName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="text-xs font-black text-white truncate">{artist.artisticName}</h4>
                            {artist.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{artist.genre}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mixes List */}
                <div className="space-y-4">
                  <h3 className="text-base font-black uppercase text-white">🎧 Latest Mixes & Uploads</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mixes.map((mix) => (
                      <div key={mix.id} className="bg-[#0d111a] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400 shrink-0">
                            <Disc className="w-5 h-5" />
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-black text-white truncate">{mix.title}</h4>
                            <p className="text-[10px] text-slate-400 truncate">{mix.genre} • {mix.djName}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handlePlayMix(mix)} className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                            <Play className="w-3.5 h-3.5 fill-slate-950" /> Play
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ARTISTS & DJS TAB */}
            {(activeNav === "Artists" || activeNav === "DJs") && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-2xl font-black uppercase text-white flex items-center gap-2">
                      <Users className="w-6 h-6 text-amber-400" /> {activeNav === "DJs" ? "Official DJ Roster" : "Verified Artists & Performers"}
                    </h2>
                    <p className="text-xs text-slate-400">Discover top talent available for event bookings, features, and live shows.</p>
                  </div>
                  <button onClick={() => setIsAuthOpen(true)} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase cursor-pointer">
                    + Join Roster
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {artistRoster
                    .filter(a => activeNav === "DJs" ? a.category === "DJ" : true)
                    .map((artist) => (
                      <div key={artist.id} className="bg-[#0d111a] border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:border-amber-500/40 transition-all">
                        <div className="relative rounded-2xl overflow-hidden h-44 bg-slate-950">
                          <img src={artist.img || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80"} alt={artist.artisticName} className="w-full h-full object-cover" />
                          {artist.isVerified && (
                            <span className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center gap-1 shadow-lg">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-base font-black text-white">{artist.artisticName}</h3>
                          <p className="text-xs text-slate-400">{artist.name}</p>
                          <span className="inline-block mt-2 px-3 py-1 bg-slate-900 text-amber-400 border border-slate-800 rounded-lg text-[10px] font-bold">
                            {artist.genre}
                          </span>
                        </div>

                        <button onClick={() => { setSelectedServiceId("srv-4"); setActiveNav("Bookings"); }} className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-black rounded-xl text-xs uppercase transition-all cursor-pointer">
                          Book {artist.artisticName}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* DJ DERICK COLLECTION TAB */}
            {activeNav === "DJ Derick Collection" && <DjDerickCollectionHub />}

            {/* COMMUNITY TAB */}
            {activeNav === "Community" && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-2xl font-black uppercase text-white flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-amber-400" /> Youngsters Sounds Community Hub
                  </h2>
                  <p className="text-xs text-slate-400">Share updates, event highlights, track feedback, and connect with fellow music lovers.</p>
                </div>

                {/* Post Creator Box */}
                <form onSubmit={handleCreateCommunityPost} className="bg-[#0d111a] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-amber-500 text-slate-950 font-black rounded-xl flex items-center justify-center shrink-0">
                      {currentUser.initial || "U"}
                    </div>
                    <textarea
                      required
                      rows={3}
                      placeholder="What's on your mind? Share news, event feedback, or track releases..."
                      className="w-full bg-[#0a0d14] border border-slate-800 rounded-2xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase cursor-pointer">
                      Publish Post
                    </button>
                  </div>
                </form>

                {/* Feed Posts */}
                <div className="space-y-4">
                  {communityPosts.map((post) => (
                    <div key={post.id} className="bg-[#0d111a] border border-slate-800 rounded-3xl p-5 space-y-3 shadow-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-800 text-amber-400 border border-slate-700 font-black rounded-xl flex items-center justify-center text-xs">
                            {post.avatar}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-white">{post.author}</h4>
                            <p className="text-[10px] text-slate-400">{post.role} • {post.time}</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed">{post.content}</p>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-6 text-xs text-slate-400">
                        <button className="flex items-center gap-1.5 hover:text-amber-400 cursor-pointer">
                          <ThumbsUp className="w-3.5 h-3.5" /> {post.likes}
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-amber-400 cursor-pointer">
                          <MessageSquare className="w-3.5 h-3.5" /> {post.comments} Comments
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SERVICES & GIGS TAB */}
            {activeNav === "Services & Gigs" && (
              <ServicesHub
                onBookNow={() => setActiveNav("Bookings")}
                onSelectService={(id) => setSelectedServiceId(id)}
              />
            )}

            {/* ABOUT US TAB */}
            {activeNav === "About Us" && <AboutHub />}

            {/* LIVE STREAMING TAB */}
            {activeNav === "Live Streaming" && <LiveStreamHub />}

            {/* UPLOAD STUDIO TAB */}
            {activeNav === "Upload" && (
              <div className="max-w-2xl mx-auto bg-[#0d111a] border border-slate-800 rounded-3xl p-6 space-y-6">
                <h2 className="text-xl font-black text-white flex items-center gap-2"><Upload className="w-5 h-5 text-amber-400" /> Upload Your Mix / Track</h2>

                <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between border ${
                  currentUser.isVerified ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                }`}>
                  <div className="flex items-center gap-3">
                    <span>Profile: {currentUser.artisticName} ({currentUser.role})</span>
                    <span className="flex items-center gap-1 font-black">
                      {currentUser.isVerified ? <><ShieldCheck className="w-4 h-4" /> Verified</> : <><ShieldAlert className="w-4 h-4" /> Not Verified</>}
                    </span>
                  </div>
                  {currentUser.role !== "User" && (
                    <button
                      onClick={handleCreatorSignOut}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-rose-400 rounded-lg text-[10px] font-black border border-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" /> Sign Out
                    </button>
                  )}
                </div>

                <form onSubmit={handlePublishClick} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mix Title</label>
                    <input type="text" required className="w-full bg-[#0a0d14] border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100" value={mixForm.title} onChange={(e) => setMixForm({ ...mixForm, title: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Genre</label>
                      <input type="text" required className="w-full bg-[#0a0d14] border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100" value={mixForm.genre} onChange={(e) => setMixForm({ ...mixForm, genre: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">DJ / Artist Name</label>
                      <input type="text" required className="w-full bg-[#0a0d14] border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100" value={mixForm.djName} onChange={(e) => setMixForm({ ...mixForm, djName: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">MP3 Audio File</label>
                    <input type="file" accept="audio/*" required className="w-full text-xs text-slate-400" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
                  </div>
                  <button type="submit" disabled={uploadLoading} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase cursor-pointer">
                    {uploadLoading ? "Processing..." : "Publish Mix (Pay KES 100)"}
                  </button>
                </form>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeNav === "Bookings" && (
              <BookingHub initialSelectedServiceId={selectedServiceId} />
            )}
          </main>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (Visible only on small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0d111a]/95 backdrop-blur-md border-t border-slate-800 px-4 py-2.5 flex justify-around items-center">
        {[
          { name: "Home", icon: Home },
          { name: "Services & Gigs", icon: Briefcase },
          { name: "DJ Derick Collection", icon: Sparkles },
          { name: "Bookings", icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeNav === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveNav(tab.name)}
              className={`flex flex-col items-center gap-1 p-1.5 transition-all cursor-pointer ${
                isActive ? "text-amber-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold truncate max-w-[70px]">{tab.name.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* DISCREET ADMIN TRIGGER */}
      <div className="fixed bottom-16 right-3 lg:bottom-3 z-40">
        <button
          onClick={() => setIsAdminModalOpen(true)}
          className="p-2.5 bg-[#121722]/80 hover:bg-[#121722] text-slate-500 hover:text-amber-400 rounded-full border border-slate-800 shadow-lg backdrop-blur-sm transition-all cursor-pointer"
          title="Admin Portal"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ADMIN MODAL */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl bg-[#0d111a] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setIsAdminModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-800 cursor-pointer">
              <X className="w-4 h-4" />
            </button>

            {!isAdminLoggedIn ? (
              <div className="space-y-6 max-w-md mx-auto py-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Admin System Authentication</h3>
                  <p className="text-xs text-slate-400">Enter database administrator credentials to unlock management tools.</p>
                </div>

                <form onSubmit={handleAdminSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@youngsterssounds.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      value={adminAuthForm.email}
                      onChange={(e) => setAdminAuthForm({ ...adminAuthForm, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      value={adminAuthForm.password}
                      onChange={(e) => setAdminAuthForm({ ...adminAuthForm, password: e.target.value })}
                    />
                  </div>

                  {adminAuthError && (
                    <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                      {adminAuthError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Authenticate & Enter Admin Portal
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-amber-400" /> System Admin Control Panel
                    </h3>
                    <p className="text-xs text-slate-400">Authenticated via Database • Youngsters Sounds</p>
                  </div>
                  <button
                    onClick={handleAdminSignOut}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-amber-400">Artist Profile Verifications</h4>
                  <div className="space-y-2">
                    {artistRoster.map((artist) => (
                      <div key={artist.id} className="bg-[#0a0d14] border border-slate-800 rounded-xl p-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-white">{artist.artisticName} ({artist.name})</p>
                          <p className="text-[10px] text-slate-400">{artist.genre}</p>
                        </div>
                        <button
                          onClick={() => toggleArtistVerification(artist.id)}
                          className={`px-3 py-1.5 rounded-xl font-black text-[10px] transition-all flex items-center gap-1 cursor-pointer ${
                            artist.isVerified
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {artist.isVerified ? <><CheckCircle className="w-3.5 h-3.5" /> Verified</> : <><XCircle className="w-3.5 h-3.5" /> Unverified</>}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-black uppercase text-amber-400">Event Booking Approvals</h4>
                  <div className="space-y-2">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-[#0a0d14] border border-slate-800 rounded-xl p-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-white">{booking.clientName} - {booking.eventType}</p>
                          <p className="text-[10px] text-slate-400">Location: {booking.location} | Phone: {booking.clientPhone}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveBooking(booking.id, "Approved & Confirmed")}
                            className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproveBooking(booking.id, "Declined")}
                            className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals & Audio Player */}
      <ArtistPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      <ArtistAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleArtistRegisterSuccess}
      />

      {currentPlaying && (
        <AudioPlayerBar
          currentPlaying={currentPlaying}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audioRef={audioRef}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          formatTime={formatTime}
        />
      )}
    </div>
  );
}