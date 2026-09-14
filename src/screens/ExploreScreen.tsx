import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList, MediaKind } from '../navigation/types';
import { colors } from '../theme/colors';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

const heroArt = 'https://www.figma.com/api/mcp/asset/cd25fb7b-b41a-473f-bd4f-3fcfbfef8ca1.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Explore'>;

const categories: { label: string; kind: MediaKind; copy: string }[] = [
  { label: 'Filme', kind: 'filme', copy: 'Avalie os filmes que marcaram você!' },
  { label: 'Série', kind: 'serie', copy: 'Compartilhe o que achou de uma série' },
  { label: 'Livro', kind: 'livro', copy: 'Dê sua opinião sobre grandes histórias!' },
];

const reviews = ['1', '2', '3'];

export function ExploreScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <AppHeader navigation={navigation} />

        <View style={[styles.hero, wide && styles.heroWide]}>
          <Text style={[styles.heroTitle, wide && styles.heroTitleWide]}>Descubra, avalie e{`\n`}compartilhe suas{`\n`}paixões <Text style={styles.yellow}>brasileiras!</Text></Text>
          <Image source={{ uri: heroArt }} style={[styles.heroArt, wide && styles.heroArtWide]} resizeMode="contain" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.reviewsRow, wide && styles.reviewsRowWide]} decelerationRate="fast">
          {reviews.map((id, index) => (
            <View key={id} style={[styles.reviewCard, wide && styles.reviewCardWide, index === 1 && styles.reviewCardFeatured]}>
              <View style={styles.reviewUserRow}>
                <View style={styles.avatar} />
                <View>
                  <Text style={styles.reviewName}>Vitória Souza</Text>
                  <Text style={styles.reviewWork}>Livro: Bom dia Verônica</Text>
                </View>
              </View>
              <Text style={styles.reviewStars}>★★★★★</Text>
              <Text style={styles.reviewText}>É uma obra simples e encantadora, mas cheia de significados profundos. A narrativa é leve, porém convida o leitor a refletir sobre temas como amizade, amor e a essência das pessoas.</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, wide && styles.sectionTitleWide]}>O que vai avaliar hoje?</Text>

        <View style={[styles.categoryPanel, wide && styles.categoryPanelWide]}>
          {categories.map((item) => (
            <View key={item.kind} style={[styles.categoryCard, wide && styles.categoryCardWide]}>
              <Text style={styles.categoryTitle}>{item.label} <Text style={styles.sparkle}>✦</Text></Text>
              <Text style={styles.categoryCopy}>{item.copy}</Text>
              <Pressable onPress={() => navigation.navigate('Catalog', { kind: item.kind })} style={({ pressed }) => [styles.evaluateButton, pressed && styles.pressed]}>
                <Text style={styles.evaluateText}>Avaliar</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  page: { paddingBottom: 0, backgroundColor: '#FFFFFF' },
  hero: { paddingHorizontal: 28, paddingTop: 48, alignItems: 'center' },
  heroWide: { width: '76%', maxWidth: 1090, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 70 },
  heroTitle: { alignSelf: 'flex-start', color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 29, lineHeight: 38 },
  heroTitleWide: { fontSize: 43, lineHeight: 54, width: '52%' },
  yellow: { color: '#EBBC00' },
  heroArt: { width: 220, height: 190, marginTop: 24 },
  heroArtWide: { width: 410, height: 360, marginTop: 0 },
  reviewsRow: { paddingHorizontal: 18, gap: 12, paddingTop: 44, paddingBottom: 18 },
  reviewsRowWide: { width: '100%', justifyContent: 'center', gap: 22, paddingTop: 28, overflow: 'visible' },
  reviewCard: { width: 252, minHeight: 170, borderWidth: 1, borderColor: colors.purple, borderRadius: 14, padding: 14, backgroundColor: '#FFFFFF' },
  reviewCardWide: { width: 384, minHeight: 233, padding: 26, justifyContent: 'center' },
  reviewCardFeatured: { transform: [{ translateY: -18 }] },
  reviewUserRow: { flexDirection: 'row', gap: 9, alignItems: 'center' },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.purple },
  reviewName: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
  reviewWork: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 8.5 },
  reviewStars: { color: '#FFD62A', fontSize: 15, letterSpacing: 1.5, marginTop: 9 },
  reviewText: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 9.5, lineHeight: 14, marginTop: 5 },
  sectionTitle: { color: colors.green, fontFamily: 'Poppins_600SemiBold', fontSize: 24, textAlign: 'center', marginTop: 42, marginBottom: 24 },
  sectionTitleWide: { fontSize: 34, marginTop: 70, marginBottom: 44 },
  categoryPanel: { marginHorizontal: 18, backgroundColor: '#EFEFEF', borderRadius: 24, padding: 18, gap: 14 },
  categoryPanelWide: { width: '84%', maxWidth: 1216, alignSelf: 'center', borderRadius: 40, paddingHorizontal: 126, paddingVertical: 62, flexDirection: 'row', justifyContent: 'space-between', gap: 78 },
  categoryCard: { backgroundColor: '#D9D9D9', borderRadius: 18, padding: 18 },
  categoryCardWide: { flex: 1, minHeight: 261, borderRadius: 30, padding: 28, justifyContent: 'center' },
  categoryTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 27 },
  sparkle: { color: colors.green },
  categoryCopy: { color: '#111111', fontFamily: 'Poppins_400Regular', fontSize: 13, lineHeight: 19, marginTop: 8 },
  evaluateButton: { alignSelf: 'flex-start', backgroundColor: colors.purple, minWidth: 110, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 999, marginTop: 18, alignItems: 'center' },
  evaluateText: { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontSize: 12 },
  pressed: { opacity: 0.72 },
});
