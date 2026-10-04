import { useState } from 'react';
import type { MediaItem } from '../lib/supabase';
import {
  ChevronDownIcon,
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

export type RepeatMode = 'off' | 'all' | 'one';

type Props = {
  tracks: MediaItem[];
  currentIndex: number;
  track: MediaItem | null;
  playing: boolean;
  shuffle: boolean;
  repeatMode: RepeatMode;
  progress: number;
  duration: number;
  volume: number;
  coverUrl: string | null;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onVolume: (v: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onSelectTrack: (index: number) => void;
};

function formatTime(s: number): string {
  if (!isFinite(s) || s <= 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

const repeatTitles: Record<RepeatMode, string> = {
  off: 'Repetir: desativado',
  all: 'Repetir: playlist',
  one: 'Repetir: esta música',
};

export default function PlayerBar(props: Props) {
  const {
    tracks,
    currentIndex,
    track,
    playing,
    shuffle,
    repeatMode,
    progress,
    duration,
    volume,
    coverUrl,
    onToggle,
    onNext,
    onPrev,
    onSeek,
    onVolume,
    onToggleShuffle,
    onToggleRepeat,
    onSelectTrack,
  } = props;

  const [expanded, setExpanded] = useState(false);

  const repeatClass = (active: boolean) =>
    `relative inline-flex ${active ? 'text-spotify-bright' : 'text-muted'}`;

  return (
    <>
      <footer className="fixed bottom-0 inset-x-0 z-40 bg-black">
        {/* barra mobile — mini-player estilo Spotify */}
        {track && (
          <div className="md:hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-t border-white/5">
              <button
                onClick={() => setExpanded(true)}
                aria-label="Abrir player completo"
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                <div className="w-10 h-10 rounded bg-panel-highlight overflow-hidden shrink-0 flex items-center justify-center">
                  {coverUrl ? (
                    <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-spotify" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate text-white">{track.prettyName}</p>
                  <p className="text-xs text-muted truncate">{content.defaultArtist}</p>
                </div>
              </button>
              <button onClick={onPrev} aria-label="Anterior" className="text-white/80 active:text-white p-1.5 shrink-0">
                <PrevIcon className="w-5 h-5" />
              </button>
              <button
                onClick={onToggle}
                aria-label={playing ? 'Pausar' : 'Tocar'}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black shrink-0"
              >
                {playing ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 ml-0.5" />}
              </button>
              <button onClick={onNext} aria-label="Próxima" className="text-white/80 active:text-white p-1.5 shrink-0">
                <NextIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="h-0.5 bg-white/10">
              <div
                className="h-full bg-spotify-bright transition-[width] duration-300"
                style={{ width: `${duration ? Math.min(100, (progress / duration) * 100) : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* barra desktop — layout Spotify */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 h-[72px]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-md bg-panel-highlight flex items-center justify-center overflow-hidden border border-white/5">
              {coverUrl ? (
                <img src={coverUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <HeartIcon className="w-6 h-6 text-spotify" />
              )}
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
                title={repeatTitles[repeatMode]}
                className={repeatMode !== 'off' ? 'text-spotify-bright' : 'text-muted hover:text-white'}
              >
                <span className={repeatClass(repeatMode !== 'off')}>
                  <RepeatIcon className="w-4 h-4" />
                  {repeatMode === 'one' && (
                    <span className="absolute -top-1 -right-1.5 text-[9px] font-bold">1</span>
                  )}
                </span>
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

      {/* player expandido mobile — tela cheia estilo Spotify */}
      {expanded && track && (
        <div className="md:hidden fixed inset-0 z-50 overflow-y-auto animate-slide-up">
          <div className="min-h-full flex flex-col px-6 py-5 bg-gradient-to-b from-emerald-900/60 via-neutral-950 to-neutral-950">
            <div className="flex items-center justify-between">
              <button onClick={() => setExpanded(false)} aria-label="Fechar" className="p-1 -ml-1 text-white">
                <ChevronDownIcon className="w-7 h-7" />
              </button>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted">Tocando da playlist</p>
                <p className="text-xs text-white/80 truncate max-w-[180px]">{content.playlistName}</p>
              </div>
              <HeartIcon className="w-5 h-5 text-spotify" />
            </div>

            <div className="flex-1 flex items-center justify-center py-6 min-h-0">
              <div className="w-full max-w-[280px] aspect-square rounded-lg shadow-2xl bg-gradient-to-br from-emerald-700 to-neutral-900 overflow-hidden">
                {coverUrl ? (
                  <img src={coverUrl} alt="capa" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HeartIcon className="w-16 h-16 text-black/60" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xl font-bold truncate">{track.prettyName}</p>
                <p className="text-sm text-muted truncate">{content.defaultArtist}</p>
              </div>
              <HeartIcon className="w-6 h-6 text-spotify shrink-0" />
            </div>

            <div className="mt-4">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(progress, duration || 0)}
                onChange={(e) => onSeek(Number(e.target.value))}
                aria-label="Progresso"
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-muted tabular-nums mt-1.5">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5 px-1">
              <button
                onClick={onToggleShuffle}
                aria-label="Aleatório"
                className={`p-2 ${shuffle ? 'text-spotify-bright' : 'text-muted'}`}
              >
                <ShuffleIcon className="w-5 h-5" />
              </button>
              <button onClick={onPrev} aria-label="Anterior" className="p-2 text-white">
                <PrevIcon className="w-8 h-8" />
              </button>
              <button
                onClick={onToggle}
                aria-label={playing ? 'Pausar' : 'Tocar'}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black active:scale-95 transition"
              >
                {playing ? <PauseIcon className="w-7 h-7" /> : <PlayIcon className="w-7 h-7 ml-1" />}
              </button>
              <button onClick={onNext} aria-label="Próxima" className="p-2 text-white">
                <NextIcon className="w-8 h-8" />
              </button>
              <button
                onClick={onToggleRepeat}
                aria-label="Repetir"
                title={repeatTitles[repeatMode]}
                className={`p-2 ${repeatMode !== 'off' ? 'text-spotify-bright' : 'text-muted'}`}
              >
                <span className={repeatClass(repeatMode !== 'off')}>
                  <RepeatIcon className="w-5 h-5" />
                  {repeatMode === 'one' && (
                    <span className="absolute -top-0.5 -right-0.5 text-[10px] font-bold">1</span>
                  )}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <VolumeIcon className="w-4 h-4 text-muted" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => onVolume(Number(e.target.value))}
                aria-label="Volume"
                className="flex-1"
              />
            </div>

            <div className="mt-8 pb-8">
              <p className="text-sm font-bold mb-3">Próximas músicas</p>
              <ul className="space-y-1">
                {tracks.map((t, i) => (
                  <li key={t.name}>
                    <button
                      onClick={() => onSelectTrack(i)}
                      className={`w-full text-left px-3 py-2.5 rounded-md flex items-center gap-3 ${
                        i === currentIndex ? 'bg-panel-highlight text-spotify' : 'text-white/90 active:bg-white/5'
                      }`}
                    >
                      <span className="text-xs text-muted w-4 shrink-0">{i + 1}</span>
                      <span className="flex-1 min-w-0 truncate text-sm">{t.prettyName}</span>
                      {i === currentIndex && playing && (
                        <span className="text-[10px] uppercase tracking-wide text-spotify shrink-0">tocando</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
