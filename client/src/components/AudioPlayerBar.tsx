import React from "react";
import { Disc, Play, Pause } from "lucide-react";

interface AudioPlayerBarProps {
  currentPlaying: any;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setCurrentPlaying: (mix: any) => void;
  formatTime: (time: number) => string;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentPlaying,
  isPlaying,
  setIsPlaying,
  audioRef,
  currentTime,
  setCurrentTime,
  duration,
  setCurrentPlaying,
  formatTime
}) => {
  if (!currentPlaying) return null;

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-[#0a0d14]/95 border-t border-slate-800 px-6 py-3 shadow-2xl backdrop-blur-xl z-50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-1/4">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-black">
            <Disc className="w-5 h-5 animate-spin" style={{ animationDuration: "6s" }} />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{currentPlaying.title}</h4>
            <p className="text-[10px] text-slate-400 truncate">{currentPlaying.genre} • {currentPlaying.djName}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 flex-1 max-w-md">
          <button
            onClick={() => {
              if (audioRef.current) {
                if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
                else { audioRef.current.play(); setIsPlaying(true); }
              }
            }}
            className="w-8 h-8 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
          </button>
          <div className="flex items-center gap-2 w-full text-[10px] text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const t = Number(e.target.value);
                setCurrentTime(t);
                if (audioRef.current) audioRef.current.currentTime = t;
              }}
              className="flex-1 h-1 bg-slate-800 rounded appearance-none accent-amber-500"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <button onClick={() => setCurrentPlaying(null)} className="text-xs text-slate-500 hover:text-white">
          Close
        </button>
      </div>
    </div>
  );
};