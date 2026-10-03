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
      <div className="rounded-lg bg-panel p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-spotify to-emerald-800 flex items-center justify-center shadow-lg overflow-hidden">
            {coverUrl ? (
              <img src={coverUrl} alt="capa" className="w-full h-full object-cover" />
            ) : (
              <HeartIcon className="w-6 h-6 text-black" />
            )}
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">{content.coupleNames}</h1>
            <p className="text-xs text-muted">Perfil público · {content.coupleNames}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-lg bg-panel p-4 flex flex-col min-h-0">
        <div className="flex items-center gap-2.5 mb-4">
          <HeartIcon className="w-5 h-5 text-spotify" />
          <h2 className="font-bold tracking-tight">Sua Biblioteca</h2>
          <span className="ml-auto text-[11px] text-muted border border-white/20 rounded-full px-2 py-0.5">
            {tracks.length}
          </span>
        </div>

        <ul className="flex-1 overflow-y-auto -mx-2 px-2 space-y-0.5">
          {tracks.length === 0 && (
            <li className="text-sm text-muted leading-relaxed p-2">{content.emptyHints.music}</li>
          )}
          {tracks.map((track, i) => (
            <li key={track.name}>
              <button
                onClick={() => onSelect(i)}
                className={`w-full text-left px-2 py-2 rounded-md transition flex items-center gap-3 group ${
                  i === currentIndex ? 'bg-panel-highlight text-white' : 'hover:bg-panel-highlight text-muted hover:text-white'
                }`}
              >
                <span className="w-4 text-center text-xs text-muted">
                  {i === currentIndex && playing ? <MusicIcon className="w-3.5 h-3.5 text-spotify inline" /> : i + 1}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm truncate ${i === currentIndex ? 'text-spotify' : ''}`}>
                    {track.prettyName}
                  </span>
                  <span className="block text-xs text-muted truncate">{content.defaultArtist}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="text-[11px] text-muted mt-4 leading-relaxed">
          As músicas tocam direto da nossa nuvem. Feito com amor.
        </p>
      </div>
    </aside>
  );
}
