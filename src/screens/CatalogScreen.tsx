import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { getMediaByKind } from '../data/media';
import { colors } from '../theme/colors';
import { api, type ApiWork } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'Catalog'>;

type DisplayWork = {
  id: string;
  title: string;
  creator: string;
  year?: number | null;
  publisher?: string | null;
  image: string;
  rating: number;
};

const labels = { livro: 'LIVROS', filme: 'FILMES', serie: 'SÉRIES' } as const;
const singular = { livro: 'livro', filme: 'filme', serie: 'série' } as const;

function fromApi(item: ApiWork): DisplayWork {
  return {
    id: String(item.id),
    title: item.title,
    creator: item.creator,
    year: item.year,
    publisher: item.publisher,
    image: item.image_url || '',
    rating: Number(item.rating || 0),
  };
}

export function CatalogScreen({ navigation, route }: Props) {
  const kind = route.params.kind;
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const [search, setSearch] = useState('');
  const [remoteItems, setRemoteItems] = useState<DisplayWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiNote, setApiNote] = useState('');

  const fallbackItems = useMemo<DisplayWork[]>(() => getMediaByKind(kind).map((item) => ({
    id: item.id,
    title: item.title,
    creator: item.creator,
    year: item.year,
    publisher: undefined,
    image: item.image,
    rating: item.rating,
  })), [kind]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await api.listWorks(kind, search);
        if (!active) return;
        setRemoteItems(response.works.map(fromApi));
        setApiNote('');
      } catch (error) {
        if (!active) return;
        setRemoteItems([]);
        setApiNote(error instanceof Error ? error.message : 'Catálogo offline: exibindo dados demonstrativos.');
      } finally {
        if (active) setLoading(false);
      }
    }, 300);
    return () => { active = false; clearTimeout(timer); };
  }, [kind, search]);

  const items = remoteItems.length ? remoteItems : fallbackItems.filter((item) => item.title.toLowerCase().includes(search.trim().toLowerCase()));
  const highlights = items.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <AppHeader navigation={navigation} />

        <Text style={[styles.pageTitle, wide && styles.pageTitleWide]}>{labels[kind]}</Text>
        <Text style={[styles.highlightTitle, wide && styles.highlightTitleWide]}>Destaques ✧</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.highlightRow, wide && styles.highlightRowWide]} decelerationRate="fast">
          {highlights.map((item, index) => (
            <Pressable key={item.id} onPress={() => navigation.navigate('Details', { id: item.id })} style={[styles.highlightCard, wide && styles.highlightCardWide, index === 1 && styles.highlightFilled]}>
              {item.image ? <Image source={{ uri: item.image }} style={[styles.highlightImage, wide && styles.highlightImageWide]} resizeMode="cover" /> : <View style={[styles.highlightImage, styles.imagePlaceholder]} />}
              <View style={styles.highlightInfo}>
                <Text numberOfLines={2} style={[styles.highlightName, index === 1 && styles.whiteText]}>{item.title}</Text>
                <Text style={styles.smallStars}>★★★★★</Text>
                <Text style={[styles.highlightKind, index === 1 && styles.whiteText]}>{singular[kind]}</Text>
                <Text numberOfLines={4} style={[styles.highlightCopy, index === 1 && styles.whiteText]}>“É uma obra simples e encantadora, mas cheia de significados profundos.”</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={[styles.searchBlock, wide && styles.searchBlockWide]}>
          <Text style={[styles.searchPrompt, wide && styles.searchPromptWide]}>Pesquise um {singular[kind]} para avaliar{`\n`}ou ver as avaliações feitas!</Text>
          <View style={[styles.searchDivider, wide && styles.searchDividerWide]} />
          <TextInput value={search} onChangeText={setSearch} placeholder="Pesquisar" placeholderTextColor="#AEB3B9" style={[styles.searchInput, wide && styles.searchInputWide]} />
        </View>

        {apiNote ? <Text style={styles.apiNote}>{apiNote}</Text> : null}
        {loading ? <Text style={styles.loading}>Carregando catálogo...</Text> : null}

        <View style={[styles.callout, wide && styles.calloutWide]}>
          <Text style={[styles.calloutText, wide && styles.calloutTextWide]}>Sentiu falta de algum {singular[kind]}?{`\n`}Cadastre ele no nosso sistema!</Text>
          <Pressable onPress={() => navigation.navigate('AddWork')} style={styles.calloutButton}><Text style={styles.calloutButtonText}>Cadastre um novo {singular[kind]}!</Text></Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filters, wide && styles.filtersWide]}>
          {['Filtro 1⌄', 'Filtro 2⌄', 'Filtro 3⌄'].map((filter) => <View key={filter} style={styles.filter}><Text style={styles.filterText}>{filter}</Text></View>)}
        </ScrollView>

        <View style={[styles.list, wide && styles.listWide]}>
          {items.map((item) => (
            <View key={item.id} style={[styles.itemRow, wide && styles.itemRowWide]}>
              {item.image ? <Image source={{ uri: item.image }} style={[styles.cover, wide && styles.coverWide]} resizeMode="cover" /> : <View style={[styles.cover, styles.imagePlaceholder]} />}
              <View style={styles.itemInfo}>
                <Text style={[styles.itemTitle, wide && styles.itemTitleWide]}>{item.title}</Text>
                <Text style={styles.stars}>★★★★★</Text>
                <Text style={styles.meta}>{kind === 'livro' ? 'Autor' : 'Criador'}: {item.creator}</Text>
                {item.publisher ? <Text style={styles.meta}>Editora: {item.publisher}</Text> : null}
                {item.year ? <Text style={styles.meta}>Ano: {item.year}</Text> : null}
                <Pressable onPress={() => navigation.navigate('Details', { id: item.id })} style={styles.reviewButton}>
                  <Text style={styles.reviewButtonText}>Quero avaliar esse {singular[kind]}!  ◉</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.more}>Mostrar mais</Text>
        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  page: { paddingBottom: 0, backgroundColor: '#FFFFFF' },
  pageTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 31, textAlign: 'center', marginTop: 34 },
  pageTitleWide: { fontSize: 44, marginTop: 58 },
  highlightTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 21, textAlign: 'center', marginTop: 24 },
  highlightTitleWide: { fontSize: 32, marginTop: 36 },
  highlightRow: { paddingHorizontal: 18, gap: 12, marginTop: 22, paddingBottom: 5 },
  highlightRowWide: { justifyContent: 'center', gap: 20, width: '100%', marginTop: 48 },
  highlightCard: { width: 226, minHeight: 150, borderWidth: 1, borderColor: colors.green, borderRadius: 14, padding: 12, flexDirection: 'row', backgroundColor: '#FFFFFF' },
  highlightCardWide: { width: 425, minHeight: 230, padding: 18, borderRadius: 20 },
  highlightFilled: { backgroundColor: colors.green },
  highlightImage: { width: 72, height: 108, borderRadius: 6, alignSelf: 'center' },
  highlightImageWide: { width: 145, height: 210, borderRadius: 15 },
  imagePlaceholder: { backgroundColor: '#ECECEC' },
  highlightInfo: { flex: 1, paddingLeft: 10, justifyContent: 'center' },
  highlightName: { color: '#111111', fontFamily: 'Poppins_600SemiBold', fontSize: 12, lineHeight: 16 },
  highlightKind: { color: '#111111', fontFamily: 'Poppins_400Regular', fontSize: 9, marginTop: 2 },
  highlightCopy: { color: '#111111', fontFamily: 'Poppins_400Regular', fontSize: 8.5, lineHeight: 12, marginTop: 7 },
  smallStars: { color: '#FFD326', fontSize: 11, letterSpacing: 0.5, marginTop: 3 },
  whiteText: { color: '#FFFFFF' },
  searchBlock: { marginHorizontal: 22, marginTop: 48, gap: 18 },
  searchBlockWide: { width: '82%', maxWidth: 1175, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 120 },
  searchPrompt: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 18, lineHeight: 25, textAlign: 'center' },
  searchPromptWide: { textAlign: 'left', fontSize: 28, lineHeight: 39, width: '47%' },
  searchDivider: { display: 'none' },
  searchDividerWide: { display: 'flex', width: 1, height: 120, backgroundColor: '#001A38' },
  searchInput: { height: 50, borderWidth: 1.5, borderColor: '#001A38', borderRadius: 999, paddingHorizontal: 20, color: '#001A38', fontFamily: 'Poppins_400Regular' },
  searchInputWide: { width: '43%', height: 70, fontSize: 18 },
  apiNote: { marginHorizontal: 22, marginTop: 14, color: '#7A5C00', fontFamily: 'Poppins_400Regular', fontSize: 11, textAlign: 'center' },
  loading: { color: colors.purple, textAlign: 'center', fontFamily: 'Poppins_400Regular', fontSize: 12, marginTop: 12 },
  callout: { marginHorizontal: 22, marginTop: 30, backgroundColor: '#FFDD56', borderRadius: 15, padding: 20, alignItems: 'center' },
  calloutWide: { width: '82%', maxWidth: 1171, alignSelf: 'center', minHeight: 230, borderRadius: 20, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 44, marginTop: 65 },
  calloutText: { color: colors.green, fontFamily: 'Poppins_600SemiBold', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  calloutTextWide: { fontSize: 25, lineHeight: 34, textAlign: 'right' },
  calloutButton: { borderWidth: 1, borderColor: colors.green, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 7, marginTop: 12 },
  calloutButtonText: { color: colors.green, fontFamily: 'Poppins_600SemiBold', fontSize: 10 },
  filters: { paddingHorizontal: 22, gap: 12, marginTop: 24 },
  filtersWide: { width: '64%', alignSelf: 'center', justifyContent: 'space-between', marginTop: 76 },
  filter: { minWidth: 108, height: 36, borderWidth: 1, borderColor: '#001A38', borderRadius: 999, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  filterText: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 11 },
  list: { paddingHorizontal: 22, marginTop: 34, gap: 34 },
  listWide: { width: '82%', maxWidth: 1171, alignSelf: 'center', marginTop: 75, gap: 52 },
  itemRow: { flexDirection: 'row', gap: 18, alignItems: 'flex-start' },
  itemRowWide: { gap: 68, minHeight: 390 },
  cover: { width: 112, height: 160, borderRadius: 8, backgroundColor: '#EEEEEE' },
  coverWide: { width: 277, height: 390, borderRadius: 12 },
  itemInfo: { flex: 1, paddingTop: 4, justifyContent: 'center' },
  itemTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 18, lineHeight: 24 },
  itemTitleWide: { fontSize: 31, lineHeight: 42 },
  stars: { color: '#FFD326', fontSize: 16, letterSpacing: 1, marginTop: 6 },
  meta: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 18, marginTop: 2 },
  reviewButton: { alignSelf: 'flex-start', borderWidth: 1.3, borderColor: '#001A38', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, marginTop: 16 },
  reviewButtonText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 9.5 },
  more: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 12, textAlign: 'center', textDecorationLine: 'underline', marginVertical: 38 },
});
