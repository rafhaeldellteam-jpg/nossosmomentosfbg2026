import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Sidebar from './components/Sidebar';
import PlayerBar, { type RepeatMode } from './components/PlayerBar';
import MediaCarousel, { EmptyCard } from './components/MediaCarousel';
import Declaration from './components/Declaration';
import DaysCounter from './components/DaysCounter';
import { HeartIcon } from './components/Icons';
import { PhotoIcon } from './components/SectionIcons';
import {
  getCarouselOrder,
  listMusic,
  listPhotos,
  listVideos,
  type MediaItem,
  type Slide,
} from './lib/supabase';
import { content } from './config/content';

const startDate = new Date(
  content.startDate.year,
  content.startDate.month - 1,
  content.startDate.day,
  content.startDate.hour ?? 0,
  content.startDate.minute ?? 0,
);

export default function App() {
  const [tracks, setTracks] = useState<MediaItem[]>([]);
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [order, setOrder] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([listMusic(), listPhotos(), listVideos(), getCarouselOrder()]).then(
      ([m, p, v, o]) => {
        if (!alive) return;
        setTracks(m);
        setPhotos(p);
        setVideos(v);
        setOrder(o);
        setLoading(false);
      },
    );
    return () => {
      alive = false;
    };
  }, []);

  const currentTrack = currentIndex >= 0 ? tracks[currentIndex] ?? null : null;
  // capa do álbum: IMG_1847 (ou a primeira foto, como fallback)
  const coverUrl = (photos.find((p) => /IMG_1847/i.test(p.name)) ?? photos[0])?.url ?? null;

  // ordem do carrossel: salva no painel admin ou padrão (abertura, fotos, vídeos)
  const slides: Slide[] = useMemo(() => {
    const byKey = new Map<string, Slide>();
    for (const v of videos)
      byKey.set(`video:${v.name}`, {
        key: `video:${v.name}`,
        type: 'video',
        url: v.url,
        prettyName: v.prettyName,
      });
    for (const p of photos)
      byKey.set(`photo:${p.name}`, {
        key: `photo:${p.name}`,
        type: 'photo',
        url: p.url,
        prettyName: p.prettyName,
      });
    if (order && order.length > 0) {
      const arr = order.map((k) => byKey.get(k)).filter(Boolean) as Slide[];
      for (const [k, s] of byKey) if (!order.includes(k)) arr.push(s);
      return arr;
    }
    const firstVideo = videos[0]
      ? byKey.get(`video:${videos[0].name}`) ?? null
      : null;
    const arr: Slide[] = [];
    if (firstVideo) arr.push(firstVideo);
    for (const p of photos) arr.push(byKey.get(`photo:${p.name}`) ?? {
      key: `photo:${p.name}`,
      type: 'photo',
      url: p.url,
      prettyName: p.prettyName,
    });
    for (const v of videos.slice(firstVideo ? 1 : 0))
      arr.push(byKey.get(`video:${v.name}`) ?? {
        key: `video:${v.name}`,
        type: 'video',
        url: v.url,
        prettyName: v.prettyName,
      });
    return arr;
  }, [photos, videos, order]);

  const pickNextIndex = useCallback(
    (dir: 1 | -1) => {
      if (tracks.length === 0) return -1;
      if (shuffle && tracks.length > 1) {
        let r = currentIndex;
        while (r === currentIndex) r = Math.floor(Math.random() * tracks.length);
        return r;
      }
      return (currentIndex + dir + tracks.length) % tracks.length;
    },
    [tracks.length, shuffle, currentIndex],
  );

  const playIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= tracks.length) return;
      setCurrentIndex(index);
      setPlaying(true);
    },
    [tracks.length],
  );

  const togglePlay = useCallback(() => {
    if (currentIndex < 0 && tracks.length > 0) {
      playIndex(0);
      return;
    }
    pausedByUserRef.current = playing; // se estava tocando, o usuário está pausando de propósito
    setPlaying((p) => !p);
  }, [currentIndex, tracks.length, playIndex, playing]);

  const next = useCallback(() => {
    const i = pickNextIndex(1);
    if (i >= 0) playIndex(i);
  }, [pickNextIndex, playIndex]);

  const prev = useCallback(() => {
    if (progress > 5 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }
    const i = pickNextIndex(-1);
    if (i >= 0) playIndex(i);
  }, [pickNextIndex, playIndex, progress]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (audio.src !== currentTrack.url) {
      audio.src = currentTrack.url;
      audio.load();
    }
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentTrack, playing]);

  // música começa junto com a apresentação das mídias
  const carouselSectionRef = useRef<HTMLElement | null>(null);
  const autoStartRef = useRef(false);
  const pausedByUserRef = useRef(false);

  useEffect(() => {
    if (loading || tracks.length === 0 || slides.length === 0) return;
    const tryStart = () => {
      if (autoStartRef.current) return;
      autoStartRef.current = true;
      setCurrentIndex((i) => (i < 0 ? 0 : i));
      setPlaying(true);
    };
    const kick = () => {
      // se o navegador bloqueou o autoplay com som, começa no primeiro toque
      if (autoStartRef.current && !pausedByUserRef.current && currentIndex >= 0 && !playing) {
        setPlaying(true);
      }
    };
    window.addEventListener('pointerdown', kick);
    const el = carouselSectionRef.current;
    let obs: IntersectionObserver | null = null;
    if (el) {
      obs = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            tryStart();
            obs?.disconnect();
          }
        },
        { threshold: 0.25 },
      );
      obs.observe(el);
    } else {
      tryStart();
    }
    return () => {
      window.removeEventListener('pointerdown', kick);
      obs?.disconnect();
    };
  }, [loading, tracks.length, slides.length, currentIndex, playing]);

  const seek = (seconds: number) => {
    if (audioRef.current) audioRef.current.currentTime = seconds;
    setProgress(seconds);
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const onEnded = () => {
    if (repeatMode === 'one') {
      seek(0);
      audioRef.current?.play().catch(() => {});
      return;
    }
    if (repeatMode === 'all') {
      next();
      return;
    }
    // sem repetição: para ao terminar a última faixa
    if (!shuffle && currentIndex >= tracks.length - 1) {
      setPlaying(false);
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }
    next();
  };

  return (
    <div className="h-full flex flex-col bg-black">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={onEnded}
        preload="metadata"
      />

      <div className="flex-1 flex min-h-0 p-2 gap-2">
        <Sidebar
          tracks={tracks}
          currentIndex={currentIndex}
          playing={playing}
          coverUrl={coverUrl}
          onSelect={playIndex}
        />

        <main className="flex-1 overflow-y-auto rounded-lg bg-panel pb-40 md:pb-28">
          {/* topo estilo página de artista do Spotify */}
          <header className="bg-gradient-to-b from-emerald-900/60 via-panel-highlight to-panel px-4 md:px-8 pt-6 md:pt-10 pb-8">
            <div className="md:hidden flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-spotify flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-black" />
              </div>
              <h1 className="font-bold text-lg">{content.coupleNames}</h1>
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded shadow-2xl bg-gradient-to-br from-emerald-700 to-neutral-900 flex items-center justify-center overflow-hidden shrink-0">
                {coverUrl ? (
                  <img src={coverUrl} alt="capa" className="w-full h-full object-cover" />
                ) : (
                  <HeartIcon className="w-14 h-14 text-black/60" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-2">Perfil · Meu grande amor</p>
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none mb-4 break-words">
                  {content.coupleNames}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                  <DaysCounter start={startDate} />
                  <span>{tracks.length} {tracks.length === 1 ? 'música' : 'músicas'}</span>
                  <span className="hidden sm:inline">·</span>
                  <span className="hidden sm:inline">{photos.length + videos.length} momentos</span>
                </div>
                <p className="text-muted mt-3 max-w-xl leading-relaxed">{content.tagline}</p>
              </div>
            </div>
          </header>

          <div className="px-4 md:px-8 mt-8 space-y-10">
            {/* carrossel automático de fotos + vídeos */}
            <section ref={carouselSectionRef}>
              <SectionTitle icon={<PhotoIcon className="w-5 h-5 text-spotify" />} title="Nossos Momentos" />
              {loading ? (
                <LoadingCard />
              ) : slides.length === 0 ? (
                <EmptyCard text={`${content.emptyHints.photos} ${content.emptyHints.videos}`} />
              ) : (
                <MediaCarousel slides={slides} />
              )}
            </section>

            <Declaration />

            <footer className="text-center text-xs text-muted/60 pb-6">
              Feito com <span className="text-spotify-bright">amor</span> — cada detalhe aqui é nosso.
              <a href="#/admin" className="ml-2 text-muted/40 hover:text-muted underline">
                organizar mídias
              </a>
            </footer>
          </div>
        </main>
      </div>

      <PlayerBar
        tracks={tracks}
        currentIndex={currentIndex}
        track={currentTrack}
        playing={playing}
        shuffle={shuffle}
        repeatMode={repeatMode}
        progress={progress}
        duration={duration}
        volume={volume}
        coverUrl={coverUrl}
        onToggle={togglePlay}
        onNext={next}
        onPrev={prev}
        onSeek={seek}
        onVolume={changeVolume}
        onToggleShuffle={() => setShuffle((s) => !s)}
        onToggleRepeat={() =>
          setRepeatMode((m) => (m === 'off' ? 'all' : m === 'all' ? 'one' : 'off'))
        }
        onSelectTrack={playIndex}
      />
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      {icon}
      <h3 className="text-xl md:text-2xl font-bold tracking-tight hover:underline cursor-pointer">{title}</h3>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-lg bg-panel-highlight p-10 text-center text-sm text-muted">
      Carregando nossos momentos...
    </div>
  );
}
