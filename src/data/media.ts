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
    image: 'https://www.figma.com/api/mcp/asset/4445cac2-0f4a-4d44-ba3c-f4c201f81c15.png',
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
    image: 'https://www.figma.com/api/mcp/asset/9f946260-5296-444c-aa1a-e8cf7a75012a.png',
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
    image: 'https://www.figma.com/api/mcp/asset/d04fcd4c-26a2-4a7a-a9b5-66fe1331b146.png',
    rating: 4.4,
    tags: ['Fantasia', 'Folclore', 'Mistério'],
  },
  {
    id: 'jantar-secreto',
    title: 'Jantar Secreto',
    kind: 'livro',
    year: '2016',
    creator: 'Raphael Montes',
    description: 'Um thriller brasileiro intenso de Raphael Montes.',
    image: 'https://www.figma.com/api/mcp/asset/453c77c4-6a67-4516-812a-70d6476d6edd.png',
    rating: 4.5,
    tags: ['Suspense', 'Thriller', 'Brasil'],
  },
  {
    id: 'o-amor-nao-e-obvio',
    title: 'O Amor Não é Óbvio',
    kind: 'livro',
    year: '2020',
    creator: 'Elayne Baeta',
    description: 'Romance brasileiro contemporâneo publicado pela Galera Record.',
    image: 'https://www.figma.com/api/mcp/asset/a972e81c-6634-4a7b-bf3d-3a85b465874a.png',
    rating: 4.6,
    tags: ['Romance', 'Juvenil', 'Brasil'],
  },
  {
    id: 'memorias-postumas',
    title: 'Memórias Póstumas de Brás Cubas',
    kind: 'livro',
    year: '1881',
    creator: 'Machado de Assis',
    description: 'Um dos maiores clássicos da literatura brasileira.',
    image: 'https://www.figma.com/api/mcp/asset/40a2b09c-385c-46fc-8ef6-b6eedbf64044.png',
    rating: 4.8,
    tags: ['Clássico', 'Machado de Assis', 'Literatura'],
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
