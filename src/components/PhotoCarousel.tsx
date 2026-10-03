import { useCallback, useEffect, useState } from 'react';
import type { MediaItem } from '../lib/supabase';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from './Icons';
import { content } from '../config/content';

export default function PhotoCarousel({ photos }: { photos: MediaItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (paused || photos.length < 2) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, photos.length, next]);

  useEffect(() => {
    setIndex(0);
  }, [photos.length]);

  if (photos.length === 0) {
    return <EmptyCard text={content.emptyHints.photos} />;
  }

  return (
    <div
      className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/30 shadow-2xl shadow-rose-950/40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="aspect-[16/9] md:aspect-[21/9] w-full">
        {photos.map((photo, i) => (
          <img
            key={photo.name}
            src={photo.url}
            alt={photo.prettyName}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
            draggable={false}
          />
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur flex items-center justify-center text-white transition"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur flex items-center justify-center text-white transition"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {photos.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setIndex(i)}
                aria-label={`Ir para foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-rose-400' : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
            <HeartIcon className="w-3.5 h-3.5 text-rose-400" />
          </div>
        </>
      )}
    </div>
  );
}

export function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center">
      <p className="text-sm text-stone-400 max-w-md mx-auto leading-relaxed">{text}</p>
    </div>
  );
}
