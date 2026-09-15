import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../navigation/types';
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

const labels = {
  livro: 'LIVROS',
  filme: 'FILMES',
  serie: 'SÉRIES',
} as const;

const singular = {
  livro: 'livro',
  filme: 'filme',
  serie: 'série',
} as const;

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

  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 950;
  const isDesktop = width >= 950;

  const [search, setSearch] = useState('');
  const [remoteItems, setRemoteItems] = useState<DisplayWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiNote, setApiNote] = useState('');

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

        setApiNote(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o catálogo.',
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [kind, search]);

  const items = remoteItems;
  const highlights = items.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader navigation={navigation} />

        <View
          style={[
            styles.main,
            isDesktop && styles.mainDesktop,
            isTablet && styles.mainTablet,
          ]}
        >
          {/* título */}

          <View style={styles.titleSection}>
            <Text style={styles.eyebrow}>
              CATÁLOGO MONTENEGRO
            </Text>

            <Text style={styles.title}>
              {labels[kind]}
            </Text>

            <View style={styles.titleDecoration}>
              <View style={styles.titleLine} />

              <View style={styles.titleDot} />

              <View style={styles.titleLine} />
            </View>

            <Text style={styles.subtitle}>
              Explore, descubra e organize seus {singular[kind]} favoritos.
            </Text>
          </View>

          {/* destaques */}

          {highlights.length > 0 && (
            <View style={styles.highlightSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionKicker}>
                  EM DESTAQUE
                </Text>

                <Text style={styles.sectionTitle}>
                  Algumas descobertas para você
                </Text>
              </View>

              <View
                style={[
                  styles.highlightGrid,
                  isDesktop && styles.highlightGridDesktop,
                  isTablet && styles.highlightGridTablet,
                  isMobile && styles.highlightGridMobile,
                ]}
              >
                {highlights.map((item) => (
                  <Pressable
                    key={item.id}
                    style={({ pressed }) => [
                      styles.highlightCard,
                      isDesktop && styles.highlightCardDesktop,
                      isTablet && styles.highlightCardTablet,
                      pressed && styles.cardPressed,
                    ]}
                    onPress={() =>
                      navigation.navigate('Details', {
                        id: item.id,
                      })
                    }
                  >
                    <View style={styles.highlightImageWrapper}>
                      {item.image ? (
                        <Image
                          source={{ uri: item.image }}
                          style={styles.highlightImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.noImage}>
                          <Text style={styles.noImageSymbol}>
                            ♡
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.highlightInfo}>
                      <Text
                        style={styles.highlightTitle}
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>

                      <Text
                        style={styles.highlightCreator}
                        numberOfLines={1}
                      >
                        {item.creator}
                      </Text>

                      <View style={styles.highlightArrow}>
                        <Text style={styles.highlightArrowText}>
                          →
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* busca */}

          <View style={styles.searchSection}>
            <View style={styles.searchHeader}>
              <Text style={styles.sectionKicker}>
                EXPLORAR
              </Text>

              <Text style={styles.searchTitle}>
                Encontre sua próxima obra
              </Text>
            </View>

            <View style={styles.searchBox}>
              <View style={styles.searchIconCircle}>
                <Text style={styles.searchIcon}>
                  ⌕
                </Text>
              </View>

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={`Buscar ${singular[kind]}...`}
                placeholderTextColor="#999"
                style={styles.searchInput}
              />

              {search.length > 0 && (
                <Pressable
                  onPress={() => setSearch('')}
                  style={styles.clearButton}
                >
                  <Text style={styles.clearSearch}>
                    ×
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* carregamento */}

          {loading && (
            <View style={styles.statusBox}>
              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                Carregando catálogo...
              </Text>
            </View>
          )}

          {/* erro */}

          {!loading && apiNote !== '' && (
            <View style={styles.noteBox}>
              <View style={styles.noteIcon}>
                <Text style={styles.noteIconText}>
                  !
                </Text>
              </View>

              <View style={styles.noteContent}>
                <Text style={styles.noteTitle}>
                  Não foi possível carregar o catálogo
                </Text>

                <Text style={styles.noteText}>
                  Verifique se a API está funcionando e tente novamente.
                </Text>
              </View>
            </View>
          )}

          {/* cadastrar */}

          <View
            style={[
              styles.registerCard,
              isMobile && styles.registerCardMobile,
            ]}
          >
            <View style={styles.registerDecoration}>
              <Text style={styles.registerHeart}>
                +
              </Text>
            </View>

            <View style={styles.registerText}>
              <Text style={styles.registerSmall}>
                SENTIU FALTA DE ALGUMA COISA?
              </Text>

              <Text style={styles.registerTitle}>
                Cadastre uma nova obra
              </Text>

              <Text style={styles.registerDescription}>
                Adicione livros, filmes ou séries ao catálogo.
              </Text>
            </View>

            <Pressable
              style={styles.registerButton}
              onPress={() => navigation.navigate('AddWork')}
            >
              <Text style={styles.registerButtonText}>
                CADASTRAR
              </Text>

              <Text style={styles.registerArrow}>
                →
              </Text>
            </Pressable>
          </View>

          {/* filtros */}

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>
              FILTRAR POR
            </Text>

            <View style={styles.filterButtons}>
              <Pressable style={styles.filterButton}>
                <Text style={styles.filterText}>
                  Filtro 1
                </Text>

                <Text style={styles.filterArrow}>
                  ⌄
                </Text>
              </Pressable>

              <Pressable style={styles.filterButton}>
                <Text style={styles.filterText}>
                  Filtro 2
                </Text>

                <Text style={styles.filterArrow}>
                  ⌄
                </Text>
              </Pressable>

              <Pressable style={styles.filterButton}>
                <Text style={styles.filterText}>
                  Filtro 3
                </Text>

                <Text style={styles.filterArrow}>
                  ⌄
                </Text>
              </Pressable>
            </View>
          </View>

          {/* catálogo */}

          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <View>
                <Text style={styles.sectionKicker}>
                  CATÁLOGO
                </Text>

                <Text style={styles.listTitle}>
                  Todas as obras
                </Text>
              </View>

              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {items.length}
                </Text>
              </View>
            </View>

            {items.length === 0 ? (
              <View style={styles.emptyBox}>
                <View style={styles.emptyCircle}>
                  <Text style={styles.emptySymbol}>
                    ♡
                  </Text>
                </View>

                <Text style={styles.emptyTitle}>
                  Nenhuma obra encontrada
                </Text>

                <Text style={styles.emptyText}>
                  {search.trim()
                    ? 'Não encontramos nenhuma obra com esse nome.'
                    : 'Ainda não existem obras cadastradas nesta categoria.'}
                </Text>

                <Pressable
                  style={styles.emptyButton}
                  onPress={() => navigation.navigate('AddWork')}
                >
                  <Text style={styles.emptyButtonText}>
                    CADASTRAR OBRA
                  </Text>

                  <Text style={styles.emptyButtonArrow}>
                    →
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View
                style={[
                  styles.cards,
                  isDesktop && styles.cardsDesktop,
                  isTablet && styles.cardsTablet,
                ]}
              >
                {items.map((item) => {
                  const roundedRating = Math.max(
                    0,
                    Math.min(5, Math.round(item.rating)),
                  );

                  return (
                    <Pressable
                      key={item.id}
                      style={({ pressed }) => [
                        styles.workCard,
                        isDesktop && styles.workCardDesktop,
                        isTablet && styles.workCardTablet,
                        pressed && styles.cardPressed,
                      ]}
                      onPress={() =>
                        navigation.navigate('Details', {
                          id: item.id,
                        })
                      }
                    >
                      {/* capa grande */}

                      <View
                        style={[
                          styles.coverWrapper,
                          isDesktop && styles.coverWrapperDesktop,
                          isTablet && styles.coverWrapperTablet,
                        ]}
                      >
                        {item.image ? (
                          <Image
                            source={{ uri: item.image }}
                            style={styles.cover}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.noImageLarge}>
                            <Text style={styles.noImageSymbolLarge}>
                              ♡
                            </Text>

                            <Text style={styles.noImageText}>
                              Sem capa
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* informações */}

                      <View style={styles.workInfo}>
                        <View style={styles.typePill}>
                          <Text style={styles.typePillText}>
                            {kind === 'livro'
                              ? 'LIVRO'
                              : kind === 'filme'
                                ? 'FILME'
                                : 'SÉRIE'}
                          </Text>
                        </View>

                        <Text
                          style={styles.workTitle}
                          numberOfLines={2}
                        >
                          {item.title}
                        </Text>

                        <View style={styles.ratingRow}>
                          <Text style={styles.stars}>
                            {'★'.repeat(roundedRating)}
                            {'☆'.repeat(5 - roundedRating)}
                          </Text>

                          <Text style={styles.ratingNumber}>
                            {item.rating > 0
                              ? item.rating.toFixed(1)
                              : 'Sem avaliação'}
                          </Text>
                        </View>

                        <Text
                          style={styles.creator}
                          numberOfLines={1}
                        >
                          {item.creator}
                        </Text>

                        {(item.publisher || item.year) && (
                          <Text
                            style={styles.metadata}
                            numberOfLines={2}
                          >
                            {[item.publisher, item.year]
                              .filter(Boolean)
                              .join(' • ')}
                          </Text>
                        )}

                        <View style={styles.detailsButton}>
                          <Text style={styles.detailsButtonText}>
                            VER OBRA
                          </Text>

                          <Text style={styles.detailsArrow}>
                            →
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  page: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    paddingBottom: 45,
  },

  main: {
    width: '100%',
    paddingHorizontal: 18,
    paddingTop: 35,
  },

  mainDesktop: {
    width: '88%',
    maxWidth: 1280,
    alignSelf: 'center',
    paddingHorizontal: 0,
  },

  mainTablet: {
    width: '92%',
    alignSelf: 'center',
    paddingHorizontal: 0,
  },

  /* título */

  titleSection: {
    alignItems: 'center',
    marginBottom: 48,
  },

  eyebrow: {
    color: colors.green,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },

  title: {
    color: colors.purple,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },

  titleDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    marginBottom: 13,
  },

  titleLine: {
    width: 34,
    height: 2,
    backgroundColor: colors.green,
  },

  titleDot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: colors.yellow,
    marginHorizontal: 7,
  },

  subtitle: {
    color: '#716B78',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 550,
  },

  /* destaques */

  highlightSection: {
    marginBottom: 45,
  },

  sectionHeader: {
    marginBottom: 18,
  },

  sectionKicker: {
    color: colors.green,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: 4,
  },

  sectionTitle: {
    color: '#302A36',
    fontSize: 21,
    fontWeight: '800',
  },

  highlightGrid: {
    flexDirection: 'row',
    gap: 12,
  },

  highlightGridMobile: {
    flexDirection: 'column',
  },

  highlightGridTablet: {
    gap: 16,
  },

  highlightGridDesktop: {
    gap: 20,
  },

  highlightCard: {
    flex: 1,
    backgroundColor: '#F8F5FC',
    borderRadius: 22,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE2F3',
    minHeight: 165,
    elevation: 2,
    shadowColor: '#3A254E',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  highlightCardTablet: {
    minHeight: 190,
  },

  highlightCardDesktop: {
    minHeight: 210,
    padding: 14,
  },

  highlightImageWrapper: {
    width: 100,
    height: 145,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#EDE8F2',
  },

  highlightImage: {
    width: '100%',
    height: '100%',
  },

  noImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noImageSymbol: {
    color: colors.purple,
    fontSize: 34,
  },

  highlightInfo: {
    flex: 1,
    paddingLeft: 14,
    minHeight: 130,
    justifyContent: 'center',
  },

  highlightTitle: {
    color: '#28212F',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
  },

  highlightCreator: {
    color: '#77717D',
    fontSize: 12,
    marginTop: 7,
  },

  highlightArrow: {
    marginTop: 10,
    width: 29,
    height: 29,
    borderRadius: 20,
    backgroundColor: '#EDE4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  highlightArrowText: {
    color: colors.purple,
    fontSize: 17,
    fontWeight: '700',
  },

  /* busca */

  searchSection: {
    marginBottom: 27,
  },

  searchHeader: {
    marginBottom: 13,
  },

  searchTitle: {
    color: '#302A36',
    fontSize: 21,
    fontWeight: '800',
  },

  searchBox: {
    height: 62,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#DDD5E7',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#3A254E',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  searchIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F2ECF9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchIcon: {
    color: colors.purple,
    fontSize: 25,
  },

  searchInput: {
    flex: 1,
    color: '#29232F',
    fontSize: 15,
    paddingHorizontal: 13,
  },

  clearButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearSearch: {
    color: '#888888',
    fontSize: 25,
  },

  /* carregamento */

  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: colors.green,
  },

  statusText: {
    color: '#77717D',
    fontSize: 13,
  },

  /* erro */

  noteBox: {
    backgroundColor: '#FFF9DF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0DF91',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },

  noteIcon: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: '#F2DA6D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  noteIconText: {
    color: '#5F5013',
    fontSize: 15,
    fontWeight: '900',
  },

  noteContent: {
    flex: 1,
  },

  noteTitle: {
    color: '#5F5013',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 3,
  },

  noteText: {
    color: '#776A2C',
    fontSize: 12,
    lineHeight: 18,
  },

  /* cadastro */

  registerCard: {
    backgroundColor: colors.yellow,
    borderRadius: 25,
    padding: 21,
    marginBottom: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    overflow: 'hidden',
  },

  registerCardMobile: {
    flexWrap: 'wrap',
  },

  registerDecoration: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  registerHeart: {
    color: colors.purple,
    fontSize: 28,
    fontWeight: '500',
  },

  registerText: {
    flex: 1,
    minWidth: 160,
  },

  registerSmall: {
    color: '#76671E',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 3,
  },

  registerTitle: {
    color: '#302811',
    fontSize: 18,
    fontWeight: '900',
  },

  registerDescription: {
    color: '#665A1D',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  registerButton: {
    backgroundColor: colors.purple,
    minHeight: 45,
    paddingHorizontal: 17,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  registerArrow: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  /* filtros */

  filterSection: {
    marginBottom: 38,
  },

  filterLabel: {
    color: '#88818D',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  filterButton: {
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#DED7E5',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },

  filterText: {
    color: '#5E5667',
    fontSize: 12,
    fontWeight: '600',
  },

  filterArrow: {
    color: colors.purple,
    fontSize: 17,
  },

  /* catálogo */

  listSection: {
    marginBottom: 35,
  },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  listTitle: {
    color: '#302A36',
    fontSize: 25,
    fontWeight: '900',
  },

  countBadge: {
    minWidth: 40,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 13,
    backgroundColor: '#F1EAF8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    color: colors.purple,
    fontSize: 13,
    fontWeight: '900',
  },

  /* cards */

  cards: {
    gap: 15,
  },

  cardsTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },

  cardsDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },

  workCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#E6E0EA',
    padding: 15,
    flexDirection: 'row',
    minHeight: 245,
    elevation: 2,
    shadowColor: '#3A254E',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  workCardTablet: {
    width: '48.5%',
    minHeight: 265,
  },

  workCardDesktop: {
    width: '48.8%',
    minHeight: 285,
    padding: 17,
  },

  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  /* capas maiores */

  coverWrapper: {
    width: 155,
    height: 215,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#F0ECF4',
  },

  coverWrapperTablet: {
    width: 175,
    height: 235,
  },

  coverWrapperDesktop: {
    width: 190,
    height: 255,
    borderRadius: 16,
  },

  cover: {
    width: '100%',
    height: '100%',
  },

  noImageLarge: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noImageSymbolLarge: {
    color: colors.purple,
    fontSize: 42,
    marginBottom: 7,
  },

  noImageText: {
    color: '#8B8492',
    fontSize: 10,
  },

  /* informações */

  workInfo: {
    flex: 1,
    paddingLeft: 17,
    paddingVertical: 3,
    justifyContent: 'center',
  },

  typePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F2EBF9',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },

  typePillText: {
    color: colors.purple,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  workTitle: {
    color: '#28212F',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 23,
    marginBottom: 8,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  stars: {
    color: colors.purple,
    fontSize: 13,
    letterSpacing: 1,
  },

  ratingNumber: {
    color: '#88818D',
    fontSize: 11,
    marginLeft: 7,
  },

  creator: {
    color: '#5E5667',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5,
  },

  metadata: {
    color: '#99929F',
    fontSize: 11,
    lineHeight: 16,
  },

  detailsButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: colors.purple,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  detailsArrow: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* vazio */

  emptyBox: {
    backgroundColor: '#F8F6FA',
    borderRadius: 25,
    paddingVertical: 48,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9E4ED',
  },

  emptyCircle: {
    width: 70,
    height: 70,
    borderRadius: 25,
    backgroundColor: '#EEE7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  emptySymbol: {
    color: colors.purple,
    fontSize: 35,
  },

  emptyTitle: {
    color: '#322B39',
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 7,
    textAlign: 'center',
  },

  emptyText: {
    color: '#77717D',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 420,
  },

  emptyButton: {
    backgroundColor: colors.purple,
    borderRadius: 13,
    paddingHorizontal: 19,
    paddingVertical: 12,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  emptyButtonArrow: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});