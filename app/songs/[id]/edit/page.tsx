'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Container, Snackbar, Alert, CircularProgress, Box } from '@mui/material';
import { SongForm } from '@/components/songs/SongForm';
import { createClient } from '@/lib/supabase/client';
import type { Song } from '@/types/song';

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
        const { data: { user } } = await supabase.auth.getUser();
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

        // Verificar se é o dono
        if (data.created_by !== user.id) {
          setError('Você não tem permissão para editar esta música');
          setTimeout(() => router.push('/'), 2000);
          return;
        }

        setSong(data);
      } catch (err: any) {
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
    } catch (err: any) {
      console.error('Error updating song:', err);
      setError(err.message || 'Erro ao atualizar música');
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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
