'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Stack,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import {
  Close,
  Favorite,
  FavoriteBorder,
  Share,
  Edit,
  Delete,
  OpenInNew,
} from '@mui/icons-material';
import { YouTubeIcon, SpotifyIcon, CifraIcon, LyricsIcon } from '@/components/common/PlatformIcons';
import { Song } from '@/types/song';

interface SongDetailModalProps {
  song: Song | null;
  open: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
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

export function SongDetailModal({
  song,
  open,
  onClose,
  isFavorite = false,
  onFavoriteToggle,
  onEdit,
  onDelete,
  onShare,
}: SongDetailModalProps) {
  if (!song) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" component="div">
              {song.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {song.artist}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Classificações */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Classificações
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
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

          {/* Links */}
          {(song.youtube_url || song.spotify_url || song.cifraclub_url || song.cifra_url || song.lyrics_url) && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Links
              </Typography>
              <Stack spacing={1.5}>
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
                      '&:hover': { textDecoration: 'underline' }
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
                      '&:hover': { textDecoration: 'underline' }
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
                      '&:hover': { textDecoration: 'underline' }
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
                      '&:hover': { textDecoration: 'underline' }
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
                      '&:hover': { textDecoration: 'underline' }
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
              <Typography variant="subtitle2" gutterBottom>
                Observações
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {song.observations}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        <Box>
          <IconButton onClick={onFavoriteToggle} color={isFavorite ? 'error' : 'default'}>
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <IconButton onClick={onShare}>
            <Share />
          </IconButton>
        </Box>
        {(onEdit || onDelete) && (
          <Box>
            {onEdit && (
              <Button startIcon={<Edit />} onClick={onEdit}>
                Editar
              </Button>
            )}
            {onDelete && (
              <Button startIcon={<Delete />} onClick={onDelete} color="error">
                Excluir
              </Button>
            )}
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
}
