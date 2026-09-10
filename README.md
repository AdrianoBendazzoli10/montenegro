# Montenegro

Aplicativo em **React Native + Expo + TypeScript** baseado no Figma **Montenegro — Entre Capas e Telas**, com navegação e layout pensado para smartphone.

## Rodando o projeto

```bash
npm install
npx expo start
```

Depois abra com o Expo Go no celular ou execute em um emulador Android/iOS.

## Telas implementadas

- Home / apresentação
- Login
- Cadastro
- Explorar
- Catálogo de livros
- Catálogo de filmes
- Catálogo de séries
- Detalhes da obra
- Avaliação rápida
- Avaliação detalhada
- Minhas estantes
- Perfil
- Editar perfil
- Cadastro de obras

## Estrutura

- `src/components`: componentes reutilizáveis
- `src/data`: dados demonstrativos do catálogo
- `src/navigation`: tipos e rotas
- `src/screens`: telas do aplicativo
- `src/theme`: identidade visual do Figma

## Funcionalidade atual

A navegação, formulários, seletores de nota e fluxos entre as telas funcionam localmente. O projeto ainda **não possui backend ou banco de dados**, então login, avaliações, perfil e cadastro de obras ainda não são persistidos após fechar o aplicativo.

> Algumas imagens vieram diretamente dos assets temporários do Figma. Para produção, substitua-as por arquivos locais ou por URLs permanentes.
