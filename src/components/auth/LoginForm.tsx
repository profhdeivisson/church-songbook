'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link as MuiLink,
  Divider,
} from '@mui/material';
import { Google } from '@mui/icons-material';
import Link from 'next/link';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
}

export function LoginForm({ onSubmit, onGoogleSignIn }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSubmit(email, password);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      await onGoogleSignIn();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login com Google');
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Login
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mb: 2 }}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <MuiLink component={Link} href="/forgot-password" variant="body2">
            Esqueceu a senha?
          </MuiLink>
        </Box>

        <Divider sx={{ my: 2 }}>ou</Divider>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<Google />}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          sx={{ mb: 2 }}
        >
          Entrar com Google
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Não tem uma conta?{' '}
            <MuiLink component={Link} href="/register">
              Cadastre-se
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
