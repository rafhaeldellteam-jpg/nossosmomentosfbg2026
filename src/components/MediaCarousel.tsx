import { useCallback, useEffect, useRef, useState } from 'react';
import type { Slide } from '../lib/supabase';
import { HeartIcon } from './Icons';
import { content } from '../config/content';

const PHOTO_SLIDE_MS = 3000;

export function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/15 bg-panel p-10 text-center">
      <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">{text}</p>
    </div>
  );
}

export default function MediaCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  // vídeo: sempre mudo, toca e avança quando termina
  useEffect(() => {
    const slide = slides[index];
    const video = videoRef.current;
    if (!slide || slide.type !== 'video' || !video) return;
    video.muted = true;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [index, slides]);

  if (slides.length === 0) {
    return <EmptyCard text={`${content.emptyHints.photos} ${content.emptyHints.videos}`} />;
  }

  const slide = slides[index];

  return (
    <div className="relative group">
      <div
        className="relative rounded-lg overflow-hidden bg-panel shadow-2xl touch-pan-y select-none"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
          touchStartY.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          const dy = Math.abs(e.changedTouches[0].clientY - (touchStartY.current ?? 0));
          if (dy < 60 && Math.abs(dx) > 50) {
            if (dx < 0) next();
            else prev();
          }
          touchStartX.current = null;
          touchStartY.current = null;
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
                muted
                playsInline
                preload={i === index ? 'auto' : 'metadata'}
                onEnded={next}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
                  i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                draggable={false}
              />
            ),
          )}
        </div>

        {/* zonas de toque estilo Stories: esquerda volta, direita avança */}
        <button
          onClick={prev}
          aria-label="Foto anterior"
          className="absolute inset-y-0 left-0 w-[30%] z-10 focus:outline-none"
        />
        <button
          onClick={next}
          aria-label="Próxima foto"
          className="absolute inset-y-0 right-0 w-[70%] z-10 focus:outline-none"
        />

        {/* nome do momento */}
        <div className="absolute bottom-2 md:bottom-12 left-4 right-4 pointer-events-none z-20">
          <p className="inline-block px-3 py-1.5 rounded bg-black/60 backdrop-blur text-sm text-white">
            {slide.prettyName}
          </p>
        </div>

        {slides.length > 1 && (
          <>
            {/* barra de progresso estilo Stories */}
            <div className="absolute top-2 inset-x-3 flex gap-1 z-20">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir para ${i + 1}`}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    i < index
                      ? 'bg-white/60'
                      : i === index
                        ? 'bg-white'
                        : 'bg-white/25'
                  }`}
                />
              ))}
            </div>

            <div className="absolute top-5 right-3 flex items-center gap-2 z-20">
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
        Toque no lado direito para avançar e no esquerdo para voltar — igual Stories
      </p>
    </div>
  );
}
