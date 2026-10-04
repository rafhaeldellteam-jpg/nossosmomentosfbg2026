import { useCallback, useEffect, useRef, useState } from 'react';
import type { Slide } from '../lib/supabase';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, PauseIcon, PlayIcon, VolumeIcon, VolumeMuteIcon } from './Icons';
import { content } from '../config/content';

const PHOTO_SLIDE_MS = 6000;

export function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/15 bg-panel p-10 text-center">
      <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">{text}</p>
    </div>
  );
}

export default function MediaCarousel({ slides }: { slides: Slide[] }) {

  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [videoPaused, setVideoPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  // foto: avança sozinho após alguns segundos
  useEffect(() => {
    const slide = slides[index];
    if (!slide || slide.type !== 'photo' || slides.length < 2) return;
    const t = setTimeout(next, PHOTO_SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, slides, next]);

  // vídeo: toca sozinho (mudo) e avança quando termina
  useEffect(() => {
    const slide = slides[index];
    const video = videoRef.current;
    if (!slide || slide.type !== 'video' || !video) return;
    setVideoPaused(false);
    video.volume = volume;
    video.muted = muted;
    video.currentTime = 0;
    // tenta com som; se o navegador bloquear, cai para mudo (autoplay permitido)
    video.muted = false;
    video.play().then(() => {
      setMuted(false);
    }).catch(() => {
      video.muted = true;
      setMuted(true);
      video.play().catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, slides]);

  // aplica volume/mudo ao vídeo ativo quando mudam
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
      video.muted = muted;
    }
  }, [muted, volume]);

  // pausa/retoma o vídeo ativo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (videoPaused) video.pause();
    else video.play().catch(() => {});
  }, [videoPaused]);

  if (slides.length === 0) {
    return <EmptyCard text={`${content.emptyHints.photos} ${content.emptyHints.videos}`} />;
  }

  const slide = slides[index];

  return (
    <div className="relative group">
      <div
        className="relative rounded-lg overflow-hidden bg-panel shadow-2xl touch-pan-y"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 50) {
            if (dx < 0) next();
            else prev();
          }
          touchStartX.current = null;
        }}
      >
        <div className="relative h-[55vh] md:h-[70vh] w-full bg-black flex items-center justify-center">
          {slides.map((s, i) =>
            s.type === 'photo' ? (
              <img
                key={s.key}
                src={s.url}
                alt={s.prettyName}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
                  i === index ? 'opacity-100' : 'opacity-0'
                }`}
                draggable={false}
              />
            ) : (
              <video
                key={s.key}
                ref={i === index ? videoRef : undefined}
                src={s.url}
                autoPlay={i === index}
                playsInline
                preload={i === index ? 'auto' : 'metadata'}
                onEnded={next}
                onClick={() => setVideoPaused((p) => !p)}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
                  i === index ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'
                }`}
                draggable={false}
              />
            ),
          )}
        </div>

        {/* controles do vídeo: play/pause, mudo e volume */}
        {slide.type === 'video' && (
          <div className="absolute bottom-14 md:bottom-3 right-2 md:right-3 flex items-center gap-1 md:gap-2 rounded-full bg-black/70 backdrop-blur px-1.5 md:px-2.5 py-1 md:py-1.5">
            <button
              onClick={() => setVideoPaused((p) => !p)}
              aria-label={videoPaused ? 'Tocar vídeo' : 'Pausar vídeo'}
              className="w-9 h-9 flex items-center justify-center text-white hover:text-spotify-bright active:scale-90 transition"
            >
              {videoPaused ? <PlayIcon className="w-5 h-5" /> : <PauseIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Ativar som' : 'Silenciar'}
              className="w-9 h-9 flex items-center justify-center text-white hover:text-spotify-bright active:scale-90 transition"
            >
              {muted ? <VolumeMuteIcon className="w-5 h-5" /> : <VolumeIcon className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                if (v > 0 && muted) setMuted(false);
              }}
              aria-label="Volume do vídeo"
              className="w-20 md:w-24 cursor-pointer"
            />
          </div>
        )}

        {/* nome do momento */}
        <div className="absolute bottom-2 md:bottom-12 left-4 right-4 pointer-events-none">
          <p className="inline-block px-3 py-1.5 rounded bg-black/60 backdrop-blur text-sm text-white">
            {slide.prettyName}
          </p>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 opacity-70 md:opacity-0 md:group-hover:opacity-100 transition flex items-center justify-center text-white"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              aria-label="Próximo"
              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 opacity-70 md:opacity-0 md:group-hover:opacity-100 transition flex items-center justify-center text-white"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 md:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-1.5 px-3 py-1">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir para ${i + 1}`}
                  className={`rounded-full transition-all ${
                    i === index
                      ? 'h-2.5 w-7 bg-spotify-bright'
                      : 'h-2.5 w-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[11px] uppercase tracking-wider text-white/80">
                {slide.type === 'photo' ? 'Foto' : 'Vídeo'}
              </span>
              <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur flex items-center justify-center">
                <HeartIcon className="w-3.5 h-3.5 text-spotify-bright" />
              </div>
            </div>
          </>
        )}
      </div>
      <p className="mt-2 text-xs text-muted text-center">
        Tudo passa sozinho — arraste para navegar, toque no vídeo para pausar e ajuste o volume quando quiser
      </p>
    </div>
  );
}
