import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { getMediaByKind } from '../data/media';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Catalog'>;

const labels = { livro: 'LIVROS', filme: 'FILMES', serie: 'SÉRIES' } as const;
const singular = { livro: 'livro', filme: 'filme', serie: 'série' } as const;

export function CatalogScreen({ navigation, route }: Props) {
  const kind = route.params.kind;
  const items = getMediaByKind(kind);
  const highlights = items.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></Pressable>
          <Text style={styles.brand}>MONTENEGRO</Text>
          <Pressable onPress={() => navigation.navigate('Profile')}><Text style={styles.profile}>●</Text></Pressable>
        </View>

        <Text style={styles.pageTitle}>{labels[kind]}</Text>
        <Text style={styles.highlightTitle}>Destaques ✨</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlightRow} snapToInterval={238} decelerationRate="fast">
          {highlights.map((item, index) => (
            <Pressable key={item.id} onPress={() => navigation.navigate('Details', { id: item.id })} style={[styles.highlightCard, index === 1 && styles.highlightFilled]}>
              <Image source={{ uri: item.image }} style={styles.highlightImage} resizeMode="cover" />
              <View style={styles.highlightInfo}>
                <Text numberOfLines={2} style={[styles.highlightName, index === 1 && styles.whiteText]}>{item.title}</Text>
                <Text style={styles.smallStars}>★★★★★</Text>
                <Text style={[styles.highlightKind, index === 1 && styles.whiteText]}>{singular[kind]}</Text>
                <Text numberOfLines={4} style={[styles.highlightCopy, index === 1 && styles.whiteText]}>“É uma obra simples e encantadora, mas cheia de significados profundos.”</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.searchBlock}>
          <Text style={styles.searchPrompt}>Pesquise um {singular[kind]} para avaliar ou ver as avaliações feitas!</Text>
          <TextInput placeholder="Pesquisar" placeholderTextColor="#AEB3B9" style={styles.searchInput} />
        </View>

        <View style={styles.callout}>
          <Text style={styles.calloutText}>Sentiu falta de algum {singular[kind]}?{`\n`}Cadastre ele no nosso sistema!</Text>
          <Pressable onPress={() => navigation.navigate('AddWork')} style={styles.calloutButton}><Text style={styles.calloutButtonText}>Cadastrar um novo {singular[kind]}!</Text></Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {['Filtro 1⌄', 'Filtro 2⌄', 'Filtro 3⌄'].map((filter) => <View key={filter} style={styles.filter}><Text style={styles.filterText}>{filter}</Text></View>)}
        </ScrollView>

        <View style={styles.list}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.cover} resizeMode="cover" />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.stars}>★★★★★</Text>
                <Text style={styles.meta}>{kind === 'livro' ? 'Autor' : 'Criador'}: {item.creator}</Text>
                <Text style={styles.meta}>Ano: {item.year}</Text>
                <Pressable onPress={() => navigation.navigate('Details', { id: item.id })} style={styles.reviewButton}>
                  <Text style={styles.reviewButtonText}>Quero avaliar esse {singular[kind]}!  ◉</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.more}>Mostrar mais</Text>
        <View style={styles.footer}><Text style={styles.footerBrand}>MONTENEGRO</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  page: { paddingBottom: 0 },
  header: { marginHorizontal: 18, marginTop: 8, height: 54, backgroundColor: colors.purple, borderRadius: 999, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { color: '#fff', fontSize: 34, lineHeight: 36 },
  brand: { color: '#fff', fontFamily: 'Cinzel_700Bold', fontSize: 19 },
  profile: { color: '#fff', fontSize: 16 },
  pageTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 31, textAlign: 'center', marginTop: 34 },
  highlightTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 21, textAlign: 'center', marginTop: 24 },
  highlightRow: { paddingHorizontal: 18, gap: 12, marginTop: 22, paddingBottom: 5 },
  highlightCard: { width: 226, minHeight: 150, borderWidth: 1, borderColor: colors.green, borderRadius: 14, padding: 12, flexDirection: 'row', backgroundColor: '#fff' },
  highlightFilled: { backgroundColor: colors.green },
  highlightImage: { width: 72, height: 108, borderRadius: 6, alignSelf: 'center' },
  highlightInfo: { flex: 1, paddingLeft: 10 },
  highlightName: { color: '#111', fontFamily: 'Poppins_600SemiBold', fontSize: 11, lineHeight: 15 },
  highlightKind: { color: '#111', fontFamily: 'Poppins_400Regular', fontSize: 8, marginTop: 1 },
  highlightCopy: { color: '#111', fontFamily: 'Poppins_400Regular', fontSize: 7.5, lineHeight: 10.5, marginTop: 6 },
  smallStars: { color: '#FFD326', fontSize: 10, letterSpacing: .5, marginTop: 2 },
  whiteText: { color: '#fff' },
  searchBlock: { marginHorizontal: 22, marginTop: 48 },
  searchPrompt: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 18, lineHeight: 25, textAlign: 'center', marginBottom: 18 },
  searchInput: { height: 50, borderWidth: 1.5, borderColor: '#001A38', borderRadius: 999, paddingHorizontal: 20, color: '#001A38', fontFamily: 'Poppins_400Regular' },
  callout: { marginHorizontal: 22, marginTop: 24, backgroundColor: '#FFDB57', borderRadius: 15, padding: 20, alignItems: 'center' },
  calloutText: { color: colors.green, fontFamily: 'Poppins_600SemiBold', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  calloutButton: { borderWidth: 1, borderColor: colors.green, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 7, marginTop: 12 },
  calloutButtonText: { color: colors.green, fontFamily: 'Poppins_600SemiBold', fontSize: 10 },
  filters: { paddingHorizontal: 22, gap: 12, marginTop: 24 },
  filter: { minWidth: 108, height: 36, borderWidth: 1, borderColor: '#001A38', borderRadius: 999, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  filterText: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 11 },
  list: { paddingHorizontal: 22, marginTop: 34, gap: 34 },
  itemRow: { flexDirection: 'row', gap: 18, alignItems: 'flex-start' },
  cover: { width: 112, height: 160, borderRadius: 8, backgroundColor: '#eee' },
  itemInfo: { flex: 1, paddingTop: 4 },
  itemTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 18, lineHeight: 24 },
  stars: { color: '#FFD326', fontSize: 16, letterSpacing: 1, marginTop: 6 },
  meta: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 18, marginTop: 2 },
  reviewButton: { alignSelf: 'flex-start', borderWidth: 1.3, borderColor: '#001A38', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, marginTop: 13 },
  reviewButtonText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 9.5 },
  more: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 12, textAlign: 'center', textDecorationLine: 'underline', marginVertical: 38 },
  footer: { backgroundColor: colors.purple, paddingVertical: 34 },
  footerBrand: { color: '#FFDD56', fontFamily: 'Cinzel_700Bold', fontSize: 24, textAlign: 'center' },
});