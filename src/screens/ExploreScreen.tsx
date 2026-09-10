import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList, MediaKind } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Explore'>;

const categories: { label: string; kind: MediaKind; copy: string; emoji: string }[] = [
  { label: 'Filme', kind: 'filme', copy: 'Avalie os filmes que marcaram você!', emoji: '✨' },
  { label: 'Série', kind: 'serie', copy: 'Compartilhe o que achou de uma série', emoji: '✨' },
  { label: 'Livro', kind: 'livro', copy: 'Dê sua opinião sobre grandes histórias!', emoji: '✨' },
];

const reviews = [
  { id: '1', top: false },
  { id: '2', top: true },
  { id: '3', top: false },
];

export function ExploreScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const narrow = width < 390;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>MONTENEGRO</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navRow}>
            <Pressable onPress={() => navigation.navigate('Catalog', { kind: 'livro' })}><Text style={styles.navText}>Obras</Text></Pressable>
            <Pressable onPress={() => navigation.navigate('Shelves')}><Text style={styles.navText}>Estantes</Text></Pressable>
            <Pressable onPress={() => navigation.navigate('QuickReview', { id: '1' })}><Text style={styles.navText}>Avaliações</Text></Pressable>
            <Pressable onPress={() => navigation.navigate('AddWork')}><Text style={styles.navText}>Cadastrar obras</Text></Pressable>
            <Pressable onPress={() => navigation.navigate('Profile')}><Text style={styles.navText}>Perfil</Text></Pressable>
          </ScrollView>
        </View>

        <View style={styles.hero}>
          <Text style={[styles.heroTitle, narrow && { fontSize: 27 }]}>Descubra, avalie e{`\n`}compartilhe suas{`\n`}paixões <Text style={styles.yellow}>brasileiras!</Text></Text>
          <Text style={styles.heroArt}>🎬 🍿 🎟️</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewsRow} snapToInterval={270} decelerationRate="fast">
          {reviews.map((item) => (
            <View key={item.id} style={[styles.reviewCard, item.top && styles.reviewCardFeatured]}>
              <View style={styles.reviewUserRow}>
                <View style={styles.avatar} />
                <View>
                  <Text style={styles.reviewName}>Vitória Souza</Text>
                  <Text style={styles.reviewWork}>Livro: Bom dia Verônica</Text>
                </View>
              </View>
              <Text style={styles.reviewStars}>★★★★★</Text>
              <Text style={styles.reviewText}>É uma obra simples e encantadora, mas cheia de significados profundos. A narrativa é leve, porém convida o leitor a refletir.</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>O que vai avaliar hoje?</Text>

        <View style={styles.categoryPanel}>
          {categories.map((item) => (
            <View key={item.kind} style={styles.categoryCard}>
              <View style={styles.categoryHeadingRow}>
                <Text style={styles.categoryTitle}>{item.label}</Text>
                <Text style={styles.sparkle}>{item.emoji}</Text>
              </View>
              <Text style={styles.categoryCopy}>{item.copy}</Text>
              <Pressable onPress={() => navigation.navigate('Catalog', { kind: item.kind })} style={({ pressed }) => [styles.evaluateButton, pressed && styles.pressed]}>
                <Text style={styles.evaluateText}>Avaliar</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Desenvolvedores:{`\n`}Ana Clara Rivas{`\n`}Beatriz Krisan{`\n`}Byanca Lourenço{`\n`}Gabriely Santos</Text>
          <Text style={styles.footerText}>Filme{`\n`}Série{`\n`}Livro{`\n`}Destaques{`\n`}Cadastrar obras</Text>
          <Text style={styles.footerBrand}>🎬🎟️🇧🇷{`\n`}MONTENEGRO</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  page: { paddingBottom: 0 },
  header: { marginHorizontal: 18, marginTop: 8, backgroundColor: '#3A36A6', borderRadius: 999, paddingHorizontal: 18, paddingVertical: 11 },
  brand: { color: '#fff', fontFamily: 'Cinzel_700Bold', fontSize: 20, textAlign: 'center' },
  navRow: { gap: 22, alignItems: 'center', paddingTop: 9, paddingHorizontal: 2 },
  navText: { color: '#fff', fontFamily: 'Poppins_400Regular', fontSize: 12 },
  hero: { paddingHorizontal: 26, paddingTop: 52, alignItems: 'center' },
  heroTitle: { alignSelf: 'flex-start', color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 31, lineHeight: 39 },
  yellow: { color: '#EBBC00' },
  heroArt: { fontSize: 46, marginTop: 26 },
  reviewsRow: { paddingHorizontal: 18, gap: 12, paddingTop: 44, paddingBottom: 12 },
  reviewCard: { width: 252, minHeight: 170, borderWidth: 1, borderColor: colors.purple, borderRadius: 14, padding: 14, backgroundColor: '#fff' },
  reviewCardFeatured: { transform: [{ translateY: -18 }] },
  reviewUserRow: { flexDirection: 'row', gap: 9, alignItems: 'center' },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.purple },
  reviewName: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
  reviewWork: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 8.5 },
  reviewStars: { color: '#FFD62A', fontSize: 15, letterSpacing: 1.5, marginTop: 9 },
  reviewText: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 9.5, lineHeight: 14, marginTop: 5 },
  sectionTitle: { color: colors.green, fontFamily: 'Poppins_600SemiBold', fontSize: 24, textAlign: 'center', marginTop: 42, marginBottom: 24 },
  categoryPanel: { marginHorizontal: 18, backgroundColor: '#EFEFEF', borderRadius: 24, padding: 18, gap: 14 },
  categoryCard: { backgroundColor: '#D9D9D9', borderRadius: 18, padding: 18 },
  categoryHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 27 },
  sparkle: { fontSize: 25 },
  categoryCopy: { color: '#111', fontFamily: 'Poppins_400Regular', fontSize: 13, lineHeight: 19, marginTop: 8 },
  evaluateButton: { alignSelf: 'flex-start', backgroundColor: colors.purple, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 999, marginTop: 14 },
  evaluateText: { color: '#fff', fontFamily: 'Poppins_400Regular', fontSize: 12 },
  pressed: { opacity: .72 },
  footer: { marginTop: 64, backgroundColor: colors.purple, paddingHorizontal: 22, paddingTop: 30, paddingBottom: 38, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 18 },
  footerText: { color: '#fff', fontFamily: 'Poppins_400Regular', fontSize: 11, lineHeight: 17 },
  footerBrand: { width: '100%', color: '#FFDD56', fontFamily: 'Cinzel_700Bold', fontSize: 22, textAlign: 'center', marginTop: 10 },
});