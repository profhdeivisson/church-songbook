'use client';

import { EmptyState } from '@/components/common/EmptyState';
import { AppLayout } from '@/components/layout/AppLayout';
import { SongDetailModal } from '@/components/songs/SongDetailModal';
import { SongFilters } from '@/components/songs/SongFilters';
import { SongGrid } from '@/components/songs/SongGrid';
import { createClient } from '@/lib/supabase/client';
import { SongFilters as Filters, Song } from '@/types/song';
import { Alert, Box, CircularProgress, Container, LinearProgress, Pagination, Snackbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const PAGE_SIZE = 12;

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Carregar usuário atual
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    }
    loadUser();
  }, [supabase]);

  // Carregar músicas do Supabase
  useEffect(() => {
    async function loadSongs() {
      try {
        if (songs.length === 0) setLoading(true);
        else setRefetching(true);

        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let query = supabase
          .from('songs')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(from, to);

        // Aplicar filtros
        if (filters.search) {
          query = query.or(
            `title.ilike.%${filters.search}%,artist.ilike.%${filters.search}%`
          );
        }
        if (filters.target) {
          query = query.eq('target', filters.target);
        }
        if (filters.theme) {
          query = query.eq('theme', filters.theme);
        }
        if (filters.genre) {
          query = query.eq('genre', filters.genre);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        setTotalCount(count || 0);
        const songsData = (data || []).map(song => ({
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

        setSongs(songsData);
      } catch (err: any) {
        console.error('Error loading songs:', err);
        setError('Erro ao carregar músicas');
      } finally {
        setLoading(false);
        setRefetching(false);
      }
    }

    loadSongs();
  }, [filters, page, supabase]);

  // Reseta para página 1 quando filtros mudam
  const handleFiltersChange = (newFilters: Filters) => {
    setPage(1);
    setFilters(newFilters);
  };

  // Carregar favoritos do usuário
  useEffect(() => {
    async function loadFavorites() {
      if (!currentUserId) return;

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('song_id')
          .eq('user_id', currentUserId);

        if (error) throw error;

        const favIds = new Set(data?.map(f => f.song_id) || []);
        setFavorites(favIds);
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    }

    loadFavorites();
  }, [currentUserId, supabase]);

  const handleFavoriteToggle = async (songId: string) => {
    if (!currentUserId) {
      setError('Você precisa estar logado para favoritar músicas');
      return;
    }

    try {
      const isFavorite = favorites.has(songId);

      if (isFavorite) {
        // Remover favorito
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', currentUserId)
          .eq('song_id', songId);

        if (error) throw error;

        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(songId);
          return newFavorites;
        });
      } else {
        // Adicionar favorito
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: currentUserId, song_id: songId });

        if (error) throw error;

        setFavorites(prev => new Set(prev).add(songId));
      }
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
    if (!currentUserId) {
      setError('Você precisa estar logado para deletar músicas');
      return;
    }

    const song = songs.find(s => s.id === songId);
    if (!song) return;

    if (song.created_by !== currentUserId) {
      setError('Você só pode deletar músicas que você criou');
      return;
    }

    if (!confirm('Tem certeza que deseja deletar esta música?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

      if (error) throw error;

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
        <SongFilters filters={filters} onFiltersChange={handleFiltersChange} />
        <Typography variant="body1" gutterBottom sx={{ textAlign: 'right' }}>
          {totalCount} músicas encontradas
        </Typography>
        {refetching && <LinearProgress sx={{ mb: 1 }} />}
        {songs.length > 0 ? (
          <>
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
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => {
                    setPage(value);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  color="primary"
                />
              </Box>
            )}
          </>
        ) : (
          <EmptyState
            title="Nenhuma música encontrada"
            description="Tente ajustar os filtros ou adicione novas músicas ao repertório"
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
