import { useEffect, useRef, useState } from 'react';
import {
  getCarouselOrder,
  listMusic,
  listPhotos,
  listVideos,
  saveOrders,
  type MediaItem,
  type Slide,
} from '../lib/supabase';

type Row = Slide & { name: string };

export default function Admin() {
  const [carouselRows, setCarouselRows] = useState<Row[] | null>(null);
  const [musicRows, setMusicRows] = useState<MediaItem[] | null>(null);
  const [tab, setTab] = useState<'carousel' | 'music'>('carousel');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      const [photos, videos, music, carouselOrder] = await Promise.all([
        listPhotos(),
        listVideos(),
        listMusic(),
        getCarouselOrder(),
      ]);
      const byKey = new Map<string, Row>();
      const all: Row[] = [];
      for (const v of videos) {
        const r: Row = { key: `video:${v.name}`, type: 'video', url: v.url, prettyName: v.prettyName, name: v.name };
        byKey.set(r.key, r);
        all.push(r);
      }
      for (const p of photos) {
        const r: Row = { key: `photo:${p.name}`, type: 'photo', url: p.url, prettyName: p.prettyName, name: p.name };
        byKey.set(r.key, r);
        all.push(r);
      }

      let ordered: Row[];
      if (carouselOrder && carouselOrder.length > 0) {
        ordered = carouselOrder.map((k) => byKey.get(k)).filter(Boolean) as Row[];
        for (const r of all) if (!carouselOrder.includes(r.key)) ordered.push(r);
      } else {
        const first = all.find((r) => r.type === 'video');
        ordered = first ? [first] : [];
        ordered.push(...all.filter((r) => r !== first && r.type === 'photo'));
        ordered.push(...all.filter((r) => r !== first && r.type === 'video'));
      }
      setCarouselRows(ordered);
      setMusicRows(music);
    })();
  }, []);

  const move = (list: 'carousel' | 'music', i: number, dir: -1 | 1) => {
    const setter = (list === 'carousel' ? setCarouselRows : setMusicRows) as React.Dispatch<React.SetStateAction<Row[] | MediaItem[] | null>>;
    setter((rs) => {
      if (!rs) return rs;
      const j = i + dir;
      if (j < 0 || j >= rs.length) return rs;
      const copy = [...rs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  const handleDrop = (list: 'carousel' | 'music', target: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === target) return;
    const setter = (list === 'carousel' ? setCarouselRows : setMusicRows) as React.Dispatch<React.SetStateAction<Row[] | MediaItem[] | null>>;
    setter((rs) => {
      if (!rs) return rs;
      const copy = [...rs];
      const [item] = copy.splice(from, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  };

  const save = async () => {
    if (!carouselRows || !musicRows) return;
    setSaving(true);
    setMsg(null);
    const ok = await saveOrders(
      carouselRows.map((r) => r.key),
      musicRows.map((m) => m.name),
    );
    setSaving(false);
    setMsg(
      ok
        ? { ok: true, text: 'Ordens salvas! O carrossel e a playlist já estão nessa ordem.' }
        : { ok: false, text: 'Não consegui salvar. Rode o SQL de permissão no Supabase (passo a passo que enviei) e tente de novo.' },
    );
    setTimeout(() => setMsg(null), 8000);
  };

  const rows = tab === 'carousel' ? carouselRows : musicRows;
  const total = (carouselRows?.length ?? 0) + (musicRows?.length ?? 0);

  return (
    <div className="min-h-full bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-40">
        <header className="mb-4">
          <p className="text-xs uppercase tracking-[0.25em] text-spotify mb-1">Painel admin</p>
          <h1 className="text-2xl font-black tracking-tight">Organizar Nossos Momentos</h1>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            Arraste os itens (ou use as setas) para definir a ordem — o primeiro da lista aparece
            primeiro no site. Depois clique em <strong>Salvar ordens</strong>.
          </p>
        </header>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('carousel')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              tab === 'carousel' ? 'bg-spotify text-black' : 'bg-white/5 text-muted hover:text-white'
            }`}
          >
            Fotos e Vídeos ({carouselRows?.length ?? '...'})
          </button>
          <button
            onClick={() => setTab('music')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              tab === 'music' ? 'bg-spotify text-black' : 'bg-white/5 text-muted hover:text-white'
            }`}
          >
            Músicas ({musicRows?.length ?? '...'})
          </button>
        </div>

        {rows === null && (
          <p className="text-muted text-sm py-10 text-center">Carregando mídias...</p>
        )}

        {tab === 'carousel' && carouselRows && (
          <ul className="space-y-1.5">
            {carouselRows.map((r, i) => (
              <li
                key={r.key}
                draggable
                onDragStart={() => {
                  dragIndex.current = i;
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop('carousel', i)}
                className="flex items-center gap-3 rounded-lg bg-panel border border-white/5 p-2"
              >
                <span className="cursor-grab select-none text-muted px-1 text-lg" title="Arraste">
                  ⠿
                </span>
                <span className="text-xs text-muted tabular-nums w-6 text-right">{i + 1}</span>
                <div className="w-12 h-12 rounded bg-black/60 overflow-hidden shrink-0 flex items-center justify-center">
                  {r.type === 'photo' ? (
                    <img src={r.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <span className="text-spotify text-lg">▶</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{r.prettyName}</p>
                  <p className="text-[11px] text-muted uppercase tracking-wider">
                    {r.type === 'photo' ? 'Foto' : 'Vídeo'}
                  </p>
                </div>
                <ArrowButtons onUp={() => move('carousel', i, -1)} onDown={() => move('carousel', i, 1)} />
              </li>
            ))}
          </ul>
        )}

        {tab === 'music' && musicRows && (
          <ul className="space-y-1.5">
            {musicRows.map((m, i) => (
              <li
                key={m.name}
                draggable
                onDragStart={() => {
                  dragIndex.current = i;
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop('music', i)}
                className="flex items-center gap-3 rounded-lg bg-panel border border-white/5 p-2"
              >
                <span className="cursor-grab select-none text-muted px-1 text-lg" title="Arraste">
                  ⠿
                </span>
                <span className="text-xs text-muted tabular-nums w-6 text-right">{i + 1}</span>
                <div className="w-12 h-12 rounded bg-gradient-to-br from-spotify/40 to-black/60 shrink-0 flex items-center justify-center">
                  <span className="text-spotify text-lg">♪</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{m.prettyName}</p>
                  <p className="text-[11px] text-muted uppercase tracking-wider">Música</p>
                </div>
                <ArrowButtons onUp={() => move('music', i, -1)} onDown={() => move('music', i, 1)} />
              </li>
            ))}
          </ul>
        )}

        {msg && (
          <p
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg text-sm shadow-xl ${
              msg.ok ? 'bg-spotify text-black' : 'bg-red-500 text-white'
            }`}
          >
            {msg.text}
          </p>
        )}
      </div>

      {rows && (
        <div className="fixed bottom-0 inset-x-0 bg-black/90 backdrop-blur border-t border-white/10 p-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <p className="text-xs text-muted flex-1">{total} itens no total</p>
            <button
              onClick={save}
              disabled={saving}
              className="px-6 py-3 rounded-full bg-spotify hover:bg-spotify-bright text-black font-bold disabled:opacity-50 active:scale-95 transition"
            >
              {saving ? 'Salvando...' : 'Salvar ordens'}
            </button>
            <a href="#/" className="text-sm text-muted hover:text-white px-2">
              Voltar ao site
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowButtons({ onUp, onDown }: { onUp: () => void; onDown: () => void }) {
  return (
    <div className="flex flex-col gap-0.5">
      <button
        onClick={onUp}
        aria-label="Mover para cima"
        className="w-8 h-6 rounded bg-white/5 hover:bg-white/15 active:scale-95 transition text-xs"
      >
        ▲
      </button>
      <button
        onClick={onDown}
        aria-label="Mover para baixo"
        className="w-8 h-6 rounded bg-white/5 hover:bg-white/15 active:scale-95 transition text-xs"
      >
        ▼
      </button>
    </div>
  );
}
