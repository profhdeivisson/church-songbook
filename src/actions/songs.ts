'use server';

import { createClient } from '@/lib/supabase/server';
import type { TablesInsert, TablesUpdate } from '@/types/database';
import type { Song, SongFilters } from '@/types/song';
import { revalidatePath } from 'next/cache';

function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

function normalizeOtherLinks(
  value: unknown
): import('@/types/song').OtherLink[] | undefined {
  // Supabase may return other_links as Json (objects) instead of OtherLink[]
  // We accept arrays of {name,url} (best-effort).
  if (value === null || value === undefined) return undefined;

  if (!Array.isArray(value)) return undefined;

  const normalized: import('@/types/song').OtherLink[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;

    const name = typeof obj.name === 'string' ? obj.name : undefined;
    const url = typeof obj.url === 'string' ? obj.url : undefined;
    const icon = typeof obj.icon === 'string' ? obj.icon : undefined;

    if (!name || !url) continue;

    normalized.push(icon ? { name, url, icon } : { name, url });
  }

  return normalized.length ? normalized : undefined;
}

function normalizeSong(raw: unknown): Song {
  const data = raw as Record<string, unknown>;

  return {
    id: data.id as string,
    title: data.title as string,
    artist: data.artist as string,

    youtube_url: nullToUndefined<string>(data.youtube_url as string | null),
    spotify_url: nullToUndefined<string>(data.spotify_url as string | null),
    cifra_url: nullToUndefined<string>(data.cifra_url as string | null),
    cifraclub_url: nullToUndefined<string>(data.cifraclub_url as string | null),
    lyrics_url: nullToUndefined<string>(data.lyrics_url as string | null),

    target: data.target ? (data.target as Song['target']) : undefined,
    theme: data.theme ? (data.theme as Song['theme']) : undefined,
    genre: data.genre ? (data.genre as Song['genre']) : undefined,

    tone: nullToUndefined<string>(data.tone as string | null),
    bpm: data.bpm === null ? undefined : (data.bpm as number),
    observations: nullToUndefined<string>(data.observations as string | null),

    other_links: normalizeOtherLinks(data.other_links),

    created_by: data.created_by as string,
    created_at: data.created_at as string,
    updated_at: data.updated_at as string,
  };
}

export async function getSongs(filters?: SongFilters) {
  const supabase = await createClient();

  let query = supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,artist.ilike.%${filters.search}%`
    );
  }

  if (filters?.target) {
    query = query.eq('target', filters.target);
  }

  if (filters?.theme) {
    query = query.eq('theme', filters.theme);
  }

  if (filters?.genre) {
    query = query.eq('genre', filters.genre);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching songs:', error);
    throw new Error('Erro ao buscar músicas');
  }

  return (data ?? []).map(s => normalizeSong(s));
}

export async function getSongById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching song:', error);
    throw new Error('Erro ao buscar música');
  }

  return normalizeSong(data);
}

export async function createSong(songData: Partial<Song>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const insertData: TablesInsert<'songs'> = {
    title: songData.title!,
    artist: songData.artist!,
    youtube_url: songData.youtube_url || null,
    spotify_url: songData.spotify_url || null,
    cifra_url: songData.cifra_url || null,
    cifraclub_url: songData.cifraclub_url || null,
    lyrics_url: songData.lyrics_url || null,
    other_links: (songData.other_links ??
      null) as TablesInsert<'songs'>['other_links'],
    target: songData.target || null,
    theme: songData.theme || null,
    genre: songData.genre || null,
    tone: songData.tone || null,
    bpm: songData.bpm || null,
    observations: songData.observations || null,
    created_by: user.id,
  };

  const { data, error } = await supabase
    .from('songs')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating song:', error);
    throw new Error('Erro ao criar música');
  }

  revalidatePath('/');
  return normalizeSong(data);
}

export async function updateSong(id: string, songData: Partial<Song>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const updateData: TablesUpdate<'songs'> = {
    title: songData.title,
    artist: songData.artist,
    youtube_url: songData.youtube_url || null,
    spotify_url: songData.spotify_url || null,
    cifra_url: songData.cifra_url || null,
    cifraclub_url: songData.cifraclub_url || null,
    lyrics_url: songData.lyrics_url || null,
    other_links: (songData.other_links ??
      null) as TablesUpdate<'songs'>['other_links'],
    target: songData.target || null,
    theme: songData.theme || null,
    genre: songData.genre || null,
    tone: songData.tone || null,
    bpm: songData.bpm || null,
    observations: songData.observations || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('songs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating song:', error);
    throw new Error('Erro ao atualizar música');
  }

  revalidatePath('/');
  revalidatePath(`/song/${id}`);
  return normalizeSong(data);
}

export async function deleteSong(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { error } = await supabase.from('songs').delete().eq('id', id);

  if (error) {
    console.error('Error deleting song:', error);
    throw new Error('Erro ao deletar música');
  }

  revalidatePath('/');
}

export async function toggleFavorite(songId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('song_id', songId)
    .single();

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existing.id);

    if (error) {
      console.error('Error removing favorite:', error);
      throw new Error('Erro ao remover favorito');
    }
  } else {
    // Add favorite
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, song_id: songId });

    if (error) {
      console.error('Error adding favorite:', error);
      throw new Error('Erro ao adicionar favorito');
    }
  }

  revalidatePath('/');
  revalidatePath('/favorites');
  revalidatePath(`/song/${songId}`);
}

export async function getFavorites() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { data, error } = await supabase
    .from('favorites')
    .select('song_id, songs(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
    throw new Error('Erro ao buscar favoritos');
  }

  return data.map((fav: unknown) =>
    normalizeSong((fav as { songs: unknown }).songs)
  ) as Song[];
}

export async function isFavorite(songId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('song_id', songId)
    .single();

  return !!data;
}
