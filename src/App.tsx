import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import PhotoCarousel from './components/PhotoCarousel';
import VideoCarousel from './components/VideoCarousel';
import Declaration from './components/Declaration';
import { EmptyCard } from './components/PhotoCarousel';
import { HeartIcon } from './components/Icons';
import { MusicIcon, PhotoIcon, VideoIcon } from './components/SectionIcons';
import { listMusic, listPhotos, listVideos, type MediaItem } from './lib/supabase';
import { content } from './config/content';

function daysTogether(): number {
  const { year, month, day } = content.startDate;
  const start = new Date(year, month - 1, day);
  const diff = Date.now() - start.getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
}

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
  const days = useMemo(daysTogether, []);

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

  // sincroniza o elemento <audio> com o estado
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
    <div className="h-full flex flex-col">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={onEnded}
        preload="metadata"
      />

      <div className="flex-1 flex min-h-0">
        <Sidebar
          tracks={tracks}
          currentIndex={currentIndex}
          playing={playing}
          coverUrl={coverUrl}
          onSelect={playIndex}
        />

        <main className="flex-1 overflow-y-auto pb-40 md:pb-28">
          {/* topo hero */}
          <header className="px-4 md:px-8 pt-6 md:pt-8">
            <div className="flex md:hidden items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-bold text-lg">{content.coupleNames}</h1>
            </div>

            <div className="rounded-3xl bg-gradient-to-r from-rose-500/15 via-rose-500/5 to-transparent border border-white/10 p-6 md:p-10">
              <p className="text-xs uppercase tracking-[0.3em] text-rose-400/80 mb-3">Para o meu grande amor</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
                {content.coupleNames}
              </h2>
              <p className="text-stone-400 max-w-xl leading-relaxed">{content.tagline}</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-sm text-stone-300">
                <HeartIcon className="w-4 h-4 text-rose-400" />
                <span>
                  {days.toLocaleString('pt-BR')} {days === 1 ? 'dia' : 'dias'} juntos
                </span>
              </div>
            </div>
          </header>

          <div className="px-4 md:px-8 mt-8 space-y-10">
            <Declaration />

            {/* músicas mobile */}
            <section className="md:hidden">
              <SectionTitle icon={<MusicIcon className="w-5 h-5 text-rose-400" />} title={content.playlistName} />
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
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 ${
                          i === currentIndex ? 'bg-rose-500/15 text-rose-300' : 'bg-white/[0.04] text-stone-300'
                        }`}
                      >
                        <span className="text-xs text-stone-500">{i + 1}</span>
                        <span className="flex-1 min-w-0 truncate text-sm">{track.prettyName}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* fotos */}
            <section>
              <SectionTitle icon={<PhotoIcon className="w-5 h-5 text-rose-400" />} title="Nossos Momentos" />
              {loading ? <LoadingCard /> : <PhotoCarousel photos={photos} />}
            </section>

            {/* vídeos */}
            <section>
              <SectionTitle icon={<VideoIcon className="w-5 h-5 text-rose-400" />} title="Nossos Vídeos" />
              {loading ? <LoadingCard /> : <VideoCarousel videos={videos} />}
            </section>

            <footer className="text-center text-xs text-stone-600 pb-6">
              Feito com <span className="text-rose-400">amor</span> — cada detalhe aqui é nosso.
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
      <h3 className="text-lg font-bold tracking-tight">{title}</h3>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-stone-500">
      Carregando nossos momentos...
    </div>
  );
}
