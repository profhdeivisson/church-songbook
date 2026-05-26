'use client';

import { Grid } from '@mui/material';
import { Song } from '@/types/song';
import { SongCard } from './SongCard';

interface SongGridProps {
  songs: Song[];
  favorites?: Set<string>;
  onFavoriteToggle?: (songId: string) => void;
  onEdit?: (songId: string) => void;
  onDelete?: (songId: string) => void;
  onShare?: (songId: string) => void;
  onSongClick?: (songId: string) => void;
  currentUserId?: string | null;
}

export function SongGrid({
  songs,
  favorites = new Set(),
  onFavoriteToggle,
  onEdit,
  onDelete,
  onShare,
  onSongClick,
  currentUserId,
}: SongGridProps) {
  return (
    <Grid container spacing={3}>
      {songs.map((song) => {
        const isOwner = currentUserId === song.created_by;
        
        return (
          <Grid
            key={song.id}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <SongCard
              song={song}
              isFavorite={favorites.has(song.id)}
              onFavoriteToggle={onFavoriteToggle}
              onEdit={isOwner ? onEdit : undefined}
              onDelete={isOwner ? onDelete : undefined}
              onShare={onShare}
              onClick={onSongClick}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
