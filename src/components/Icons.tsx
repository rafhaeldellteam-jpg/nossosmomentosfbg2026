type IconProps = { className?: string };

export const HeartIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const PlayIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.4-6.86a1.05 1.05 0 000-1.76L9.56 4.26A1.04 1.04 0 008 5.14z" />
  </svg>
);

export const PauseIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
);

export const PrevIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
  </svg>
);

export const NextIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" />
  </svg>
);

export const ShuffleIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17 3l4 4-4 4V8.5h-2.1c-.9 0-1.6.4-2.1 1.1L7.9 15.4c-.7 1-1.8 1.6-3 1.6H2v-2h2.9c.6 0 1.1-.3 1.5-.8l4.8-6.8c.9-1.3 2.3-2 3.8-2H17V3zM2 7h2.9c.6 0 1.1.3 1.5.8l.5.7-1.2 1.8-.7-1c-.4-.5-.9-.8-1.5-.8H2V7zm15 10v-2.5l4 4-4 4V20h-2.1c-1.5 0-2.9-.7-3.8-2l-.5-.7 1.2-1.8.7 1c.4.5.9.8 1.5.8H17z" />
  </svg>
);

export const RepeatIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
  </svg>
);

export const VolumeIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8v8a4.5 4.5 0 002.5-4zM14 3.2v2.1a7 7 0 010 13.4v2.1a9 9 0 000-17.6z" />
  </svg>
);

export const VolumeMuteIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3 9v6h4l5 5V4L7 9H3z" />
    <path d="M15.6 8.2l6 6m0-6l-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

export const ChevronLeftIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
