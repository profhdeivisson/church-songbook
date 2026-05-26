'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Snackbar, Alert } from '@mui/material';
import { LoginForm } from '@/components/auth/LoginForm';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (email: string, password: string) => {
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Erro ao fazer login');
      throw err;
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) {
        throw signInError;
      }
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Erro ao fazer login com Google');
      throw err;
    }
  };

  return (
    <Container>
      <LoginForm onSubmit={handleSubmit} onGoogleSignIn={handleGoogleSignIn} />
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
