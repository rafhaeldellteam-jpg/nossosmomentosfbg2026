import { useEffect, useState } from 'react';
import { content } from '../config/content';
import { HeartIcon } from './Icons';

const pad = (n: number) => n.toString().padStart(2, '0');

export default function DaysCounter({ start }: { start: Date }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, now - start.getTime());
  const days = Math.floor(diff / 86_400_000);
  const h = Math.floor(diff / 3_600_000) % 24;
  const m = Math.floor(diff / 60_000) % 60;
  const s = Math.floor(diff / 1_000) % 60;

  const title = `Desde ${pad(start.getDate())}/${pad(start.getMonth() + 1)}/${start.getFullYear()} às ${pad(start.getHours())}:${pad(start.getMinutes())}`;

  return (
    <div className="flex flex-wrap items-center gap-2.5" title={title}>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold">
        <HeartIcon className="w-3.5 h-3.5 text-spotify-bright animate-heartbeat" />
        <span
          key={days}
          className="inline-block animate-count-in"
        >
          {days.toLocaleString('pt-BR')}
        </span>
        <span>
          {days === 1 ? 'dia' : 'dias'} juntos
        </span>
      </span>
      <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1.5 text-sm tabular-nums text-white/90">
        {pad(h)}
        <span className="animate-pulse">:</span>
        {pad(m)}
        <span className="animate-pulse">:</span>
        <span key={s} className="inline-block animate-count-in">
          {pad(s)}
        </span>
      </span>
    </div>
  );
}
