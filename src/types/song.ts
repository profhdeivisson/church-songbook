export type Target = 
  | 'adolescentes'
  | 'jovens'
  | 'adultos'
  | 'criancas'
  | 'idosos'
  | 'todos';

export type Theme =
  | 'missao'
  | 'salvacao'
  | 'libertacao'
  | 'oferta'
  | 'louvor'
  | 'adoracao'
  | 'gratidao'
  | 'perdao'
  | 'esperanca'
  | 'fe'
  | 'familia'
  | 'natal'
  | 'pascoa'
  | 'outro';

export type Genre =
  | 'rock'
  | 'pop_rock'
  | 'baiao'
  | 'corinho_fogo'
  | 'sertanejo'
  | 'gospel'
  | 'contemporaneo'
  | 'hino'
  | 'tradicional'
  | 'outro';

export interface OtherLink {
  name: string;
  url: string;
  icon?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  youtube_url?: string;
  spotify_url?: string;
  cifra_url?: string;
  cifraclub_url?: string;
  lyrics_url?: string;
  other_links?: OtherLink[];
  target?: Target;
  theme?: Theme;
  genre?: Genre;
  tone?: string;
  bpm?: number;
  observations?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SongFilters {
  search?: string;
  target?: Target;
  theme?: Theme;
  genre?: Genre;
}
