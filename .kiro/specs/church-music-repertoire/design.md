# Design Document

## Introduction

Este documento descreve o design técnico do aplicativo de gestão de repertório musical para igrejas. O sistema utiliza Next.js 16 com App Router, React 19, Material UI para interface, e Supabase como backend (PostgreSQL + Auth + Storage).

## High-Level Design

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js App Router (React 19)                         │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   Pages      │  │  Components  │  │   Providers  │ │ │
│  │  │  (Routes)    │  │   (MUI)      │  │   (Theme)    │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │  Auth        │  │  Storage     │      │
│  │  + RLS       │  │  (Email/     │  │  (Future)    │      │
│  │              │  │   Google)    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── ThemeProvider (MUI + dark/light mode)
│   └── AppLayout (AppBar + Drawer)
│       ├── Home Page (/)
│       │   ├── SongFilters
│       │   └── SongGrid
│       │       └── SongCard[]
│       ├── Song Detail (/song/[id])
│       │   └── SongDetailModal
│       ├── Favorites (/favorites)
│       │   └── SongGrid
│       ├── New Song (/songs/new)
│       │   └── SongForm
│       ├── Edit Song (/songs/edit/[id])
│       │   └── SongForm
│       └── Auth Pages
│           ├── LoginForm
│           ├── RegisterForm
│           └── ForgotPassword
```

### Data Flow

1. **Public Routes** (/, /song/[id])
   - Client → Next.js Server Component → Supabase (anon key) → PostgreSQL (RLS: SELECT public)
   
2. **Protected Routes** (/favorites, /songs/new, /songs/edit/[id])
   - Client → Next.js Server Component → Supabase (user session) → PostgreSQL (RLS: user-specific)

3. **Authentication Flow**
   - Client → Supabase Auth → Email/Google OAuth → Session stored in localStorage
   - Session validated via middleware on protected routes

## Database Schema

### Tables

#### songs
```sql
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  youtube_url TEXT,
  spotify_url TEXT,
  cifra_url TEXT,
  cifraclub_url TEXT,
  lyrics_url TEXT,
  other_links JSONB DEFAULT '[]'::jsonb,
  target TEXT CHECK (target IN ('adolescentes', 'jovens', 'adultos', 'criancas', 'idosos', 'todos')),
  theme TEXT CHECK (theme IN ('missao', 'salvacao', 'libertacao', 'oferta', 'louvor', 'adoracao', 'gratidao', 'perdao', 'esperanca', 'fe', 'familia', 'natal', 'pascoa', 'outro')),
  genre TEXT CHECK (genre IN ('rock', 'pop_rock', 'baiao', 'corinho_fogo', 'sertanejo', 'gospel', 'contemporaneo', 'hino', 'tradicional', 'outro')),
  tone TEXT,
  bpm INTEGER,
  observations TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_songs_target ON songs(target);
CREATE INDEX idx_songs_theme ON songs(theme);
CREATE INDEX idx_songs_genre ON songs(genre);
CREATE INDEX idx_songs_created_by ON songs(created_by);
CREATE INDEX idx_songs_title_artist ON songs USING gin(to_tsvector('portuguese', title || ' ' || artist));
```

#### favorites
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, song_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_song_id ON favorites(song_id);
```

#### user_roles
```sql
CREATE TYPE user_role AS ENUM ('admin', 'musico', 'viewer');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role user_role NOT NULL DEFAULT 'musico',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
```

### RLS Policies

#### songs table
```sql
-- Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "songs_select_public" ON songs
  FOR SELECT
  USING (true);

-- Insert: authenticated users only
CREATE POLICY "songs_insert_authenticated" ON songs
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Update: owner or admin
CREATE POLICY "songs_update_owner_or_admin" ON songs
  FOR UPDATE
  USING (
    created_by = auth.uid() 
    OR has_role(auth.uid(), 'admin')
  );

-- Delete: owner or admin
CREATE POLICY "songs_delete_owner_or_admin" ON songs
  FOR DELETE
  USING (
    created_by = auth.uid() 
    OR has_role(auth.uid(), 'admin')
  );
```

#### favorites table
```sql
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_select_own" ON favorites
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "favorites_insert_own" ON favorites
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "favorites_delete_own" ON favorites
  FOR DELETE
  USING (user_id = auth.uid());
```

#### user_roles table
```sql
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_roles_select_own" ON user_roles
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_roles_manage_admin" ON user_roles
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));
```

### Helper Functions

```sql
-- Function to check user role (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION has_role(check_user_id UUID, check_role user_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = check_user_id AND role = check_role
  );
END;
$$;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER songs_updated_at
  BEFORE UPDATE ON songs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

## API Design

### Server Functions (Next.js Server Actions)

#### Song Operations

```typescript
// src/lib/songs.functions.ts

export async function getSongs(filters?: SongFilters): Promise<Song[]>
export async function getSongById(songId: string): Promise<Song | null>
export async function createSong(data: CreateSongInput): Promise<Song>
export async function updateSong(songId: string, data: UpdateSongInput): Promise<Song>
export async function deleteSong(songId: string): Promise<void>
```

#### Favorite Operations

```typescript
// src/lib/favorites.functions.ts

export async function getUserFavorites(): Promise<Song[]>
export async function toggleFavorite(songId: string): Promise<boolean>
export async function isFavorite(songId: string): Promise<boolean>
```

#### Auth Operations

```typescript
// src/lib/auth.functions.ts

export async function signUp(email: string, password: string): Promise<void>
export async function signIn(email: string, password: string): Promise<void>
export async function signInWithGoogle(): Promise<void>
export async function signOut(): Promise<void>
export async function resetPassword(email: string): Promise<void>
export async function updatePassword(newPassword: string): Promise<void>
export async function getCurrentUser(): Promise<User | null>
```

## UI/UX Design

### Theme Configuration

```typescript
// Light Theme
{
  palette: {
    primary: { main: '#1e3a5f' },      // Indigo profundo
    secondary: { main: '#c9a84c' },    // Dourado
    background: {
      default: '#fafbfc',
      paper: '#ffffff'
    },
    error: { main: '#e85d3a' }         // Coral suave
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1-h6: { fontWeight: 500-700 },
    body1-2: { fontWeight: 400 }
  }
}

// Dark Theme
{
  palette: {
    primary: { main: '#1e3a5f' },
    secondary: { main: '#c9a84c' },
    background: {
      default: '#0d1b2a',
      paper: '#1a2332'
    },
    error: { main: '#e85d3a' }
  }
}
```

### Responsive Breakpoints

| Breakpoint | Width | Cards/Row | Filters | Navigation |
|------------|-------|-----------|---------|------------|
| xs | <600px | 1 | Drawer | Hamburger |
| sm | 600-900px | 2 | Inline | Hamburger |
| md | 900-1200px | 3 | Sidebar | Inline |
| lg | >1200px | 4 | Sidebar | Inline |

### Component Specifications

#### SongCard
- Elevation: 2 (default) → 4 (hover)
- Border radius: 12px
- Transition: 0.2s all
- Hover: translateY(-4px)
- Content: title, artist, chips (target, theme, genre), platform icons, tone/BPM
- Actions: favorite, share, edit (conditional)

#### SongFilters
- Layout: Grid responsive (1-4 columns)
- Fields: search (text), target (select), theme (select), genre (select)
- Search: debounced 300ms
- Updates: query params for shareable URLs

#### SongForm
- Validation: Zod schema
- Required: title, artist
- Optional: all links, metadata, observations
- Layout: 2-column grid on md+
- Actions: save, cancel

#### SongDetailModal
- Max width: sm (600px)
- Sections: header, metadata, links, observations
- Actions: favorite, share, edit, delete (conditional)
- Platform icons: YouTube (#FF0000), Spotify (#1DB954), Cifra Club (#FF8C00)

## Security Design

### Authentication
- Email/password with email confirmation
- Google OAuth via Supabase Auth
- HIBP integration for password breach detection
- Session stored in localStorage (Supabase SDK)
- Automatic token refresh

### Authorization
- RLS policies enforce data access at database level
- Middleware protects routes requiring authentication
- Role-based access via `user_roles` table
- `has_role()` function with SECURITY DEFINER prevents RLS recursion

### Data Protection
- Service role key never exposed to client
- Anon key used for public routes
- User session token for authenticated routes
- HTTPS only in production
- Input validation via Zod schemas

## Performance Considerations

### Database
- Indexes on frequently queried columns (target, theme, genre, created_by)
- Full-text search index on title + artist
- Connection pooling via Supabase

### Frontend
- Server Components for initial page load
- Client Components only where interactivity needed
- Optimistic updates for favorites
- Debounced search input (300ms)
- Lazy loading for images
- Code splitting by route

### Caching
- Next.js automatic caching for Server Components
- Revalidation on mutations
- Browser cache for static assets

## Deployment

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Build Process
1. `yarn build` - Next.js production build
2. Database migrations via Supabase CLI
3. Deploy to Vercel/similar platform
4. Configure custom domain + SSL

### Monitoring
- Supabase dashboard for database metrics
- Vercel analytics for frontend performance
- Error tracking (Sentry recommended)
