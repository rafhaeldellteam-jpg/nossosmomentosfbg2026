import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import MediaCarousel, { EmptyCard } from './components/MediaCarousel';
import Declaration from './components/Declaration';
import DaysCounter from './components/DaysCounter';
import { HeartIcon } from './components/Icons';
import { MusicIcon, PhotoIcon } from './components/SectionIcons';
import { listMusic, listPhotos, listVideos, type MediaItem } from './lib/supabase';
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
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([listMusic(), listPhotos(), listVideos()]).then(([m, p, v]) => {
      if (!alive) return;
      setTracks(m);
      setPhotos(p);
      setVideos(v);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const currentTrack = currentIndex >= 0 ? tracks[currentIndex] ?? null : null;
  const coverUrl = photos.length > 0 ? photos[0].url : null;

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
    setPlaying((p) => !p);
  }, [currentIndex, tracks.length, playIndex]);

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

  const seek = (seconds: number) => {
    if (audioRef.current) audioRef.current.currentTime = seconds;
    setProgress(seconds);
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const onEnded = () => {
    if (repeat) {
      seek(0);
      audioRef.current?.play().catch(() => {});
    } else {
      next();
    }
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
            <Declaration />

            {/* player mobile: lista de músicas */}
            <section className="md:hidden">
              <SectionTitle icon={<MusicIcon className="w-5 h-5 text-spotify" />} title={content.playlistName} />
              {loading ? (
                <LoadingCard />
              ) : tracks.length === 0 ? (
                <EmptyCard text={content.emptyHints.music} />
              ) : (
                <ul className="space-y-1">
                  {tracks.map((track, i) => (
                    <li key={track.name}>
                      <button
                        onClick={() => playIndex(i)}
                        className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 ${
                          i === currentIndex ? 'bg-panel-highlight text-spotify' : 'bg-white/[0.04] text-white'
                        }`}
                      >
                        <span className="text-xs text-muted">{i + 1}</span>
                        <span className="flex-1 min-w-0 truncate text-sm">{track.prettyName}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* carrossel automático de fotos + vídeos */}
            <section>
              <SectionTitle icon={<PhotoIcon className="w-5 h-5 text-spotify" />} title="Nossos Momentos" />
              {loading ? (
                <LoadingCard />
              ) : (
                <MediaCarousel photos={photos} videos={videos} />
              )}
            </section>

            <footer className="text-center text-xs text-muted/60 pb-6">
              Feito com <span className="text-spotify-bright">amor</span> — cada detalhe aqui é nosso.
            </footer>
          </div>
        </main>
      </div>

      <PlayerBar
        track={currentTrack}
        playing={playing}
        shuffle={shuffle}
        repeat={repeat}
        progress={progress}
        duration={duration}
        volume={volume}
        onToggle={togglePlay}
        onNext={next}
        onPrev={prev}
        onSeek={seek}
        onVolume={changeVolume}
        onToggleShuffle={() => setShuffle((s) => !s)}
        onToggleRepeat={() => setRepeat((r) => !r)}
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
