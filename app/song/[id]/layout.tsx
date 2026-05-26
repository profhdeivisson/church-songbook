import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // TODO: Buscar música do banco de dados
  // Por enquanto, retorna metadados genéricos
  
  return {
    title: 'Música - Repertório Musical',
    description: 'Veja os detalhes desta música no nosso repertório',
    openGraph: {
      title: 'Música - Repertório Musical',
      description: 'Veja os detalhes desta música no nosso repertório',
      type: 'website',
    },
  };
}

export default function SongLayout({ children }: { children: React.ReactNode }) {
  return children;
}
