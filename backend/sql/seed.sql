USE montenegro;

INSERT IGNORE INTO works (id, title, kind, creator, publisher, year, genre, synopsis, image_url)
VALUES
(1, 'Jantar Secreto', 'livro', 'Raphael Montes', 'Companhia das Letras', 2016, 'Suspense', 'Quatro amigos tentam se manter no Rio de Janeiro e entram em um caminho cada vez mais perigoso.', 'https://www.figma.com/api/mcp/asset/724c820e-6c59-4ce4-9492-5470be894621.png'),
(2, 'O Amor Não é Óbvio', 'livro', 'Elayne Baeta', 'Galera Record', 2020, 'Romance', 'Uma história brasileira sobre afeto, descoberta e coragem para viver o que se sente.', 'https://www.figma.com/api/mcp/asset/a972e81c-6634-4a7b-bf3d-3a85b465874a.png'),
(3, 'Memórias Póstumas de Brás Cubas', 'livro', 'Machado de Assis', 'Jangada', 2018, 'Clássico', 'Um dos maiores clássicos da literatura brasileira, narrado por Brás Cubas depois de sua morte.', 'https://www.figma.com/api/mcp/asset/40a2b09c-385c-46fc-8ef6-b6eedbf64044.png'),
(4, 'Ainda Estou Aqui', 'filme', 'Walter Salles', NULL, 2024, 'Drama', 'Drama brasileiro sobre memória, família e resistência durante a ditadura militar.', 'https://www.figma.com/api/mcp/asset/4445cac2-0f4a-4d44-ba3c-f4c201f81c15.png'),
(5, 'Cidade Invisível', 'serie', 'Carlos Saldanha', NULL, 2021, 'Fantasia', 'Folclore brasileiro, investigação e fantasia em uma história ambientada no Brasil contemporâneo.', 'https://www.figma.com/api/mcp/asset/d04fcd4c-26a2-4a7a-a9b5-66fe1331b146.png');
