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
  if (error || !data) return [];
  return data
    .filter((f) => !f.id || test(f.name))
    .filter((f) => test(f.name))
    .map((f) => ({
      name: f.name,
      prettyName: pretty(f.name),
      url: supabase.storage.from(bucket).getPublicUrl(f.name).data.publicUrl,
    }));
}

export const listMusic = () => listBucket('music', (n) => AUDIO_EXT.test(n));
export const listPhotos = () => listBucket('photos', (n) => IMAGE_EXT.test(n));
export const listVideos = () => listBucket('videos', (n) => VIDEO_EXT.test(n));
