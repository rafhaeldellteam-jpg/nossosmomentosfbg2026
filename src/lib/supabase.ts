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
  let names: string[] = [];
  if (!error && data && data.length > 0) {
    names = data.map((f) => f.name);
  } else {
    // fallback: lista explícita em manifest.json dentro do bucket
    try {
      const manifestUrl =
        supabase.storage.from(bucket).getPublicUrl('manifest.json').data.publicUrl +
        `?t=${Date.now()}`;
      const res = await fetch(manifestUrl, { cache: 'no-store' });
      if (res.ok) {
        const manifest = await res.json();
        if (Array.isArray(manifest.files)) names = manifest.files;
      }
    } catch {
      /* sem manifest — segue vazio */
    }
  }
  return names
    .filter((n) => test(n))
    .map((n) => ({
      name: n,
      prettyName: pretty(n),
      url: supabase.storage.from(bucket).getPublicUrl(n).data.publicUrl,
    }));
}

export const listMusic = () => listBucket('music', (n) => AUDIO_EXT.test(n));
export const listPhotos = () => listBucket('photos', (n) => IMAGE_EXT.test(n));
export const listVideos = () => listBucket('videos', (n) => VIDEO_EXT.test(n));

// ---------- ordem do carrossel (painel admin) ----------

export type Slide = {
  key: string; // "photo:NOME" | "video:NOME"
  type: 'photo' | 'video';
  url: string;
  prettyName: string;
};

export async function getCarouselOrder(): Promise<string[] | null> {
  try {
    const { data, error } = await supabase
      .from('media_order')
      .select('data')
      .eq('id', 1)
      .maybeSingle();
    if (error || !data) return null;
    const arr = (data as { data?: { carousel?: unknown } }).data?.carousel;
    return Array.isArray(arr) && arr.length > 0 ? (arr as string[]) : null;
  } catch {
    return null;
  }
}

export async function saveCarouselOrder(keys: string[]): Promise<boolean> {
  try {
    const { error } = await supabase.from('media_order').upsert({
      id: 1,
      data: { carousel: keys },
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}
