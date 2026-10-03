type Props = { className?: string };

export const MusicIcon = ({ className = 'w-5 h-5' }: Props) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
  </svg>
);

export const PhotoIcon = ({ className = 'w-5 h-5' }: Props) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z" />
  </svg>
);

export const VideoIcon = ({ className = 'w-5 h-5' }: Props) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M4 6h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zm16 3.5l3-2v9l-3-2v-5z" />
  </svg>
);
