export type MediaKind = 'livro' | 'filme' | 'serie';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Explore: undefined;
  Catalog: { kind: MediaKind };
  Details: { id: string };
  QuickReview: { id: string };
  DetailedReview: { id: string };
  Shelves: undefined;
  Profile: undefined;
  EditProfile: undefined;
  AddWork: undefined;
};
