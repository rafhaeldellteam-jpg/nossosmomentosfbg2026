import { useEffect, useState } from 'react';
import type { MediaItem } from '../lib/supabase';
import {
  HeartIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  RepeatIcon,
  ShuffleIcon,
  VolumeIcon,
} from './Icons';
import { content } from '../config/content';

type Props = {
  track: MediaItem | null;
  playing: boolean;
  shuffle: boolean;
  repeat: boolean;
  progress: number;
  duration: number;
  volume: number;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onVolume: (v: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
};

function formatTime(s: number): string {
  if (!isFinite(s) || s <= 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function PlayerBar(props: Props) {
  const {
    track,
    playing,
    shuffle,
    repeat,
    progress,
    duration,
    volume,
    onToggle,
    onNext,
    onPrev,
    onSeek,
    onVolume,
    onToggleShuffle,
    onToggleRepeat,
  } = props;

  const [mobilePlaying, setMobilePlaying] = useState(false);

  useEffect(() => {
    if (playing) setMobilePlaying(false);
  }, [playing]);

  return (
    <footer className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-stone-950/95 backdrop-blur">
      {/* barra mobile */}
      {track && (
        <div className="md:hidden flex items-center gap-3 px-4 py-2.5">
          <button onClick={onToggle} aria-label={playing ? 'Pausar' : 'Tocar'} className="w-9 h-9 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0">
            {playing ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 ml-0.5" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate text-stone-200">{track.prettyName}</p>
            <p className="text-xs text-stone-500 truncate">{content.defaultArtist}</p>
          </div>
          <button onClick={onNext} aria-label="Próxima" className="text-stone-400 hover:text-white">
            <NextIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* barra desktop */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 h-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-500/40 to-rose-900/40 border border-white/10 flex items-center justify-center overflow-hidden">
            {track ? <HeartIcon className="w-5 h-5 text-rose-400" /> : <span className="text-xs text-stone-600">--</span>}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate text-stone-100">
              {track ? track.prettyName : 'Escolha uma música'}
            </p>
            <p className="text-xs text-stone-500 truncate">{track ? content.defaultArtist : 'Nossa trilha sonora'}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleShuffle}
              aria-label="Aleatório"
              className={shuffle ? 'text-rose-400' : 'text-stone-500 hover:text-stone-300'}
            >
              <ShuffleIcon className="w-4 h-4" />
            </button>
            <button onClick={onPrev} aria-label="Anterior" className="text-stone-400 hover:text-white">
              <PrevIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onToggle}
              aria-label={playing ? 'Pausar' : 'Tocar'}
              className="w-10 h-10 rounded-full bg-white text-stone-900 hover:scale-105 transition flex items-center justify-center"
            >
              {playing ? <PauseIcon className="w-4.5 h-4.5" /> : <PlayIcon className="w-4.5 h-4.5 ml-0.5" />}
            </button>
            <button onClick={onNext} aria-label="Próxima" className="text-stone-400 hover:text-white">
              <NextIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onToggleRepeat}
              aria-label="Repetir"
              className={repeat ? 'text-rose-400' : 'text-stone-500 hover:text-stone-300'}
            >
              <RepeatIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-[380px] max-w-full">
            <span className="text-[11px] text-stone-500 tabular-nums w-9 text-right">{formatTime(progress)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(progress, duration || 0)}
              onChange={(e) => onSeek(Number(e.target.value))}
              aria-label="Progresso"
              className="flex-1 h-1 accent-rose-400 cursor-pointer"
            />
            <span className="text-[11px] text-stone-500 tabular-nums w-9">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <VolumeIcon className="w-4 h-4 text-stone-500" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolume(Number(e.target.value))}
            aria-label="Volume"
            className="w-24 h-1 accent-rose-400 cursor-pointer"
          />
        </div>
      </div>
    </footer>
  );
}
