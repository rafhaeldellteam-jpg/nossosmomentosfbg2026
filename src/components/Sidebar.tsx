import { content } from '../config/content';
import type { MediaItem } from '../lib/supabase';
import { HeartIcon } from './Icons';
import { MusicIcon } from './SectionIcons';

type Props = {
  tracks: MediaItem[];
  currentIndex: number;
  playing: boolean;
  coverUrl: string | null;
  onSelect: (index: number) => void;
};

export default function Sidebar({ tracks, currentIndex, playing, coverUrl, onSelect }: Props) {
  return (
    <aside className="hidden md:flex w-72 shrink-0 flex-col gap-2 p-2 h-full">
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/30 overflow-hidden">
            {coverUrl ? (
              <img src={coverUrl} alt="capa" className="w-full h-full object-cover" />
            ) : (
              <HeartIcon className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">{content.coupleNames}</h1>
            <p className="text-xs text-stone-400">Um lugar só nosso</p>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-3">
          <MusicIcon className="w-5 h-5 text-rose-400" />
          <h2 className="font-semibold">{content.playlistName}</h2>
          <span className="ml-auto text-xs text-stone-500">{tracks.length} músicas</span>
        </div>

        <ul className="flex-1 overflow-y-auto space-y-1 pr-1">
          {tracks.length === 0 && (
            <li className="text-sm text-stone-400 leading-relaxed">{content.emptyHints.music}</li>
          )}
          {tracks.map((track, i) => (
            <li key={track.name}>
              <button
                onClick={() => onSelect(i)}
                className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-3 group ${
                  i === currentIndex ? 'bg-rose-500/15 text-rose-300' : 'hover:bg-white/5 text-stone-300'
                }`}
              >
                <span className="w-5 text-center text-xs text-stone-500 group-hover:text-stone-300">
                  {i === currentIndex && playing ? <HeartIcon className="w-3.5 h-3.5 inline animate-pulse" /> : i + 1}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm truncate">{track.prettyName}</span>
                  <span className="block text-xs text-stone-500 truncate">{content.defaultArtist}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="text-[11px] text-stone-500 mt-3 leading-relaxed">
          Feito com amor para você. As músicas tocam direto da nossa nuvem.
        </p>
      </div>
    </aside>
  );
}
