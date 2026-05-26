'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Snackbar, Alert } from '@mui/material';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (email: string, password: string, confirmPassword: string) => {
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      throw new Error('As senhas não coincidem');
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.message || 'Erro ao criar conta');
      throw err;
    }
  };

  return (
    <Container>
      <RegisterForm onSubmit={handleSubmit} />
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Conta criada com sucesso! Redirecionando...
        </Alert>
      </Snackbar>
    </Container>
  );
}
