'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Snackbar, Alert } from '@mui/material';
import { AppLayout } from '@/components/layout/AppLayout';
import { SongForm } from '@/components/songs/SongForm';
import { createClient } from '@/lib/supabase/client';
import { Song } from '@/types/song';

export default function NewSongPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: Partial<Song>) => {
    setLoading(true);
    setError(null);

    try {
      // Verificar se usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Você precisa estar logado para criar uma música');
        router.push('/login');
        return;
      }

      // Criar música no Supabase
      const { error: insertError } = await supabase
        .from('songs')
        .insert({
          title: data.title!,
          artist: data.artist!,
          youtube_url: data.youtube_url || null,
          spotify_url: data.spotify_url || null,
          cifra_url: data.cifra_url || null,
          cifraclub_url: data.cifraclub_url || null,
          lyrics_url: data.lyrics_url || null,
          target: data.target || null,
          theme: data.theme || null,
          genre: data.genre || null,
          observations: data.observations || null,
          created_by: user.id,
        });

      if (insertError) throw insertError;

      setSuccess(true);
      
      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      console.error('Error creating song:', err);
      setError(err.message || 'Erro ao criar música');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <AppLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <SongForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
          isLoading={loading}
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
            Música criada com sucesso! Redirecionando...
          </Alert>
        </Snackbar>
      </Container>
    </AppLayout>
  );
}
