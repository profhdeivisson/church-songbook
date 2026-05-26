'use client';

import { useParams, useRouter } from 'next/navigation';
import { Container, Box, Paper, Typography, Chip, Stack, Button, Divider, Link as MuiLink, CircularProgress, Snackbar, Alert } from '@mui/material';
import { ArrowBack, Favorite, FavoriteBorder, OpenInNew } from '@mui/icons-material';
import { AppLayout } from '@/components/layout/AppLayout';
import { YouTubeIcon, SpotifyIcon, CifraIcon, LyricsIcon } from '@/components/common/PlatformIcons';
import { Song } from '@/types/song';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const targetLabels: Record<string, string> = {
  adolescentes: 'Adolescentes',
  jovens: 'Jovens',
  adultos: 'Adultos',
  criancas: 'Crianças',
  idosos: 'Idosos',
  todos: 'Todos',
};

const themeLabels: Record<string, string> = {
  missao: 'Missão',
  salvacao: 'Salvação',
  libertacao: 'Libertação',
  oferta: 'Oferta',
  louvor: 'Louvor',
  adoracao: 'Adoração',
  gratidao: 'Gratidão',
  perdao: 'Perdão',
  esperanca: 'Esperança',
  fe: 'Fé',
  familia: 'Família',
  natal: 'Natal',
  pascoa: 'Páscoa',
  outro: 'Outro',
};

const genreLabels: Record<string, string> = {
  rock: 'Rock',
  pop_rock: 'Pop Rock',
  baiao: 'Baião',
  corinho_fogo: 'Corinho de Fogo',
  sertanejo: 'Sertanejo',
  gospel: 'Gospel',
  contemporaneo: 'Contemporâneo',
  hino: 'Hino',
  tradicional: 'Tradicional',
  outro: 'Outro',
};

export default function SongPage() {
  const params = useParams();
  const router = useRouter();
  const songId = params.id as string;
  const supabase = createClient();
  
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carregar música e verificar favorito
  useEffect(() => {
    async function loadSong() {
      try {
        setLoading(true);

        // Buscar música
        const { data: songData, error: songError } = await supabase
          .from('songs')
          .select('*')
          .eq('id', songId)
          .single();

        if (songError) throw songError;

        // Converter tipos
        const convertedSong: Song = {
          ...songData,
          youtube_url: songData.youtube_url || undefined,
          spotify_url: songData.spotify_url || undefined,
          cifra_url: songData.cifra_url || undefined,
          cifraclub_url: songData.cifraclub_url || undefined,
          lyrics_url: songData.lyrics_url || undefined,
          other_links: songData.other_links as any || undefined,
          target: songData.target as any || undefined,
          theme: songData.theme as any || undefined,
          genre: songData.genre as any || undefined,
          tone: songData.tone || undefined,
          bpm: songData.bpm || undefined,
          observations: songData.observations || undefined,
        };

        setSong(convertedSong);

        // Verificar se está favoritado
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);

        if (user) {
          const { data: favoriteData } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('song_id', songId)
            .single();

          setIsFavorite(!!favoriteData);
        }
      } catch (err: any) {
        console.error('Error loading song:', err);
        setError('Erro ao carregar música');
      } finally {
        setLoading(false);
      }
    }

    loadSong();
  }, [songId, supabase]);

  const handleFavoriteToggle = async () => {
    if (!currentUserId) {
      setError('Você precisa estar logado para favoritar músicas');
      router.push('/login');
      return;
    }

    try {
      if (isFavorite) {
        // Remover favorito
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', currentUserId)
          .eq('song_id', songId);

        if (deleteError) throw deleteError;

        setIsFavorite(false);
        setSuccess('Música removida dos favoritos');
      } else {
        // Adicionar favorito
        const { error: insertError } = await supabase
          .from('favorites')
          .insert({ user_id: currentUserId, song_id: songId });

        if (insertError) throw insertError;

        setIsFavorite(true);
        setSuccess('Música adicionada aos favoritos');
      }
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      setError('Erro ao atualizar favorito');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        </Container>
      </AppLayout>
    );
  }

  if (!song) {
    return (
      <AppLayout>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Música não encontrada
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              A música que você está procurando não existe ou foi removida.
            </Typography>
            <Button variant="contained" startIcon={<ArrowBack />} onClick={() => router.push('/')}>
              Voltar para o início
            </Button>
          </Paper>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Button startIcon={<ArrowBack />} onClick={() => router.push('/')}>
            Voltar
          </Button>
        </Box>

        <Paper sx={{ p: 4 }}>
          {/* Cabeçalho */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              {song.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {song.artist}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Button
                variant={isFavorite ? 'contained' : 'outlined'}
                color={isFavorite ? 'error' : 'primary'}
                startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                onClick={handleFavoriteToggle}
              >
                {isFavorite ? 'Favoritado' : 'Favoritar'}
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Classificações */}
          {(song.target || song.theme || song.genre) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Classificações
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1, gap: 0.5, flexWrap: 'wrap' }}>
                {song.target && (
                  <Chip
                    label={targetLabels[song.target]}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                )}
                {song.theme && (
                  <Chip
                    label={themeLabels[song.theme]}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                )}
                {song.genre && (
                  <Chip label={genreLabels[song.genre]} size="small" variant="outlined" />
                )}
              </Stack>
            </Box>
          )}

          {/* Links */}
          {(song.youtube_url || song.spotify_url || song.cifraclub_url || song.cifra_url || song.lyrics_url) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Links
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                {song.youtube_url && (
                  <MuiLink
                    href={song.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    <YouTubeIcon />
                    <Typography variant="body2">YouTube</Typography>
                    <OpenInNew sx={{ fontSize: 16, ml: 'auto' }} />
                  </MuiLink>
                )}
                {song.spotify_url && (
                  <MuiLink
                    href={song.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    <SpotifyIcon />
                    <Typography variant="body2">Spotify</Typography>
                    <OpenInNew sx={{ fontSize: 16, ml: 'auto' }} />
                  </MuiLink>
                )}
                {song.cifraclub_url && (
                  <MuiLink
                    href={song.cifraclub_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    <CifraIcon />
                    <Typography variant="body2">Cifra Club</Typography>
                    <OpenInNew sx={{ fontSize: 16, ml: 'auto' }} />
                  </MuiLink>
                )}
                {song.cifra_url && (
                  <MuiLink
                    href={song.cifra_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    <CifraIcon />
                    <Typography variant="body2">Cifra</Typography>
                    <OpenInNew sx={{ fontSize: 16, ml: 'auto' }} />
                  </MuiLink>
                )}
                {song.lyrics_url && (
                  <MuiLink
                    href={song.lyrics_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    <LyricsIcon />
                    <Typography variant="body2">Letra</Typography>
                    <OpenInNew sx={{ fontSize: 16, ml: 'auto' }} />
                  </MuiLink>
                )}
              </Stack>
            </Box>
          )}

          {/* Observações */}
          {song.observations && (
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Observações
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {song.observations}
              </Typography>
            </Box>
          )}
        </Paper>

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
          open={!!success}
          autoHideDuration={3000}
          onClose={() => setSuccess(null)}
        >
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </AppLayout>
  );
}
