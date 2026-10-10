import type { CSSProperties } from 'react';
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
  VolumeLowIcon,
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
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
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

/** Barra deslizante idêntica à do Spotify (trilha fina, preenchimento branco/verde). */
function Slider({
  value,
  max,
  onChange,
  ariaLabel,
  className = '',
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
  ariaLabel: string;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <input
      type="range"
      min={0}
      max={max || 0}
      step="any"
      value={Math.min(value, max || 0)}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={ariaLabel}
      className={`slider ${className}`}
      style={{ '--p': `${pct}%` } as CSSProperties}
    />
  );
}

function RepeatButton({
  repeatMode,
  onToggleRepeat,
  iconClass,
}: {
  repeatMode: RepeatMode;
  onToggleRepeat: () => void;
  iconClass: string;
}) {
  return (
    <button
      onClick={onToggleRepeat}
      aria-label="Repetir"
      title={repeatTitles[repeatMode]}
      className={`relative p-1 ${repeatMode !== 'off' ? 'text-spotify-bright' : 'text-muted hover:text-white'}`}
    >
      <RepeatIcon className={iconClass} />
      {repeatMode === 'one' && (
        <span className="absolute top-0 right-0 text-[9px] font-bold">1</span>
      )}
      {repeatMode !== 'off' && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-spotify-bright" />
      )}
    </button>
  );
}

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
    expanded,
    onExpandedChange,
    onToggle,
    onNext,
    onPrev,
    onSeek,
    onVolume,
    onToggleShuffle,
    onToggleRepeat,
    onSelectTrack,
  } = props;

  return (
    <>
      {/* ===================== MOBILE — mini-player flutuante estilo Spotify ===================== */}
      {track && !expanded && (
        <div
          className="md:hidden fixed inset-x-2 z-40"
          style={{ bottom: `calc(env(safe-area-inset-bottom) + 12px)` }}
        >
          <div className="relative rounded-lg bg-[#282828] shadow-xl overflow-hidden">
            <div className="flex items-center gap-3 p-2">
              <button
                onClick={() => onExpandedChange(true)}
                aria-label="Abrir player completo"
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                <div className="w-11 h-11 rounded overflow-hidden shrink-0 bg-panel-highlight flex items-center justify-center">
                  {coverUrl ? (
                    <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-spotify" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-white">{track.prettyName}</p>
                  <p className="text-xs text-muted truncate">{content.defaultArtist}</p>
                </div>
              </button>
              <button onClick={onPrev} aria-label="Anterior" className="p-2 text-white/90 active:text-white shrink-0">
                <PrevIcon className="w-5 h-5" />
              </button>
              <button
                onClick={onToggle}
                aria-label={playing ? 'Pausar' : 'Tocar'}
                className="p-2 text-white shrink-0"
              >
                {playing ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
              </button>
              <button onClick={onNext} aria-label="Próxima" className="p-2 text-white/90 active:text-white shrink-0">
                <NextIcon className="w-5 h-5" />
              </button>
            </div>
            {/* progresso fininho na base do cartão, como no Spotify */}
            <div className="absolute bottom-0 inset-x-1 h-0.5 rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-300"
                style={{ width: `${duration ? Math.min(100, (progress / duration) * 100) : 0}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ===================== DESKTOP — barra inferior idêntica ao Spotify ===================== */}
      <footer className="hidden md:grid fixed bottom-0 inset-x-0 z-40 bg-black grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-4 h-[72px]" style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + 12px)` }}>
        {/* esquerda: capa + nome + coração */}
        <div className="flex items-center gap-3 min-w-0">
          {track && (
            <>
              <div className="w-14 h-14 rounded bg-panel-highlight flex items-center justify-center overflow-hidden shrink-0">
                {coverUrl ? (
                  <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-spotify" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm truncate text-white hover:underline cursor-pointer">{track.prettyName}</p>
                <p className="text-xs text-muted truncate hover:underline cursor-pointer">{content.defaultArtist}</p>
              </div>
              <HeartIcon className="w-4 h-4 text-spotify-bright ml-2 shrink-0" />
            </>
          )}
        </div>

        {/* centro: controles centralizados + barra de progresso */}
        <div className="flex flex-col items-center gap-2 w-[40vw] max-w-[722px]">
          <div className="flex items-center gap-6">
            <button
              onClick={onToggleShuffle}
              aria-label="Aleatório"
              title="Aleatório"
              className={`relative p-1 ${shuffle ? 'text-spotify-bright' : 'text-muted hover:text-white'}`}
            >
              <ShuffleIcon className="w-4 h-4" />
              {shuffle && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-spotify-bright" />
              )}
            </button>
            <button onClick={onPrev} aria-label="Anterior" className="text-muted hover:text-white">
              <PrevIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onToggle}
              aria-label={playing ? 'Pausar' : 'Tocar'}
              className="w-8 h-8 rounded-full bg-white hover:scale-105 active:scale-100 transition flex items-center justify-center text-black"
            >
              {playing ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 ml-0.5" />}
            </button>
            <button onClick={onNext} aria-label="Próxima" className="text-muted hover:text-white">
              <NextIcon className="w-4 h-4" />
            </button>
            <RepeatButton repeatMode={repeatMode} onToggleRepeat={onToggleRepeat} iconClass="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] text-muted tabular-nums w-10 text-right">{formatTime(progress)}</span>
            <Slider value={progress} max={duration} onChange={onSeek} ariaLabel="Progresso" className="flex-1" />
            <span className="text-[11px] text-muted tabular-nums w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* direita: volume */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onVolume(volume > 0 ? 0 : 0.8)}
            aria-label={volume > 0 ? 'Silenciar' : 'Restaurar volume'}
            className="text-muted hover:text-white p-1"
          >
            {volume > 0 ? <VolumeIcon className="w-4 h-4" /> : <VolumeLowIcon className="w-4 h-4" />}
          </button>
          <Slider value={volume} max={1} onChange={onVolume} ariaLabel="Volume" className="w-[93px]" />
        </div>
      </footer>

      {/* ===================== MOBILE — player expandido em tela cheia estilo Spotify ===================== */}
      {expanded && track && (
        <div className="md:hidden fixed inset-0 z-50 overflow-y-auto animate-slide-up">
          <div className="min-h-full flex flex-col px-6 pt-4 pb-8 bg-gradient-to-b from-emerald-800/70 via-[#121212] to-[#121212]" style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + 24px)` }}>
            {/* topo */}
            <div className="flex items-center justify-between h-12">
              <button onClick={() => onExpandedChange(false)} aria-label="Fechar" className="p-2 -ml-2 text-white">
                <ChevronDownIcon className="w-6 h-6" />
              </button>
              <div className="text-center min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Tocando da playlist</p>
                <p className="text-xs font-semibold text-white truncate max-w-[200px]">{content.playlistName}</p>
              </div>
              <span className="w-10 flex justify-end">
                <HeartIcon className="w-5 h-5 text-spotify-bright" />
              </span>
            </div>

            {/* capa */}
            <div className="flex-1 flex items-center justify-center py-8 min-h-0">
              <div className="w-full max-w-[320px] aspect-square rounded-lg shadow-2xl bg-gradient-to-br from-emerald-700 to-neutral-900 overflow-hidden">
                {coverUrl ? (
                  <img src={coverUrl} alt="capa" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HeartIcon className="w-16 h-16 text-black/60" />
                  </div>
                )}
              </div>
            </div>

            {/* nome da música */}
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[22px] leading-7 font-bold truncate">{track.prettyName}</p>
                <p className="text-sm text-muted truncate">{content.defaultArtist}</p>
              </div>
              <HeartIcon className="w-7 h-7 text-spotify-bright shrink-0" />
            </div>

            {/* progresso */}
            <div className="mt-5">
              <Slider value={progress} max={duration} onChange={onSeek} ariaLabel="Progresso" className="w-full" />
              <div className="flex justify-between text-xs text-muted tabular-nums mt-1.5">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* controles centralizados */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={onToggleShuffle}
                aria-label="Aleatório"
                className={`relative p-2 ${shuffle ? 'text-spotify-bright' : 'text-muted'}`}
              >
                <ShuffleIcon className="w-6 h-6" />
                {shuffle && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-spotify-bright" />
                )}
              </button>
              <button onClick={onPrev} aria-label="Anterior" className="p-2 text-white">
                <PrevIcon className="w-9 h-9" />
              </button>
              <button
                onClick={onToggle}
                aria-label={playing ? 'Pausar' : 'Tocar'}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black active:scale-95 transition"
              >
                {playing ? <PauseIcon className="w-7 h-7" /> : <PlayIcon className="w-7 h-7 ml-1" />}
              </button>
              <button onClick={onNext} aria-label="Próxima" className="p-2 text-white">
                <NextIcon className="w-9 h-9" />
              </button>
              <RepeatButton repeatMode={repeatMode} onToggleRepeat={onToggleRepeat} iconClass="w-6 h-6" />
            </div>

            {/* volume centralizado */}
            <div className="flex items-center justify-center gap-3 mt-6 max-w-[320px] w-full mx-auto">
              <button
                onClick={() => onVolume(Math.max(0, volume - 0.1))}
                aria-label="Diminuir volume"
                className="text-muted p-1"
              >
                <VolumeLowIcon className="w-5 h-5" />
              </button>
              <Slider value={volume} max={1} onChange={onVolume} ariaLabel="Volume" className="flex-1" />
              <button
                onClick={() => onVolume(Math.min(1, volume + 0.1))}
                aria-label="Aumentar volume"
                className="text-muted p-1"
              >
                <VolumeIcon className="w-5 h-5" />
              </button>
            </div>

            {/* fila */}
            <div className="mt-8">
              <p className="text-sm font-bold mb-2">A seguir em {content.playlistName}</p>
              <ul className="-mx-2">
                {tracks.map((t, i) => (
                  <li key={t.name}>
                    <button
                      onClick={() => onSelectTrack(i)}
                      className={`w-full text-left px-2 py-2.5 rounded-md flex items-center gap-3 ${
                        i === currentIndex ? 'bg-white/10' : 'active:bg-white/5'
                      }`}
                    >
                      <div className="w-10 h-10 rounded bg-panel-highlight overflow-hidden shrink-0 flex items-center justify-center">
                        {coverUrl ? (
                          <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <HeartIcon className="w-4 h-4 text-spotify" />
                        )}
                      </div>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-sm truncate ${i === currentIndex ? 'text-spotify-bright' : 'text-white'}`}>
                          {t.prettyName}
                        </span>
                        <span className="block text-xs text-muted truncate">{content.defaultArtist}</span>
                      </span>
                      {i === currentIndex && playing && (
                        <span className="text-[10px] uppercase tracking-wide text-spotify-bright shrink-0">tocando</span>
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
