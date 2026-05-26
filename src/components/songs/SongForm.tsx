'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Typography,
  Stack,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { Song } from '@/types/song';

interface SongFormProps {
  song?: Partial<Song>;
  onSubmit: (data: Partial<Song>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SongForm({ song, onSubmit, onCancel, isLoading }: SongFormProps) {
  const [formData, setFormData] = useState<Partial<Song>>(
    song || {
      title: '',
      artist: '',
      youtube_url: '',
      spotify_url: '',
      cifra_url: '',
      cifraclub_url: '',
      lyrics_url: '',
      target: undefined,
      theme: undefined,
      genre: undefined,
      observations: '',
    }
  );

  const handleChange = (field: keyof Song) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        {song?.id ? 'Editar Música' : 'Nova Música'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={3}>
          {/* Informações Básicas */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Informações Básicas
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                required
                label="Título da Música"
                value={formData.title}
                onChange={handleChange('title')}
                placeholder="Ex: Reckless Love"
              />
              <TextField
                fullWidth
                required
                label="Artista/Banda"
                value={formData.artist}
                onChange={handleChange('artist')}
                placeholder="Ex: Cory Asbury"
              />
            </Stack>
          </Box>

          {/* Links */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Links (opcional)
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="YouTube"
                value={formData.youtube_url}
                onChange={handleChange('youtube_url')}
                type="url"
                placeholder="https://youtube.com/..."
              />
              <TextField
                fullWidth
                label="Cifra Club"
                value={formData.cifraclub_url}
                onChange={handleChange('cifraclub_url')}
                type="url"
                placeholder="https://cifraclub.com.br/..."
              />
              <TextField
                fullWidth
                label="Cifra (outro site)"
                value={formData.cifra_url}
                onChange={handleChange('cifra_url')}
                type="url"
                placeholder="https://..."
              />
              <TextField
                fullWidth
                label="Letra"
                value={formData.lyrics_url}
                onChange={handleChange('lyrics_url')}
                type="url"
                placeholder="https://..."
              />
            </Stack>
          </Box>

          {/* Classificações */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Classificações (opcional)
            </Typography>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Público-alvo</InputLabel>
                <Select
                  value={formData.target || ''}
                  label="Público-alvo"
                  onChange={handleChange('target')}
                >
                  <MenuItem value="">Nenhum</MenuItem>
                  <MenuItem value="adolescentes">Adolescentes</MenuItem>
                  <MenuItem value="jovens">Jovens</MenuItem>
                  <MenuItem value="adultos">Adultos</MenuItem>
                  <MenuItem value="criancas">Crianças</MenuItem>
                  <MenuItem value="idosos">Idosos</MenuItem>
                  <MenuItem value="todos">Todos</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Tema</InputLabel>
                <Select
                  value={formData.theme || ''}
                  label="Tema"
                  onChange={handleChange('theme')}
                >
                  <MenuItem value="">Nenhum</MenuItem>
                  <MenuItem value="missao">Missão</MenuItem>
                  <MenuItem value="salvacao">Salvação</MenuItem>
                  <MenuItem value="libertacao">Libertação</MenuItem>
                  <MenuItem value="oferta">Oferta</MenuItem>
                  <MenuItem value="louvor">Louvor</MenuItem>
                  <MenuItem value="adoracao">Adoração</MenuItem>
                  <MenuItem value="gratidao">Gratidão</MenuItem>
                  <MenuItem value="perdao">Perdão</MenuItem>
                  <MenuItem value="esperanca">Esperança</MenuItem>
                  <MenuItem value="fe">Fé</MenuItem>
                  <MenuItem value="familia">Família</MenuItem>
                  <MenuItem value="natal">Natal</MenuItem>
                  <MenuItem value="pascoa">Páscoa</MenuItem>
                  <MenuItem value="outro">Outro</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Gênero Musical</InputLabel>
                <Select
                  value={formData.genre || ''}
                  label="Gênero Musical"
                  onChange={handleChange('genre')}
                >
                  <MenuItem value="">Nenhum</MenuItem>
                  <MenuItem value="rock">Rock</MenuItem>
                  <MenuItem value="pop_rock">Pop Rock</MenuItem>
                  <MenuItem value="baiao">Baião</MenuItem>
                  <MenuItem value="corinho_fogo">Corinho de Fogo</MenuItem>
                  <MenuItem value="sertanejo">Sertanejo</MenuItem>
                  <MenuItem value="gospel">Gospel</MenuItem>
                  <MenuItem value="contemporaneo">Contemporâneo</MenuItem>
                  <MenuItem value="hino">Hino</MenuItem>
                  <MenuItem value="tradicional">Tradicional</MenuItem>
                  <MenuItem value="outro">Outro</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>

          {/* Observações */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Observações (opcional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={formData.observations}
              onChange={handleChange('observations')}
              placeholder="Adicione notas, instruções ou informações adicionais sobre a música..."
            />
          </Box>

          {/* Ações */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Música'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
