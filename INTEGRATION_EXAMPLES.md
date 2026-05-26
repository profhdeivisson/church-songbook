# 🔌 Exemplos de Integração

Este documento mostra como conectar os componentes UI existentes com as Server Actions do Supabase.

## 📋 Índice

1. [Página Home - Listar Músicas](#1-página-home---listar-músicas)
2. [Página de Favoritos](#2-página-de-favoritos)
3. [Formulário de Nova Música](#3-formulário-de-nova-música)
4. [Card de Música com Favorito](#4-card-de-música-com-favorito)
5. [Formulários de Login/Registro](#5-formulários-de-loginregistro)
6. [Layout com Usuário Autenticado](#6-layout-com-usuário-autenticado)

---

## 1. Página Home - Listar Músicas

**Arquivo:** `app/page.tsx`

```tsx
import { getSongs } from '@/actions/songs';
import { SongGrid } from '@/components/songs/SongGrid';
import { SongFilters } from '@/components/songs/SongFilters';
import { Container, Box } from '@mui/material';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string; target?: string; theme?: string; genre?: string };
}) {
  // Buscar músicas com filtros da URL
  const songs = await getSongs({
    search: searchParams.search,
    target: searchParams.target as any,
    theme: searchParams.theme as any,
    genre: searchParams.genre as any,
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <SongFilters />
      </Box>
      <SongGrid songs={songs} />
    </Container>
  );
}
```

---

## 2. Página de Favoritos

**Arquivo:** `app/favorites/page.tsx`

```tsx
import { getFavorites } from '@/actions/songs';
import { SongGrid } from '@/components/songs/SongGrid';
import { Container, Typography, Box } from '@mui/material';
import { EmptyState } from '@/components/common/EmptyState';
import { Favorite } from '@mui/icons-material';

export default async function FavoritesPage() {
  const favorites = await getFavorites();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Minhas Músicas Favoritas
      </Typography>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<Favorite sx={{ fontSize: 80 }} />}
          title="Nenhum favorito ainda"
          description="Comece a favoritar músicas para vê-las aqui"
        />
      ) : (
        <Box sx={{ mt: 4 }}>
          <SongGrid songs={favorites} />
        </Box>
      )}
    </Container>
  );
}
```

---

## 3. Formulário de Nova Música

**Arquivo:** `app/songs/new/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Snackbar, Alert } from '@mui/material';
import { SongForm } from '@/components/songs/SongForm';
import { createSong } from '@/actions/songs';
import type { Song } from '@/types/song';

export default function NewSongPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(data: Partial<Song>) {
    setLoading(true);
    setError(null);

    try {
      await createSong(data);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar música');
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    router.back();
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <SongForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={loading}
      />

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
          Música criada com sucesso!
        </Alert>
      </Snackbar>
    </Container>
  );
}
```

---

## 4. Card de Música com Favorito

**Arquivo:** `src/components/songs/SongCard.tsx` (atualizar)

Adicione esta função no componente:

```tsx
'use client';

import { useState } from 'react';
import { toggleFavorite } from '@/actions/songs';
// ... outros imports

export function SongCard({ song, isFavorited = false }: SongCardProps) {
  const [isFav, setIsFav] = useState(isFavorited);
  const [loading, setLoading] = useState(false);

  async function handleFavoriteClick(e: React.MouseEvent) {
    e.stopPropagation(); // Evita abrir o modal
    setLoading(true);

    try {
      await toggleFavorite(song.id);
      setIsFav(!isFav);
    } catch (error) {
      console.error('Erro ao favoritar:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      {/* ... resto do card */}
      <IconButton
        onClick={handleFavoriteClick}
        disabled={loading}
        sx={{
          color: isFav ? 'error.main' : 'text.secondary',
        }}
      >
        {isFav ? <Favorite /> : <FavoriteBorder />}
      </IconButton>
      {/* ... resto do card */}
    </Card>
  );
}
```

---

## 5. Formulários de Login/Registro

### Login Form

**Arquivo:** `src/components/auth/LoginForm.tsx` (atualizar)

```tsx
'use client';

import { useState } from 'react';
import { login } from '@/actions/auth';
import { TextField, Button, Box, Alert } from '@mui/material';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
      }
      // Se não houver erro, o redirect acontece automaticamente
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        required
        name="email"
        type="email"
        label="Email"
        margin="normal"
      />

      <TextField
        fullWidth
        required
        name="password"
        type="password"
        label="Senha"
        margin="normal"
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 3 }}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </Box>
  );
}
```

### Register Form

**Arquivo:** `src/components/auth/RegisterForm.tsx` (atualizar)

```tsx
'use client';

import { useState } from 'react';
import { signup } from '@/actions/auth';
import { TextField, Button, Box, Alert } from '@mui/material';

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Validar senhas
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      }
      // Se não houver erro, o redirect acontece automaticamente
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        required
        name="name"
        label="Nome"
        margin="normal"
      />

      <TextField
        fullWidth
        required
        name="email"
        type="email"
        label="Email"
        margin="normal"
      />

      <TextField
        fullWidth
        required
        name="password"
        type="password"
        label="Senha"
        margin="normal"
      />

      <TextField
        fullWidth
        required
        name="confirmPassword"
        type="password"
        label="Confirmar Senha"
        margin="normal"
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 3 }}
      >
        {loading ? 'Criando conta...' : 'Criar Conta'}
      </Button>
    </Box>
  );
}
```

---

## 6. Layout com Usuário Autenticado

**Arquivo:** `src/components/layout/AppLayout.tsx` (atualizar)

Adicione no topo do componente:

```tsx
import { getUser } from '@/actions/auth';
import { logout } from '@/actions/auth';

// Dentro do componente, adicione:
const user = await getUser();

// No menu, adicione botão de logout:
<MenuItem onClick={async () => {
  'use server';
  await logout();
}}>
  <ListItemIcon>
    <Logout fontSize="small" />
  </ListItemIcon>
  Sair
</MenuItem>

// Mostre o nome do usuário:
{user && (
  <Typography variant="body2">
    Olá, {user.user_metadata?.name || user.email}
  </Typography>
)}
```

---

## 🎯 Checklist de Integração

- [ ] Configurar Supabase (ver `SUPABASE_SETUP.md`)
- [ ] Atualizar `app/page.tsx` com `getSongs()`
- [ ] Atualizar `app/favorites/page.tsx` com `getFavorites()`
- [ ] Atualizar `app/songs/new/page.tsx` com `createSong()`
- [ ] Atualizar `SongCard.tsx` com `toggleFavorite()`
- [ ] Atualizar `LoginForm.tsx` com `login()`
- [ ] Atualizar `RegisterForm.tsx` com `signup()`
- [ ] Atualizar `AppLayout.tsx` com `getUser()` e `logout()`
- [ ] Adicionar loading states em todos os componentes
- [ ] Adicionar tratamento de erros com Snackbars
- [ ] Testar todas as funcionalidades

---

## 🚀 Dicas

1. **Use 'use client'** apenas quando necessário (formulários, estados, eventos)
2. **Server Components** são melhores para buscar dados (mais rápidos)
3. **Revalidate paths** já está configurado nas Server Actions
4. **Erros** devem ser tratados com try/catch e mostrados ao usuário
5. **Loading states** melhoram a UX durante operações assíncronas

---

## 📚 Recursos

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
