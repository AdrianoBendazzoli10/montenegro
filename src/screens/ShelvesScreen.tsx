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
import { api, type ApiShelf } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'Shelves'>;

const demoShelves = [
  {
    title: 'Saga Favorita',
    images: [
      'https://www.figma.com/api/mcp/asset/b15c343d-8b8f-42ba-9d3b-09783c491219.png',
      'https://www.figma.com/api/mcp/asset/d76c5b08-993b-4486-a8e6-d79f80d9e7f5.png',
      'https://www.figma.com/api/mcp/asset/ce5f2f2f-e04d-4f1b-a488-f82754c1cce9.png',
      'https://www.figma.com/api/mcp/asset/bdb972b5-6b4f-4fcd-ba34-d74d5c15a0af.png',
    ],
  },
  {
    title: 'Nostalgia',
    images: [
      'https://www.figma.com/api/mcp/asset/e4ecd34f-13ac-4d51-9b80-fa4086223f7c.png',
      'https://www.figma.com/api/mcp/asset/17854abf-51c0-424e-bde3-1fc88cd2462c.png',
      'https://www.figma.com/api/mcp/asset/435c6a91-74b3-4f43-928e-7b988fe30882.png',
      'https://www.figma.com/api/mcp/asset/a58587a5-84ca-4061-b586-ed4b7a099cf3.png',
    ],
  },
  {
    title: 'Favoritos de terror',
    images: [
      'https://www.figma.com/api/mcp/asset/37f41b69-c9fe-4388-8fbb-6502843a199a.png',
      'https://www.figma.com/api/mcp/asset/133f6863-3f88-4830-8750-d3686c4f82dc.png',
      'https://www.figma.com/api/mcp/asset/fc51ac93-2e20-4244-8c3e-14bf36833a88.png',
      'https://www.figma.com/api/mcp/asset/0692bfb7-519e-4dff-91d9-7880b60c05c0.png',
    ],
  },
  {
    title: 'Nós',
    images: [
      'https://www.figma.com/api/mcp/asset/466ce8c2-290d-48f7-9594-71d21f1b4151.png',
      'https://www.figma.com/api/mcp/asset/6ade13d5-9499-407c-944a-619f167e446d.png',
      'https://www.figma.com/api/mcp/asset/71c232a4-c0d2-471c-830f-94b085be07dd.png',
      'https://www.figma.com/api/mcp/asset/c78d60ad-9232-49bd-a180-5d4ba0fa6a3c.png',
    ],
  },
];

export function ShelvesScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;

  const [shelves, setShelves] = useState<ApiShelf[]>([]);
  const [status, setStatus] = useState('');
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  async function loadShelves() {
    try {
      const response = await api.listShelves();
      setShelves(response.shelves);
      setStatus('');
    } catch (error) {
      setShelves([]);
      setStatus(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar suas estantes.',
      );
    }
  }

  useEffect(() => {
    loadShelves();
  }, []);

  async function createShelf() {
    if (!newName.trim()) return;

    try {
      const response = await api.createShelf(newName.trim());

      setShelves((old) => [
        ...old,
        {
          ...response.shelf,
          items: response.shelf.items || [],
        },
      ]);

      setNewName('');
      setCreating(false);
      setStatus('');
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Não foi possível criar a estante.',
      );
    }
  }

  const visible = shelves.length
    ? shelves.map((shelf) => ({
        id: shelf.id,
        title: shelf.name,
        images: shelf.items
          .map((item) => item.image_url || '')
          .filter(Boolean),
      }))
    : demoShelves.map((shelf, index) => ({
        id: -(index + 1),
        ...shelf,
      }));

  function editShelf(id: number) {
    if (id < 0) {
      setStatus(
        'As estantes de demonstração são apenas visuais. Crie uma estante para poder editá-la.',
      );
      return;
    }

    navigation.navigate('EditShelf', {
      shelfId: id,
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
        keyboardShouldPersistTaps="handled"
      >
        <AppHeader navigation={navigation} />

        {/* cabeçalho da página */}
        <View style={[styles.pageHeader, wide && styles.pageHeaderWide]}>
          <View style={styles.titleLine}>
            <View style={styles.titleDecoration} />

            <Text style={[styles.title, wide && styles.titleWide]}>
              ESTANTES
            </Text>

            <View style={styles.titleDecoration} />
          </View>

          <Text style={[styles.subtitle, wide && styles.subtitleWide]}>
            Organize suas histórias do seu jeito.
          </Text>
        </View>

        {status ? (
          <View style={styles.statusBox}>
            <Text style={styles.status}>{status}</Text>
          </View>
        ) : null}

        {/* lista de estantes */}
        <View style={[styles.shelvesContainer, wide && styles.shelvesContainerWide]}>
          {visible.map((shelf, shelfIndex) => (
            <View
              key={shelf.id}
              style={[
                styles.shelfBlock,
                wide && styles.shelfBlockWide,
              ]}
            >
              {/* topo da estante */}
              <View
                style={[
                  styles.shelfTop,
                  wide && styles.shelfTopWide,
                ]}
              >
                <View style={styles.shelfTopInfo}>
                  <View style={styles.shelfNumber}>
                    <Text style={styles.shelfNumberText}>
                      {String(shelfIndex + 1).padStart(2, '0')}
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.shelfSmallLabel}>
                      MINHA ESTANTE
                    </Text>

                    <Text
                      style={[
                        styles.shelfTitleTop,
                        wide && styles.shelfTitleTopWide,
                      ]}
                      numberOfLines={1}
                    >
                      {shelf.title}
                    </Text>
                  </View>
                </View>

                <Text style={styles.bookCount}>
                  {shelf.images.length}{' '}
                  {shelf.images.length === 1 ? 'obra' : 'obras'}
                </Text>
              </View>

              {/* livros */}
              <View
                style={[
                  styles.purpleStrip,
                  wide && styles.purpleStripWide,
                ]}
              >
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.booksRow,
                    wide && styles.booksRowWide,
                  ]}
                  decelerationRate="fast"
                >
                  {shelf.images.length ? (
                    shelf.images.map((img, index) => (
                      <View
                        key={`${shelf.id}-${index}`}
                        style={[
                          styles.bookCard,
                          wide && styles.bookCardWide,
                        ]}
                      >
                        <View style={styles.bookShadow}>
                          <Image
                            source={{ uri: img }}
                            style={[
                              styles.book,
                              wide && styles.bookWide,
                            ]}
                            resizeMode="cover"
                          />
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyShelf}>
                      <View style={styles.emptyIconCircle}>
                        <Text style={styles.emptyIcon}>♡</Text>
                      </View>

                      <Text style={styles.emptyTitle}>
                        Estante vazia
                      </Text>

                      <Text style={styles.emptyText}>
                        Adicione uma obra para começar sua coleção.
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>

              {/* informações da estante */}
              <View
                style={[
                  styles.yellowStrip,
                  wide && styles.yellowStripWide,
                ]}
              >
                <View style={styles.shelfInfo}>
                  <Text style={styles.shelfLabel}>
                    COLEÇÃO
                  </Text>

                  <Text
                    style={[
                      styles.shelfTitle,
                      wide && styles.shelfTitleWide,
                    ]}
                    numberOfLines={1}
                  >
                    {shelf.title}
                  </Text>
                </View>

                <Pressable
                  onPress={() => editShelf(shelf.id)}
                  style={({ pressed }) => [
                    styles.editButton,
                    pressed && styles.editButtonPressed,
                  ]}
                >
                  <Text style={styles.editIcon}>✎</Text>
                  <Text style={styles.editText}>
                    EDITAR
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* nova estante */}
        {creating ? (
          <View
            style={[
              styles.newShelfForm,
              wide && styles.newShelfFormWide,
            ]}
          >
            <View style={styles.formHeader}>
              <View style={styles.formIcon}>
                <Text style={styles.formIconText}>+</Text>
              </View>

              <View>
                <Text style={styles.formTitle}>
                  NOVA ESTANTE
                </Text>

                <Text style={styles.formSubtitle}>
                  Dê um nome para sua nova coleção.
                </Text>
              </View>
            </View>

            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Nome da nova estante"
              placeholderTextColor="#9993A1"
              style={styles.newShelfInput}
              autoFocus
            />

            <View style={styles.newShelfActions}>
              <Pressable
                onPress={() => {
                  setCreating(false);
                  setNewName('');
                }}
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.cancelButtonPressed,
                ]}
              >
                <Text style={styles.cancelText}>
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={createShelf}
                style={({ pressed }) => [
                  styles.createButton,
                  pressed && styles.createButtonPressed,
                ]}
              >
                <Text style={styles.createButtonText}>
                  Criar estante
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => setCreating(true)}
            style={({ pressed }) => [
              styles.newShelf,
              wide && styles.newShelfWide,
              pressed && styles.newShelfPressed,
            ]}
          >
            <View style={styles.plusCircle}>
              <Text style={styles.plus}>+</Text>
            </View>

            <View style={styles.newShelfInfo}>
              <Text
                style={[
                  styles.newShelfText,
                  wide && styles.newShelfTextWide,
                ]}
              >
                Nova Estante
              </Text>

              <Text style={styles.newShelfHint}>
                Crie um novo espaço para suas histórias
              </Text>
            </View>

            <Text style={styles.newShelfArrow}>→</Text>
          </Pressable>
        )}

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

  /* cabeçalho */

  pageHeader: {
    alignItems: 'center',
    paddingTop: 34,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },

  pageHeaderWide: {
    paddingTop: 55,
    paddingBottom: 42,
  },

  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },

  titleDecoration: {
    width: 32,
    height: 1,
    backgroundColor: colors.purple,
    opacity: 0.35,
  },

  title: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 30,
    letterSpacing: 3,
  },

  titleWide: {
    fontSize: 44,
    letterSpacing: 5,
  },

  subtitle: {
    color: '#85818A',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    marginTop: 7,
    letterSpacing: 0.3,
  },

  subtitleWide: {
    fontSize: 13,
    marginTop: 10,
  },

  statusBox: {
    alignSelf: 'center',
    width: '90%',
    maxWidth: 900,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#FFF4F4',
    borderWidth: 1,
    borderColor: '#F0D1D1',
  },

  status: {
    color: '#B00020',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    textAlign: 'center',
  },

  /* estantes */

  shelvesContainer: {
    width: '100%',
  },

  shelvesContainerWide: {
    paddingHorizontal: 35,
  },

  shelfBlock: {
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },

  shelfBlockWide: {
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    marginBottom: 34,
    borderRadius: 18,
    overflow: 'hidden',
  },

  shelfTop: {
    minHeight: 68,
    paddingHorizontal: 20,
    paddingVertical: 11,
    backgroundColor: '#F8F6FA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EDE9F0',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#EDE9F0',
  },

  shelfTopWide: {
    minHeight: 82,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },

  shelfTopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  shelfNumber: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  shelfNumberText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.5,
  },

  shelfSmallLabel: {
    color: '#9993A1',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7,
    letterSpacing: 1.7,
    marginBottom: 2,
  },

  shelfTitleTop: {
    color: '#281A38',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
  },

  shelfTitleTopWide: {
    fontSize: 21,
  },

  bookCount: {
    color: '#77717E',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    marginLeft: 10,
  },

  /* livros */

  purpleStrip: {
    backgroundColor: colors.purple,
    paddingVertical: 24,
  },

  purpleStripWide: {
    minHeight: 315,
    paddingVertical: 28,
    justifyContent: 'center',
  },

  booksRow: {
    paddingHorizontal: 20,
    gap: 16,
    alignItems: 'center',
  },

  booksRowWide: {
    width: '100%',
    justifyContent: 'space-around',
    paddingHorizontal: 55,
    gap: 35,
  },

  bookCard: {
    padding: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  bookCardWide: {
    padding: 7,
    borderRadius: 15,
  },

  bookShadow: {
    shadowColor: '#000000',
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 7,
  },

  book: {
    width: 110,
    height: 166,
    borderRadius: 7,
    backgroundColor: '#EEEEEE',
  },

  bookWide: {
    width: 205,
    height: 315,
    borderRadius: 11,
  },

  /* estante vazia */

  emptyShelf: {
    minWidth: 280,
    minHeight: 175,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  emptyIcon: {
    color: '#FFFFFF',
    fontSize: 22,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginBottom: 3,
  },

  emptyText: {
    color: 'rgba(255,255,255,0.68)',
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    textAlign: 'center',
    maxWidth: 260,
  },

  /* faixa inferior */

  yellowStrip: {
    minHeight: 82,
    backgroundColor: '#F0D66A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },

  yellowStripWide: {
    minHeight: 112,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },

  shelfInfo: {
    flex: 1,
  },

  shelfLabel: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7,
    letterSpacing: 2,
    opacity: 0.65,
    marginBottom: 1,
  },

  shelfTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 21,
  },

  shelfTitleWide: {
    fontSize: 29,
  },

  editButton: {
    minHeight: 38,
    borderWidth: 1.2,
    borderColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  editButtonPressed: {
    opacity: 0.55,
    transform: [{ scale: 0.96 }],
  },

  editIcon: {
    color: colors.purple,
    fontSize: 13,
  },

  editText: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
    letterSpacing: 0.8,
  },

  /* nova estante */

  newShelf: {
    width: '90%',
    maxWidth: 650,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginTop: 22,
    marginBottom: 42,
    paddingHorizontal: 17,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E1DCE5',
    borderRadius: 16,
    backgroundColor: '#FBFAFC',
  },

  newShelfWide: {
    marginTop: 30,
    marginBottom: 55,
    paddingHorizontal: 22,
    paddingVertical: 17,
  },

  newShelfPressed: {
    opacity: 0.65,
    transform: [{ scale: 0.985 }],
  },

  plusCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  plus: {
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 27,
    fontFamily: 'Poppins_400Regular',
  },

  newShelfInfo: {
    flex: 1,
  },

  newShelfText: {
    color: '#281A38',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },

  newShelfTextWide: {
    fontSize: 18,
  },

  newShelfHint: {
    color: '#85818A',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    marginTop: 2,
  },

  newShelfArrow: {
    color: colors.purple,
    fontSize: 22,
    marginRight: 3,
  },

  /* formulário */

  newShelfForm: {
    width: '90%',
    maxWidth: 650,
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 42,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E1DDE5',
    borderRadius: 17,
    backgroundColor: '#FBFAFC',
  },

  newShelfFormWide: {
    padding: 28,
    marginTop: 32,
    marginBottom: 55,
  },

  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 17,
  },

  formIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  formIconText: {
    color: '#FFFFFF',
    fontSize: 22,
  },

  formTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    letterSpacing: 1,
  },

  formSubtitle: {
    color: '#85818A',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    marginTop: 1,
  },

  newShelfInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D8D3DE',
    borderRadius: 11,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    color: '#281A38',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },

  newShelfActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 15,
  },

  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  cancelButtonPressed: {
    opacity: 0.5,
  },

  cancelText: {
    color: '#4D4654',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },

  createButton: {
    backgroundColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },

  createButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },

  createButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
