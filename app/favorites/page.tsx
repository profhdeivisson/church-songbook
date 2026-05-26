'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { AppLayout } from '@/components/layout/AppLayout';
import { SongGrid } from '@/components/songs/SongGrid';
import { SongDetailModal } from '@/components/songs/SongDetailModal';
import { EmptyState } from '@/components/common/EmptyState';
import { Favorite } from '@mui/icons-material';
import { Song } from '@/types/song';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carregar usuário e favoritos
  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }
        
        setCurrentUserId(user.id);

        // Buscar favoritos com join nas músicas
        const { data, error: fetchError } = await supabase
          .from('favorites')
          .select('song_id, songs(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Extrair músicas e IDs dos favoritos
        const favoriteSongs = (data || [])
          .map(fav => fav.songs)
          .filter(Boolean)
          .map(song => ({
            ...song,
            youtube_url: song.youtube_url || undefined,
            spotify_url: song.spotify_url || undefined,
            cifra_url: song.cifra_url || undefined,
            cifraclub_url: song.cifraclub_url || undefined,
            lyrics_url: song.lyrics_url || undefined,
            other_links: song.other_links as any || undefined,
            target: song.target as any || undefined,
            theme: song.theme as any || undefined,
            genre: song.genre as any || undefined,
            tone: song.tone || undefined,
            bpm: song.bpm || undefined,
            observations: song.observations || undefined,
          })) as Song[];

        const favoriteIds = new Set((data || []).map(fav => fav.song_id));

        setSongs(favoriteSongs);
        setFavorites(favoriteIds);
      } catch (err: any) {
        console.error('Error loading favorites:', err);
        setError('Erro ao carregar favoritos');
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [supabase, router]);

  const handleFavoriteToggle = async (songId: string) => {
    if (!currentUserId) return;

    try {
      // Remover favorito
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', currentUserId)
        .eq('song_id', songId);

      if (deleteError) throw deleteError;

      // Atualizar estado local
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        newFavorites.delete(songId);
        return newFavorites;
      });

      // Remover da lista
      setSongs(prev => prev.filter(s => s.id !== songId));
      
      setSuccess('Música removida dos favoritos');
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      setError('Erro ao atualizar favorito');
    }
  };

  const handleShare = (songId: string) => {
    const url = `${window.location.origin}/song/${songId}`;
    navigator.clipboard.writeText(url);
    setSuccess('Link copiado para a área de transferência!');
  };

  const handleSongClick = (songId: string) => {
    const song = songs.find((s) => s.id === songId);
    if (song) {
      setSelectedSong(song);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedSong(null), 200);
  };

  const handleModalFavoriteToggle = () => {
    if (selectedSong) {
      handleFavoriteToggle(selectedSong.id);
      handleCloseModal();
    }
  };

  const handleModalShare = () => {
    if (selectedSong) {
      handleShare(selectedSong.id);
    }
  };

  const handleEdit = (songId: string) => {
    router.push(`/songs/${songId}/edit`);
  };

  const handleDelete = async (songId: string) => {
    if (!currentUserId) return;

    const song = songs.find(s => s.id === songId);
    if (!song || song.created_by !== currentUserId) {
      setError('Você só pode deletar músicas que você criou');
      return;
    }

    if (!confirm('Tem certeza que deseja deletar esta música?')) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

      if (deleteError) throw deleteError;

      setSongs(prev => prev.filter(s => s.id !== songId));
      setSuccess('Música deletada com sucesso!');
      
      if (modalOpen && selectedSong?.id === songId) {
        handleCloseModal();
      }
    } catch (err: any) {
      console.error('Error deleting song:', err);
      setError('Erro ao deletar música');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container maxWidth="xl">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Minhas Músicas Favoritas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {songs.length === 0
              ? 'Você ainda não tem músicas favoritas'
              : `${songs.length} ${songs.length === 1 ? 'música' : 'músicas'} favoritada${songs.length === 1 ? '' : 's'}`}
          </Typography>
        </Box>

        {songs.length > 0 ? (
          <SongGrid
            songs={songs}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
            onShare={handleShare}
            onSongClick={handleSongClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentUserId={currentUserId}
          />
        ) : (
          <EmptyState
            title="Nenhuma música favoritada"
            description="Favorite músicas na página inicial para vê-las aqui"
            icon={<Favorite sx={{ fontSize: 80 }} />}
          />
        )}
      </Container>

      <SongDetailModal
        song={selectedSong}
        open={modalOpen}
        onClose={handleCloseModal}
        isFavorite={selectedSong ? favorites.has(selectedSong.id) : false}
        onFavoriteToggle={handleModalFavoriteToggle}
        onShare={handleModalShare}
        onEdit={selectedSong && currentUserId === selectedSong.created_by ? () => handleEdit(selectedSong.id) : undefined}
        onDelete={selectedSong && currentUserId === selectedSong.created_by ? () => handleDelete(selectedSong.id) : undefined}
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
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}
