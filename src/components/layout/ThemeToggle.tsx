'use client';

import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '@/providers/ThemeProvider';

export function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme">
      {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}
