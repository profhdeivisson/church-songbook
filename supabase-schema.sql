-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create songs table
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    youtube_url TEXT,
    spotify_url TEXT,
    cifra_url TEXT,
    cifraclub_url TEXT,
    lyrics_url TEXT,
    other_links JSONB,
    target TEXT,
    theme TEXT,
    genre TEXT,
    tone TEXT,
    bpm INTEGER,
    observations TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, song_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS songs_created_by_idx ON public.songs(created_by);
CREATE INDEX IF NOT EXISTS songs_title_idx ON public.songs(title);
CREATE INDEX IF NOT EXISTS songs_artist_idx ON public.songs(artist);
CREATE INDEX IF NOT EXISTS songs_target_idx ON public.songs(target);
CREATE INDEX IF NOT EXISTS songs_theme_idx ON public.songs(theme);
CREATE INDEX IF NOT EXISTS songs_genre_idx ON public.songs(genre);
CREATE INDEX IF NOT EXISTS songs_created_at_idx ON public.songs(created_at DESC);

CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_song_id_idx ON public.favorites(song_id);
CREATE INDEX IF NOT EXISTS favorites_created_at_idx ON public.favorites(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for songs table
-- Anyone can read songs
CREATE POLICY "Songs are viewable by everyone" 
    ON public.songs FOR SELECT 
    USING (true);

-- Only authenticated users can insert songs
CREATE POLICY "Authenticated users can insert songs" 
    ON public.songs FOR INSERT 
    WITH CHECK (auth.uid() = created_by);

-- Users can update their own songs
CREATE POLICY "Users can update their own songs" 
    ON public.songs FOR UPDATE 
    USING (auth.uid() = created_by);

-- Users can delete their own songs
CREATE POLICY "Users can delete their own songs" 
    ON public.songs FOR DELETE 
    USING (auth.uid() = created_by);

-- RLS Policies for favorites table
-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites" 
    ON public.favorites FOR SELECT 
    USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can insert their own favorites" 
    ON public.favorites FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites" 
    ON public.favorites FOR DELETE 
    USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on songs table
CREATE TRIGGER on_songs_updated
    BEFORE UPDATE ON public.songs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
