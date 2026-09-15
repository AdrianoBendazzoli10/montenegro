import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList, MediaKind } from '../navigation/types';
import { colors } from '../theme/colors';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

const heroArt =
  'https://www.figma.com/api/mcp/asset/cd25fb7b-b41a-473f-bd4f-3fcfbfef8ca1.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Explore'>;

const categories: {
  label: string;
  kind: MediaKind;
  copy: string;
  symbol: string;
  background: string;
}[] = [
  {
    label: 'Filmes',
    kind: 'filme',
    copy:
      'Avalie os filmes que marcaram você e descubra novas histórias.',
    symbol: '✦',
    background: '#FFF7D7',
  },
  {
    label: 'Séries',
    kind: 'serie',
    copy:
      'Compartilhe o que achou de uma série e veja outras opiniões.',
    symbol: '◌',
    background: '#EAF6ED',
  },
  {
    label: 'Livros',
    kind: 'livro',
    copy:
      'Dê sua opinião sobre grandes histórias e encontre sua próxima leitura.',
    symbol: '♡',
    background: '#F0EAF4',
  },
];

const reviews = [
  {
    name: 'Vitória Souza',
    work: 'Bom dia, Verônica',
    kind: 'Livro',
    text:
      'É uma obra simples e encantadora, mas cheia de significados profundos. A narrativa convida o leitor a refletir sobre amizade, amor e a essência das pessoas.',
  },
  {
    name: 'Lucas Almeida',
    work: 'Ainda Estou Aqui',
    kind: 'Filme',
    text:
      'Uma história marcante e emocionante. A forma como a narrativa é construída faz com que cada momento permaneça na memória depois dos créditos.',
  },
  {
    name: 'Marina Costa',
    work: 'Cidade Invisível',
    kind: 'Série',
    text:
      'Uma produção que mistura fantasia e cultura brasileira de uma maneira muito interessante. Os personagens tornam a experiência ainda mais envolvente.',
  },
];

export function ExploreScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
      >
        <AppHeader navigation={navigation} />

        {/* hero */}
        <View style={[styles.hero, wide && styles.heroWide]}>
          <View style={styles.heroContent}>
            <View style={styles.heroTag}>
              <View style={styles.heroTagDot} />

              <Text style={styles.heroTagText}>
                EXPLORE O MONTENEGRO
              </Text>
            </View>

            <Text
              style={[
                styles.heroTitle,
                wide && styles.heroTitleWide,
              ]}
            >
              Descubra, avalie e{'\n'}
              compartilhe suas{'\n'}
              paixões{' '}
              <Text style={styles.yellow}>brasileiras!</Text>
            </Text>

            <Text
              style={[
                styles.heroDescription,
                wide && styles.heroDescriptionWide,
              ]}
            >
              Encontre livros, filmes e séries, descubra novas
              histórias e compartilhe suas opiniões com a comunidade.
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate('Catalog', {
                  kind: 'livro',
                })
              }
              style={({ pressed }) => [
                styles.heroButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.heroButtonText}>
                EXPLORAR CATÁLOGO
              </Text>

              <Text style={styles.heroButtonArrow}>→</Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.heroImageWrapper,
              wide && styles.heroImageWrapperWide,
            ]}
          >
            <View style={styles.heroCircle} />

            <Image
              source={{ uri: heroArt }}
              style={[
                styles.heroArt,
                wide && styles.heroArtWide,
              ]}
              resizeMode="contain"
            />

            <View style={styles.heroFloatingCard}>
              <Text style={styles.floatingSymbol}>✦</Text>

              <View>
                <Text style={styles.floatingTitle}>
                  Sua próxima paixão
                </Text>

                <Text style={styles.floatingText}>
                  pode estar aqui.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* avaliações */}
        <View style={styles.reviewsSection}>
          <View
            style={[
              styles.sectionHeader,
              wide && styles.sectionHeaderWide,
            ]}
          >
            <View>
              <Text style={styles.sectionEyebrow}>
                DA COMUNIDADE
              </Text>

              <Text
                style={[
                  styles.sectionTitle,
                  wide && styles.sectionTitleWide,
                ]}
              >
                O que estão dizendo?
              </Text>
            </View>

            <Text style={styles.sectionDescription}>
              Histórias também ganham significado quando
              compartilhamos o que sentimos sobre elas.
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.reviewsRow,
              wide && styles.reviewsRowWide,
            ]}
            decelerationRate="fast"
          >
            {reviews.map((review, index) => (
              <View
                key={review.name}
                style={[
                  styles.reviewCard,
                  wide && styles.reviewCardWide,
                  index === 1 && styles.reviewCardFeatured,
                ]}
              >
                <View style={styles.reviewTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {review.name.charAt(0)}
                    </Text>
                  </View>

                  <View style={styles.reviewUser}>
                    <Text style={styles.reviewName}>
                      {review.name}
                    </Text>

                    <Text style={styles.reviewWork}>
                      {review.kind} · {review.work}
                    </Text>
                  </View>
                </View>

                <Text style={styles.reviewStars}>
                  ★★★★★
                </Text>

                <Text style={styles.reviewText}>
                  “{review.text}”
                </Text>

                <View style={styles.reviewBottom}>
                  <View style={styles.reviewLine} />

                  <Text style={styles.reviewLabel}>
                    AVALIAÇÃO DA COMUNIDADE
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* categorias */}
        <View
          style={[
            styles.discoverySection,
            wide && styles.discoverySectionWide,
          ]}
        >
          <View style={styles.discoveryIntro}>
            <View style={styles.discoveryIcon}>
              <Text style={styles.discoveryIconText}>✦</Text>
            </View>

            <View style={styles.discoveryText}>
              <Text style={styles.sectionEyebrow}>
                COMECE POR UMA HISTÓRIA
              </Text>

              <Text
                style={[
                  styles.discoveryTitle,
                  wide && styles.discoveryTitleWide,
                ]}
              >
                O que você quer avaliar hoje?
              </Text>

              <Text style={styles.discoveryDescription}>
                Escolha uma categoria e encontre uma obra para
                conhecer, assistir ou ler.
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.categoryPanel,
              wide && styles.categoryPanelWide,
            ]}
          >
            {categories.map((item, index) => (
              <View
                key={item.kind}
                style={[
                  styles.categoryCard,
                  wide && styles.categoryCardWide,
                  {
                    backgroundColor: item.background,
                  },
                ]}
              >
                <View style={styles.categoryTop}>
                  <View style={styles.categoryIcon}>
                    <Text style={styles.categoryIconText}>
                      {item.symbol}
                    </Text>
                  </View>

                  <Text style={styles.categoryNumber}>
                    0{index + 1}
                  </Text>
                </View>

                <Text style={styles.categoryTitle}>
                  {item.label}
                </Text>

                <Text style={styles.categoryCopy}>
                  {item.copy}
                </Text>

                <Pressable
                  onPress={() =>
                    navigation.navigate('Catalog', {
                      kind: item.kind,
                    })
                  }
                  style={({ pressed }) => [
                    styles.evaluateButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.evaluateText}>
                    EXPLORAR
                  </Text>

                  <Text style={styles.evaluateArrow}>
                    →
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* frase final */}
        <View
          style={[
            styles.finalQuote,
            wide && styles.finalQuoteWide,
          ]}
        >
          <View style={styles.quoteLine} />

          <Text style={styles.quoteSymbol}>“</Text>

          <Text
            style={[
              styles.quoteText,
              wide && styles.quoteTextWide,
            ]}
          >
            Toda história pode se tornar uma memória.
          </Text>

          <Text style={styles.quoteSubtext}>
            Encontre a próxima no Montenegro.
          </Text>

          <View style={styles.quoteLine} />
        </View>

        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  page: {
    paddingBottom: 0,
    backgroundColor: '#FFFFFF',
  },

  /* hero */

  hero: {
    paddingHorizontal: 25,
    paddingTop: 42,
    paddingBottom: 30,
  },

  heroWide: {
    width: '82%',
    maxWidth: 1180,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 65,
    paddingBottom: 55,
  },

  heroContent: {
    flex: 1,
    maxWidth: 650,
  },

  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 13,
  },

  heroTagDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.green,
  },

  heroTagText: {
    color: colors.green,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7.5,
    letterSpacing: 1.8,
  },

  heroTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 30,
    lineHeight: 39,
  },

  heroTitleWide: {
    fontSize: 48,
    lineHeight: 58,
  },

  yellow: {
    color: '#D6AA00',
  },

  heroDescription: {
    color: '#77707D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 14,
    maxWidth: 430,
  },

  heroDescriptionWide: {
    fontSize: 12,
    lineHeight: 20,
    marginTop: 18,
  },

  heroButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 19,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 22,
  },

  heroButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8.5,
    letterSpacing: 0.7,
  },

  heroButtonArrow: {
    color: '#FFFFFF',
    fontSize: 15,
  },

  heroImageWrapper: {
    width: '100%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  heroImageWrapperWide: {
    width: 500,
    height: 400,
  },

  heroCircle: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#F2EAF5',
    right: '15%',
  },

  heroArt: {
    width: 260,
    height: 225,
    zIndex: 2,
  },

  heroArtWide: {
    width: 470,
    height: 390,
  },

  heroFloatingCard: {
    position: 'absolute',
    zIndex: 3,
    bottom: 12,
    left: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5DFE8',
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 9,
    shadowColor: '#2C193E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  floatingSymbol: {
    color: colors.green,
    fontSize: 18,
  },

  floatingTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8,
  },

  floatingText: {
    color: '#8B838F',
    fontFamily: 'Poppins_400Regular',
    fontSize: 7.5,
  },

  /* avaliações */

  reviewsSection: {
    marginTop: 15,
  },

  sectionHeader: {
    paddingHorizontal: 22,
    marginBottom: 8,
  },

  sectionHeaderWide: {
    width: '82%',
    maxWidth: 1180,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  sectionEyebrow: {
    color: colors.green,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7,
    letterSpacing: 1.7,
  },

  sectionTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    marginTop: 2,
  },

  sectionTitleWide: {
    fontSize: 34,
  },

  sectionDescription: {
    maxWidth: 350,
    color: '#837B88',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'right',
  },

  reviewsRow: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
    gap: 13,
  },

  reviewsRowWide: {
    width: '100%',
    justifyContent: 'center',
    paddingTop: 28,
    paddingBottom: 35,
    gap: 20,
  },

  reviewCard: {
    width: 275,
    minHeight: 205,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3DDE6',
    borderRadius: 18,
    padding: 17,
    shadowColor: '#2C193E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 9,
    elevation: 1,
  },

  reviewCardWide: {
    width: 370,
    minHeight: 250,
    padding: 24,
  },

  reviewCardFeatured: {
    borderColor: colors.purple,
    transform: [{ translateY: -14 }],
  },

  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  avatar: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },

  reviewUser: {
    flex: 1,
  },

  reviewName: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
  },

  reviewWork: {
    color: '#8B838F',
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
    marginTop: 1,
  },

  reviewStars: {
    color: '#E8BD19',
    fontSize: 15,
    letterSpacing: 2,
    marginTop: 13,
  },

  reviewText: {
    color: '#273342',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    lineHeight: 15,
    marginTop: 7,
  },

  reviewBottom: {
    marginTop: 'auto',
  },

  reviewLine: {
    height: 1,
    backgroundColor: '#EAE5EC',
    marginTop: 14,
    marginBottom: 7,
  },

  reviewLabel: {
    color: '#AAA1AE',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 6.5,
    letterSpacing: 1.1,
  },

  /* descoberta */

  discoverySection: {
    paddingHorizontal: 20,
    paddingTop: 38,
    paddingBottom: 30,
  },

  discoverySectionWide: {
    width: '84%',
    maxWidth: 1216,
    alignSelf: 'center',
    paddingHorizontal: 0,
    paddingTop: 65,
    paddingBottom: 55,
  },

  discoveryIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 22,
  },

  discoveryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFDF5A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  discoveryIconText: {
    color: colors.green,
    fontSize: 22,
  },

  discoveryText: {
    flex: 1,
  },

  discoveryTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 23,
    marginTop: 1,
  },

  discoveryTitleWide: {
    fontSize: 34,
  },

  discoveryDescription: {
    color: '#817985',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 2,
  },

  categoryPanel: {
    backgroundColor: '#F4F2F5',
    borderRadius: 25,
    padding: 13,
    gap: 12,
  },

  categoryPanelWide: {
    flexDirection: 'row',
    padding: 25,
    gap: 20,
    borderRadius: 34,
  },

  categoryCard: {
    borderRadius: 19,
    padding: 19,
    minHeight: 205,
  },

  categoryCardWide: {
    flex: 1,
    minHeight: 275,
    borderRadius: 25,
    padding: 25,
  },

  categoryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  categoryIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryIconText: {
    color: colors.purple,
    fontSize: 20,
  },

  categoryNumber: {
    color: '#AAA0AC',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8,
    letterSpacing: 1,
  },

  categoryTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 26,
    marginTop: 17,
  },

  categoryCopy: {
    color: '#45404A',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 5,
    maxWidth: 290,
  },

  evaluateButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 20,
  },

  evaluateText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7.5,
    letterSpacing: 0.7,
  },

  evaluateArrow: {
    color: '#FFFFFF',
    fontSize: 13,
  },

  /* frase final */

  finalQuote: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 55,
  },

  finalQuoteWide: {
    paddingTop: 60,
    paddingBottom: 80,
  },

  quoteLine: {
    width: 35,
    height: 2,
    backgroundColor: colors.green,
    borderRadius: 2,
    marginVertical: 10,
  },

  quoteSymbol: {
    color: '#D8CDE0',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 30,
    lineHeight: 32,
  },

  quoteText: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: -4,
  },

  quoteTextWide: {
    fontSize: 27,
  },

  quoteSubtext: {
    color: '#938A99',
    fontFamily: 'Poppins_400Regular',
    fontSize: 8.5,
    marginTop: 5,
  },

  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
});