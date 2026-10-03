import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MediaItem } from '../lib/supabase';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from './Icons';
import { content } from '../config/content';

type Slide = {
  key: string;
  type: 'photo' | 'video';
  url: string;
  prettyName: string;
};

const PHOTO_SLIDE_MS = 6000;

export function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/15 bg-panel p-10 text-center">
      <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">{text}</p>
    </div>
  );
}

export default function MediaCarousel({ photos, videos }: { photos: MediaItem[]; videos: MediaItem[] }) {
  const slides: Slide[] = useMemo(
    () => [
      ...photos.map((p) => ({ key: `p-${p.name}`, type: 'photo' as const, url: p.url, prettyName: p.prettyName })),
      ...videos.map((v) => ({ key: `v-${v.name}`, type: 'video' as const, url: v.url, prettyName: v.prettyName })),
    ],
    [photos, videos],
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  // foto: avança sozinho após alguns segundos
  useEffect(() => {
    const slide = slides[index];
    if (!slide || slide.type !== 'photo' || paused || slides.length < 2) return;
    const t = setTimeout(next, PHOTO_SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, paused, slides, next]);

  // vídeo: toca (sem som) e avança quando termina
  useEffect(() => {
    const slide = slides[index];
    const video = videoRef.current;
    if (!slide || slide.type !== 'video' || !video) return;
    if (!paused) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [index, paused, slides]);

  useEffect(() => {
    const video = videoRef.current;
    if (paused && video) video.pause();
  }, [paused]);

  if (slides.length === 0) {
    return <EmptyCard text={`${content.emptyHints.photos} ${content.emptyHints.videos}`} />;
  }

  const slide = slides[index];

  return (
    <div className="relative group">
      <div
        className="relative rounded-lg overflow-hidden bg-panel shadow-2xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="aspect-[16/9] md:aspect-[21/9] w-full">
          {slides.map((s, i) =>
            s.type === 'photo' ? (
              <img
                key={s.key}
                src={s.url}
                alt={s.prettyName}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  i === index ? 'opacity-100' : 'opacity-0'
                }`}
                draggable={false}
              />
            ) : (
              <video
                key={s.key}
                ref={i === index ? videoRef : undefined}
                src={s.url}
                muted
                playsInline
                preload={i === index ? 'auto' : 'metadata'}
                onEnded={next}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                draggable={false}
              />
            ),
          )}
        </div>

        {/* nome do momento */}
        <div className="absolute bottom-12 left-4 right-4 pointer-events-none">
          <p className="inline-block px-3 py-1.5 rounded bg-black/60 backdrop-blur text-sm text-white">
            {slide.prettyName}
          </p>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Próximo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir para ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-6 bg-spotify-bright' : 'w-1.5 bg-white/50 hover:bg-white/80'
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
        {paused ? 'Pausado — tire o mouse para continuar' : 'Passando sozinho — passe o mouse para pausar'}
      </p>
    </div>
  );
}
