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

  return (
    <footer className="fixed bottom-0 inset-x-0 z-40 bg-black">
      {/* barra mobile */}
      {track && (
        <div className="md:hidden flex items-center gap-3 px-4 py-2.5 border-t border-white/5">
          <button onClick={onToggle} aria-label={playing ? 'Pausar' : 'Tocar'} className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black shrink-0">
            {playing ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 ml-0.5" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate text-white">{track.prettyName}</p>
            <p className="text-xs text-muted truncate">{content.defaultArtist}</p>
          </div>
          <button onClick={onNext} aria-label="Próxima" className="text-muted hover:text-white">
            <NextIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* barra desktop — layout Spotify */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 h-[72px]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-14 h-14 rounded-md bg-panel-highlight flex items-center justify-center overflow-hidden border border-white/5">
            {track ? <HeartIcon className="w-6 h-6 text-spotify" /> : <span className="text-xs text-neutral-600">--</span>}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate text-white">
              {track ? track.prettyName : 'Escolha uma música'}
            </p>
            <p className="text-xs text-muted truncate">{track ? content.defaultArtist : 'Nossa trilha sonora'}</p>
          </div>
          {track && <HeartIcon className="w-4 h-4 text-spotify ml-2 shrink-0" />}
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-5">
            <button
              onClick={onToggleShuffle}
              aria-label="Aleatório"
              title="Aleatório"
              className={shuffle ? 'text-spotify-bright' : 'text-muted hover:text-white'}
            >
              <ShuffleIcon className="w-4 h-4" />
            </button>
            <button onClick={onPrev} aria-label="Anterior" className="text-muted hover:text-white">
              <PrevIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onToggle}
              aria-label={playing ? 'Pausar' : 'Tocar'}
              className="w-8 h-8 rounded-full bg-white hover:scale-105 transition flex items-center justify-center text-black"
            >
              {playing ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 ml-0.5" />}
            </button>
            <button onClick={onNext} aria-label="Próxima" className="text-muted hover:text-white">
              <NextIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onToggleRepeat}
              aria-label="Repetir"
              title="Repetir"
              className={repeat ? 'text-spotify-bright' : 'text-muted hover:text-white'}
            >
              <RepeatIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-[420px] max-w-full">
            <span className="text-[11px] text-muted tabular-nums w-9 text-right">{formatTime(progress)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(progress, duration || 0)}
              onChange={(e) => onSeek(Number(e.target.value))}
              aria-label="Progresso"
              className="flex-1 cursor-pointer"
            />
            <span className="text-[11px] text-muted tabular-nums w-9">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <VolumeIcon className="w-4 h-4 text-muted" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolume(Number(e.target.value))}
            aria-label="Volume"
            className="w-24 cursor-pointer"
          />
        </div>
      </div>
    </footer>
  );
}
