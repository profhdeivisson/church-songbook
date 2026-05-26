'use client';

import {
  Add,
  Favorite,
  Home,
  Menu as MenuIcon,
  MusicNote,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

const drawerWidth = 240;

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  protected?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Início', href: '/', icon: <Home /> },
  {
    label: 'Favoritos',
    href: '/favorites',
    icon: <Favorite />,
    protected: true,
  },
  { label: 'Nova Música', href: '/songs/new', icon: <Add />, protected: true },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <Toolbar>
        <MusicNote sx={{ mr: 1 }} />
        <Typography variant="h6" noWrap>
          Repertório
        </Typography>
      </Toolbar>
      <List>
        {navItems.map(item => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton component={Link} href={item.href}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <MusicNote sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Repertório Musical
          </Typography>
          <ThemeToggle />
          <UserMenu />
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
