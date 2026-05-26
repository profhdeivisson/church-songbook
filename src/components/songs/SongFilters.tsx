'use client';

import { SongFilters as Filters } from '@/types/song';
import { Search } from '@mui/icons-material';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface SongFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const targetOptions = [
  { value: '', label: 'Todos' },
  { value: 'adolescentes', label: 'Adolescentes' },
  { value: 'jovens', label: 'Jovens' },
  { value: 'adultos', label: 'Adultos' },
  { value: 'criancas', label: 'Crianças' },
  { value: 'idosos', label: 'Idosos' },
  { value: 'todos', label: 'Todos os públicos' },
];

const themeOptions = [
  { value: '', label: 'Todos' },
  { value: 'missao', label: 'Missão' },
  { value: 'salvacao', label: 'Salvação' },
  { value: 'libertacao', label: 'Libertação' },
  { value: 'oferta', label: 'Oferta' },
  { value: 'louvor', label: 'Louvor' },
  { value: 'adoracao', label: 'Adoração' },
  { value: 'gratidao', label: 'Gratidão' },
  { value: 'perdao', label: 'Perdão' },
  { value: 'esperanca', label: 'Esperança' },
  { value: 'fe', label: 'Fé' },
  { value: 'familia', label: 'Família' },
  { value: 'natal', label: 'Natal' },
  { value: 'pascoa', label: 'Páscoa' },
  { value: 'outro', label: 'Outro' },
];

const genreOptions = [
  { value: '', label: 'Todos' },
  { value: 'rock', label: 'Rock' },
  { value: 'pop_rock', label: 'Pop Rock' },
  { value: 'baiao', label: 'Baião' },
  { value: 'corinho_fogo', label: 'Corinho de Fogo' },
  { value: 'sertanejo', label: 'Sertanejo' },
  { value: 'gospel', label: 'Gospel' },
  { value: 'contemporaneo', label: 'Contemporâneo' },
  { value: 'hino', label: 'Hino' },
  { value: 'tradicional', label: 'Tradicional' },
  { value: 'outro', label: 'Outro' },
];

export function SongFilters({ filters, onFiltersChange }: SongFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchInput || undefined });
    }, 600);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Sincroniza se o filtro for limpo externamente
  useEffect(() => {
    if (!filters.search) setSearchInput('');
  }, [filters.search]);

  const handleSelectChange = (field: keyof Filters) => (event: SelectChangeEvent) => {
    const value = event.target.value || undefined;
    onFiltersChange({ ...filters, [field]: value });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '2fr 1fr 1fr 1fr',
          },
        }}
      >
        <TextField
          fullWidth
          placeholder="Buscar por título ou artista..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            },
          }}
        />

        <FormControl fullWidth>
          <InputLabel>Público-alvo</InputLabel>
          <Select
            value={filters.target || ''}
            label="Público-alvo"
            onChange={handleSelectChange('target')}
          >
            {targetOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Tema</InputLabel>
          <Select
            value={filters.theme || ''}
            label="Tema"
            onChange={handleSelectChange('theme')}
          >
            {themeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Gênero</InputLabel>
          <Select
            value={filters.genre || ''}
            label="Gênero"
            onChange={handleSelectChange('genre')}
          >
            {genreOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
}
