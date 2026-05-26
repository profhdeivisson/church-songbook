'use client';

import { Box, Typography, Button } from '@mui/material';
import { MusicNote } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          mb: 3,
          color: 'text.secondary',
          opacity: 0.5,
        }}
      >
        {icon || <MusicNote sx={{ fontSize: 80 }} />}
      </Box>
      <Typography variant="h5" gutterBottom color="text.secondary">
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
