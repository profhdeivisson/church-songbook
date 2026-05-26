'use client';

import { SongForm } from '@/components/songs/SongForm';
import { createClient } from '@/lib/supabase/client';
import type { Song } from '@/types/song';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Snackbar,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

function toErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return 'Erro ao processar requisição';
}

export default function EditSongPage() {
  const router = useRouter();
  const params = useParams();
  const songId = params.id as string;
  const supabase = createClient();

  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Carregar música
  useEffect(() => {
    async function loadSong() {
      try {
        setLoading(true);

        // Verificar usuário
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError('Você precisa estar logado');
          router.push('/login');
          return;
        }

        // Buscar música
        const { data, error: fetchError } = await supabase
          .from('songs')
          .select('*')
          .eq('id', songId)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Música não encontrada');

        // Verificar se é o dono
        if (data.created_by !== user.id) {
          setError('Você não tem permissão para editar esta música');
          setTimeout(() => router.push('/'), 2000);
          return;
        }

        // Supabase pode retornar fields como null, enquanto nosso tipo Song usa undefined.
        // Também existem campos com formato diferente (ex: other_links), então normalizamos para o shape esperado.
        setSong({
          ...data,
          // URLs
          youtube_url: nullToUndefined(data.youtube_url),
          spotify_url: nullToUndefined(data.spotify_url),
          cifra_url: nullToUndefined(data.cifra_url),
          cifraclub_url: nullToUndefined(data.cifraclub_url),
          lyrics_url: nullToUndefined(data.lyrics_url),

          // Metadados (nullable no Supabase)
          target: nullToUndefined(data.target),
          theme: nullToUndefined(data.theme),
          genre: nullToUndefined(data.genre),
          observations: nullToUndefined(data.observations),

          // Campos que podem vir como null e/ou formatos diferentes:
          // Mantemos como undefined para evitar incompatibilidade de tipos.
          other_links: undefined,
          tone: nullToUndefined(data.tone),
          bpm: nullToUndefined(data.bpm),
        } as unknown as Song);
      } catch (err) {
        console.error('Error loading song:', err);
        setError('Erro ao carregar música');
      } finally {
        setLoading(false);
      }
    }

    loadSong();
  }, [songId, supabase, router]);

  async function handleSubmit(data: Partial<Song>) {
    setSaving(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('songs')
        .update({
          title: data.title,
          artist: data.artist,
          youtube_url: data.youtube_url || null,
          spotify_url: data.spotify_url || null,
          cifra_url: data.cifra_url || null,
          cifraclub_url: data.cifraclub_url || null,
          lyrics_url: data.lyrics_url || null,
          target: data.target || null,
          theme: data.theme || null,
          genre: data.genre || null,
          observations: data.observations || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', songId);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      console.error('Error updating song:', err);
      setError(toErrorMessage(err) || 'Erro ao atualizar música');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    router.back();
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!song) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Música não encontrada</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <SongForm
        song={song}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={saving}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Música atualizada com sucesso!
        </Alert>
      </Snackbar>
    </Container>
  );
}
