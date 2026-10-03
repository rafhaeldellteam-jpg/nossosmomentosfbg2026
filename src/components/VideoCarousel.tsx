import { useEffect, useState } from 'react';
import type { MediaItem } from '../lib/supabase';
import { EmptyCard } from './PhotoCarousel';
import { content } from '../config/content';

export default function VideoCarousel({ videos }: { videos: MediaItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    setActive(null);
  }, [videos.length]);

  if (videos.length === 0) {
    return <EmptyCard text={content.emptyHints.videos} />;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth">
      {videos.map((video) => (
        <div
          key={video.name}
          className="snap-start shrink-0 w-[85%] sm:w-[420px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-xl shadow-rose-950/30"
        >
          <video
            src={video.url}
            controls
            preload="metadata"
            playsInline
            className="w-full aspect-video object-cover bg-black"
            onPause={() => setActive(null)}
            onPlay={() => setActive(video.name)}
          />
          <div className="px-4 py-2.5 text-sm text-stone-300 truncate">{video.prettyName}</div>
        </div>
      ))}
      {active === null && videos.length > 0 && null}
    </div>
  );
}
