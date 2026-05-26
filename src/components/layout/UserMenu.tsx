'use client';

import { logout } from '@/actions/auth';
import { useSupabase } from '@/hooks/useSupabase';
import { ExitToApp } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import type { User } from '@supabase/supabase-js';
import { useState } from 'react';

function getEmailFallback(user: User | null) {
  return user?.email ?? '';
}

function getInitials(email: string) {
  const base = email.split('@')[0] ?? '';
  const parts = base.split(/[._\-\s]+/).filter(Boolean);
  const initials =
    (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? parts[0]?.[1] ?? '');
  return initials.toUpperCase() || 'U';
}

export function UserMenu() {
  const { user, loading } = useSupabase();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={24} color="inherit" />
      </Box>
    );
  }

  if (!user) return null;

  const email = getEmailFallback(user);
  const initials = getInitials(email);

  return (
    <Box sx={{ ml: 1 }}>
      <IconButton
        onClick={handleMenuOpen}
        size="small"
        color="inherit"
        aria-label="user menu"
      >
        <Avatar
          sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 700 }}
          src={user.user_metadata?.avatar_url as string | undefined}
        >
          {initials}
        </Avatar>
      </IconButton>

      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, lineHeight: 1.2 }}
              >
                {email}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        <MenuItem onClick={handleMenuClose} disableRipple>
          <form action={logout}>
            <Button
              type="submit"
              startIcon={<ExitToApp />}
              color="inherit"
              sx={{ width: '100%', justifyContent: 'flex-start' }}
            >
              Logout
            </Button>
          </form>
        </MenuItem>
      </Menu>
    </Box>
  );
}
