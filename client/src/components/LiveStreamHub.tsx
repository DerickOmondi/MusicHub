import React, { useState } from "react";
import { Eye, Send, Heart, Flame, Radio, MessageSquare, Search, Tv } from "lucide-react";

export const LiveStreamHub: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<"tiktok" | "facebook" | "youtube">("tiktok");
  const [streamSearch, setStreamSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "MusiqSoul", text: "The Amapiano transitions are CRAZY! 🔥🔥", time: "18:02" },
    { id: 2, user: "NyeriRaver", text: "DJ Derick on the decks! Greetings from Nyeri Town!", time: "18:03" },
    { id: 3, user: "Brian_K", text: "Freedom 250 Festival vibes all over again! 🎧", time: "18:04" },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [likesCount, setLikesCount] = useState(1240);

  // Broadcaster streams data ordered: TikTok -> Facebook -> YouTube
  const streamsData = {
    tiktok: {
      platform: "TikTok Live",
      color: "from-pink-500 to-rose-600",
      handle: "@YoungstersSoundsLive",
      title: "DJ Derick Afro-Amapiano Night (TikTok Stream)",
      viewers: "3.4K",
      badgeBg: "bg-pink-500",
      streamUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80"
    },
    facebook: {
      platform: "Facebook Live",
      color: "from-blue-600 to-indigo-700",
      handle: "Youngsters Sounds Official FB",
      title: "Youngsters Club Sessions & Campus Takeover",
      viewers: "1.8K",
      badgeBg: "bg-blue-600",
      streamUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80"
    },
    youtube: {
      platform: "YouTube Live HD",
      color: "from-red-600 to-rose-700",
      handle: "Youngsters Sounds TV",
      title: "Live Studio Recording & Hype Dj Set 1080p",
      viewers: "5.2K",
      badgeBg: "bg-red-600",
      streamUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80"
    }
  };

  const currentStream = streamsData[selectedPlatform];

  const handleSearchBroadcasts = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulates live feed search across TikTok -> Facebook -> YouTube
    setTimeout(() => {
      setIsSearching(false);
    }, 1200);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages([
      ...chatMessages,
      { id: Date.now(), user: "You", text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputMsg("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Search & Platform Selection Header (TikTok -> Facebook -> YouTube) */}
      <div className="bg-[#0d111a] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Tv className="w-5 h-5 text-amber-400" /> Multi-Platform Broadcast Finder
            </h2>
            <p className="text-xs text-slate-400">Discover live streams across TikTok, Facebook, and YouTube.</p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchBroadcasts} className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Find broadcast or DJ handle..."
                className="w-full bg-[#0a0d14] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                value={streamSearch}
                onChange={(e) => setStreamSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs whitespace-nowrap"
            >
              {isSearching ? "Searching..." : "Search Feeds"}
            </button>
          </form>
        </div>

        {/* Platform Selection Buttons (Ordered: TikTok -> Facebook -> YouTube) */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setSelectedPlatform("tiktok")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              selectedPlatform === "tiktok"
                ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <span>🎵 1. TikTok Live</span>
          </button>

          <button
            onClick={() => setSelectedPlatform("facebook")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              selectedPlatform === "facebook"
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <span>📘 2. Facebook Live</span>
          </button>

          <button
            onClick={() => setSelectedPlatform("youtube")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              selectedPlatform === "youtube"
                ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <span>▶️ 3. YouTube Live HD</span>
          </button>
        </div>
      </div>

      {/* Stream Display Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0d111a] border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 border border-rose-500/30 text-rose-500 rounded-xl animate-pulse">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              {currentStream.title}{" "}
              <span className={`px-2 py-0.5 text-white text-[10px] rounded font-black ${currentStream.badgeBg}`}>
                LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Broadcasting via {currentStream.platform} • {currentStream.handle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1 text-slate-300">
            <Eye className="w-4 h-4 text-amber-400" /> {currentStream.viewers} Viewers
          </span>
          <button
            onClick={() => setLikesCount((c) => c + 1)}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-all shadow-md"
          >
            <Flame className="w-4 h-4 fill-slate-950" /> Send Hype
          </button>
        </div>
      </div>

      {/* Video Stage Container & Live Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0d111a] border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl">
          <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
            <img
              src={currentStream.streamUrl}
              alt="Live Stage"
              className="w-full h-full object-cover opacity-75 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d111a] via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-black text-white shadow-lg ${currentStream.badgeBg}`}>
                {currentStream.platform}
              </span>
            </div>
          </div>

          <div className="p-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Audio Stream Quality: HD Ultra-Clear 320kbps</span>
            <span className="flex items-center gap-1 font-bold text-amber-400">
              <Heart className="w-4 h-4 fill-amber-400" /> {likesCount} Hype Likes
            </span>
          </div>
        </div>

        {/* Live Chat Room */}
        <div className="bg-[#0d111a] border border-slate-800 rounded-3xl p-4 flex flex-col justify-between h-[420px]">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-amber-400" /> Live Feed Chat
            </h4>
            <span className="text-[10px] text-slate-500 font-bold">Real-Time</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-0.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-amber-400">{msg.user}</span>
                  <span className="text-slate-500">{msg.time}</span>
                </div>
                <p className="text-slate-200">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              placeholder="Chat with ravers..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
            />
            <button type="submit" className="bg-amber-500 hover:bg-amber-400 p-2 rounded-xl text-slate-950 font-bold">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};