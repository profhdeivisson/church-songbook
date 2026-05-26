'use client';

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Edit,
  Share,
  MoreVert,
  Delete,
} from '@mui/icons-material';
import { useState } from 'react';
import { YouTubeIcon, SpotifyIcon, CifraIcon, LyricsIcon } from '@/components/common/PlatformIcons';
import { Song } from '@/types/song';

interface SongCardProps {
  song: Song;
  isFavorite?: boolean;
  onFavoriteToggle?: (songId: string) => void;
  onEdit?: (songId: string) => void;
  onDelete?: (songId: string) => void;
  onShare?: (songId: string) => void;
  onClick?: (songId: string) => void;
}

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

export function SongCard({
  song,
  isFavorite = false,
  onFavoriteToggle,
  onEdit,
  onDelete,
  onShare,
  onClick,
}: SongCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
    onEdit?.(song.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
    onDelete?.(song.id);
  };

  const canManage = onEdit || onDelete;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          elevation: 4,
          transform: onClick ? 'translateY(-4px)' : 'none',
        },
      }}
      elevation={2}
      onClick={() => onClick?.(song.id)}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h2" gutterBottom noWrap>
              {song.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
              {song.artist}
            </Typography>
          </Box>
          {canManage && (
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ ml: 1 }}
            >
              <MoreVert />
            </IconButton>
          )}
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 1, gap: 0.5, flexWrap: 'wrap' }}>
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
            <Chip
              label={genreLabels[song.genre]}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>

        <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
          {song.youtube_url && <YouTubeIcon />}
          {song.spotify_url && <SpotifyIcon />}
          {(song.cifraclub_url || song.cifra_url) && <CifraIcon />}
          {song.lyrics_url && <LyricsIcon />}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle?.(song.id);
            }}
            color={isFavorite ? 'error' : 'default'}
          >
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onShare?.(song.id);
            }}
          >
            <Share />
          </IconButton>
        </Box>
      </CardActions>

      {/* Menu de ações */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {onEdit && (
          <MenuItem onClick={handleEditClick}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Deletar</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
}
