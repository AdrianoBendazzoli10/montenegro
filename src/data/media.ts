import type { MediaKind } from '../navigation/types';

export type MediaItem = {
  id: string;
  title: string;
  kind: MediaKind;
  year: string;
  creator: string;
  description: string;
  image: string;
  rating: number;
  tags: string[];
};

export const mediaItems: MediaItem[] = [
  {
    id: 'ainda-estou-aqui',
    title: 'Ainda Estou Aqui',
    kind: 'filme',
    year: '2024',
    creator: 'Walter Salles',
    description: 'Um drama brasileiro sobre memória, família e resistência durante a ditadura militar.',
    image: 'https://www.figma.com/api/mcp/asset/7a0b7c84-733d-4097-9251-a1d180aee954.png',
    rating: 4.8,
    tags: ['Drama', 'Brasil', 'História'],
  },
  {
    id: 'meu-pe-de-laranja-lima',
    title: 'O Meu Pé de Laranja Lima',
    kind: 'livro',
    year: '1968',
    creator: 'José Mauro de Vasconcelos',
    description: 'A história de Zezé, um menino sensível e imaginativo que encontra afeto e amizade em meio às dificuldades da infância.',
    image: 'https://www.figma.com/api/mcp/asset/4ac12476-7add-4d05-994f-bed548a904c3.png',
    rating: 4.7,
    tags: ['Literatura brasileira', 'Clássico', 'Drama'],
  },
  {
    id: 'cidade-invisivel',
    title: 'Cidade Invisível',
    kind: 'serie',
    year: '2021',
    creator: 'Carlos Saldanha',
    description: 'Folclore brasileiro, investigação e fantasia se encontram em uma história ambientada no Brasil contemporâneo.',
    image: 'https://www.figma.com/api/mcp/asset/5c89b292-7ed7-4551-afa7-264f1748410d.png',
    rating: 4.4,
    tags: ['Fantasia', 'Folclore', 'Mistério'],
  },
  {
    id: 'capitaes-da-areia',
    title: 'Capitães da Areia',
    kind: 'livro',
    year: '1937',
    creator: 'Jorge Amado',
    description: 'Um clássico sobre um grupo de jovens que vive nas ruas de Salvador.',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
    rating: 4.6,
    tags: ['Clássico', 'Bahia', 'Sociedade'],
  },
  {
    id: 'auto-da-compadecida',
    title: 'O Auto da Compadecida',
    kind: 'filme',
    year: '2000',
    creator: 'Guel Arraes',
    description: 'Comédia brasileira inspirada na obra de Ariano Suassuna.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    rating: 4.9,
    tags: ['Comédia', 'Nordeste', 'Clássico'],
  },
  {
    id: 'bom-dia-veronica',
    title: 'Bom Dia, Verônica',
    kind: 'serie',
    year: '2020',
    creator: 'Raphael Montes',
    description: 'Uma escrivã investiga casos de violência e descobre uma rede muito maior do que imaginava.',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800',
    rating: 4.3,
    tags: ['Suspense', 'Crime', 'Drama'],
  },
];

export const getMediaById = (id: string) => mediaItems.find((item) => item.id === id) ?? mediaItems[0];
export const getMediaByKind = (kind: MediaKind) => mediaItems.filter((item) => item.kind === kind);
