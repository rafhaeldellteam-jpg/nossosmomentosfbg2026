import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://fkcdmboxpwandvwrebzl.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrY2RtYm94cHdhbmR2d3JlYnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNDIxNzAsImV4cCI6MjEwNjYxODE3MH0.JjM_9lTxmQ14tuRfiEUr0WviX_vs5RT5oQNNXZd7onA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AUDIO_EXT = /\.(mp3|m4a|aac|ogg|opus|wav|flac|webm)$/i;
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|bmp)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)$/i;

export type MediaItem = {
  name: string;
  prettyName: string;
  url: string;
};

function pretty(name: string): string {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function listBucket(bucket: string, test: (n: string) => boolean): Promise<MediaItem[]> {
  const { data, error } = await supabase.storage.from(bucket).list('', {
    limit: 200,
    sortBy: { column: 'name', order: 'asc' },
  });
  const listNames = !error && data ? data.map((f) => f.name) : [];
  const titles = new Map<string, string>();

  // o manifest (quando existe) manda: ordem e títulos bonitos
  // itens podem ser "nome.mp3" ou { name, title }
  let names: string[] | null = null;
  try {
    const manifestUrl =
      supabase.storage.from(bucket).getPublicUrl('manifest.json').data.publicUrl +
      `?t=${Math.floor(Date.now() / 60_000)}`;
    const res = await fetch(manifestUrl, { cache: 'no-store' });
    if (res.ok) {
      const manifest = await res.json();
      if (Array.isArray(manifest.files) && manifest.files.length > 0) {
        names = [];
        for (const item of manifest.files) {
          if (typeof item === 'string') names.push(item);
          else if (item && typeof item.name === 'string') {
            names.push(item.name);
            if (typeof item.title === 'string') titles.set(item.name, item.title);
          }
        }
        // arquivos novos que ainda não estão no manifest vão para o fim
        for (const n of listNames) if (!names.includes(n)) names.push(n);
      }
    }
  } catch {
    /* sem manifest — usa a listagem do storage */
  }

  return (names ?? listNames)
    .filter((n) => test(n))
    .map((n) => ({
      name: n,
      prettyName: titles.get(n) ?? pretty(n),
      url: supabase.storage.from(bucket).getPublicUrl(n).data.publicUrl,
    }));
}

export const listMusic = async () => {
  const tracks = await listBucket('music', (n) => AUDIO_EXT.test(n));
  const order = await getMusicOrder();
  if (!order || order.length === 0) return tracks;
  const idx = new Map(order.map((n, i) => [n, i] as const));
  return [...tracks].sort((a, b) => {
    const ia = idx.get(a.name) ?? Number.MAX_SAFE_INTEGER;
    const ib = idx.get(b.name) ?? Number.MAX_SAFE_INTEGER;
    return ia - ib;
  });
};
export const listPhotos = () => listBucket('photos', (n) => IMAGE_EXT.test(n));
export const listVideos = () => listBucket('videos', (n) => VIDEO_EXT.test(n));

// ---------- ordens salvas (painel admin) ----------

export type Slide = {
  key: string; // "photo:NOME" | "video:NOME"
  type: 'photo' | 'video';
  url: string;
  prettyName: string;
};

type SavedData = { carousel?: string[]; music?: string[] };

async function readSavedData(): Promise<SavedData | null> {
  try {
    const { data, error } = await supabase
      .from('media_order')
      .select('data')
      .eq('id', 1)
      .maybeSingle();
    if (error || !data) return null;
    const d = (data as { data?: SavedData }).data;
    return d && typeof d === 'object' ? d : null;
  } catch {
    return null;
  }
}

export async function getCarouselOrder(): Promise<string[] | null> {
  const d = await readSavedData();
  const arr = d?.carousel;
  return Array.isArray(arr) && arr.length > 0 ? arr : null;
}

export async function getMusicOrder(): Promise<string[] | null> {
  const d = await readSavedData();
  const arr = d?.music;
  return Array.isArray(arr) && arr.length > 0 ? arr : null;
}

/** Salva as duas ordens juntas (o painel sempre envia as duas). */
export async function saveOrders(carousel: string[], music: string[]): Promise<boolean> {
  try {
    const { error } = await supabase.from('media_order').upsert({
      id: 1,
      data: { carousel, music },
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}
