import { useEffect, useMemo, useState } from 'react';
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
import { api, type ApiShelf, type ApiWork } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'EditShelf'>;

function kindLabel(kind: ApiWork['kind']) {
  if (kind === 'filme') return 'filme';
  if (kind === 'serie') return 'série';
  return 'livro';
}

export function EditShelfScreen({ navigation, route }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const shelfId = route.params.shelfId;

  const [shelf, setShelf] = useState<ApiShelf | null>(null);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [allWorks, setAllWorks] = useState<ApiWork[]>([]);

  async function load() {
    try {
      const response = await api.listShelves();

      const selected = response.shelves.find(
        (item) => item.id === shelfId,
      );

      if (!selected) {
        setStatus('Estante não encontrada.');
        return;
      }

      setShelf(selected);
      setName(selected.name);
      setStatus('');
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar a estante.',
      );
    }
  }

  useEffect(() => {
    load();
  }, [shelfId]);

  const availableWorks = useMemo(() => {
    const ids = new Set(
      (shelf?.items || []).map((item) => item.id),
    );

    const term = search.trim().toLowerCase();

    return allWorks.filter((item) => {
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.creator.toLowerCase().includes(term);

      return !ids.has(item.id) && matchesSearch;
    });
  }, [allWorks, search, shelf]);

  async function saveChanges() {
    if (!shelf || !name.trim()) {
      setStatus('Informe um nome para a estante.');
      return;
    }

    try {
      setSaving(true);

      const response = await api.renameShelf(
        shelf.id,
        name.trim(),
      );

      setShelf((current) =>
        current
          ? {
              ...current,
              name: response.shelf.name,
            }
          : current,
      );

      setEditingName(false);
      setStatus('Alterações salvas.');
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar as alterações.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeWork(workId: number) {
    if (!shelf) return;

    try {
      await api.removeShelfItem(shelf.id, workId);

      setShelf({
        ...shelf,
        items: shelf.items.filter(
          (item) => item.id !== workId,
        ),
      });

      setStatus('Obra removida da estante.');
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Não foi possível remover a obra.',
      );
    }
  }

  async function openAddWorks() {
    setShowAdd(true);

    if (allWorks.length) return;

    try {
      const response = await api.listWorks();

      setAllWorks(response.works);
      setStatus('');
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar as obras.',
      );
    }
  }

  async function addWork(work: ApiWork) {
    if (!shelf) return;

    try {
      await api.addShelfItem(shelf.id, work.id);

      setShelf({
        ...shelf,
        items: [...shelf.items, work],
      });

      setStatus(`${work.title} foi adicionado à estante.`);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Não foi possível adicionar a obra.',
      );
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
        keyboardShouldPersistTaps="handled"
      >
        <AppHeader navigation={navigation} />

        {/* título */}
        <View
          style={[
            styles.pageHeader,
            wide && styles.pageHeaderWide,
          ]}
        >
          <View style={styles.titleLine}>
            <View style={styles.titleDecoration} />

            <Text
              style={[
                styles.pageTitle,
                wide && styles.pageTitleWide,
              ]}
            >
              EDITAR ESTANTE
            </Text>

            <View style={styles.titleDecoration} />
          </View>

          <Text
            style={[
              styles.pageSubtitle,
              wide && styles.pageSubtitleWide,
            ]}
          >
            Organize sua coleção do seu jeito.
          </Text>
        </View>

        {/* área principal da estante */}
        <View
          style={[
            styles.shelfArea,
            wide && styles.shelfAreaWide,
          ]}
        >
          {/* identificação */}
          <View
            style={[
              styles.shelfHeader,
              wide && styles.shelfHeaderWide,
            ]}
          >
            <View style={styles.shelfHeaderInfo}>
              <View style={styles.shelfIcon}>
                <Text style={styles.shelfIconText}>
                  ♡
                </Text>
              </View>

              <View style={styles.shelfHeaderText}>
                <Text style={styles.shelfLabel}>
                  ESTANTE
                </Text>

                {editingName ? (
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    style={[
                      styles.nameInput,
                      wide && styles.nameInputWide,
                    ]}
                    autoFocus
                  />
                ) : (
                  <Text
                    style={[
                      styles.shelfName,
                      wide && styles.shelfNameWide,
                    ]}
                    numberOfLines={1}
                  >
                    {shelf?.name || 'Carregando...'}
                  </Text>
                )}
              </View>
            </View>

            <Pressable
              onPress={() =>
                setEditingName((value) => !value)
              }
              style={({ pressed }) => [
                styles.outlineButton,
                pressed && styles.outlineButtonPressed,
              ]}
            >
              <Text style={styles.outlineText}>
                {editingName
                  ? 'CANCELAR'
                  : 'EDITAR NOME'}
              </Text>
            </Pressable>
          </View>

          {/* livros reais da estante */}
          <View
            style={[
              styles.booksArea,
              wide && styles.booksAreaWide,
            ]}
          >
            <View style={styles.booksHeader}>
              <View>
                <Text style={styles.booksLabel}>
                  CONTEÚDO DA ESTANTE
                </Text>

                <Text
                  style={[
                    styles.booksTitle,
                    wide && styles.booksTitleWide,
                  ]}
                >
                  Obras
                </Text>
              </View>

              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {shelf?.items.length || 0}
                </Text>
              </View>
            </View>

            {/* somente imagens que realmente pertencem à estante */}
            {shelf?.items.length ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.booksRow,
                  wide && styles.booksRowWide,
                ]}
              >
                {shelf.items.map((work) => (
                  <View
                    key={work.id}
                    style={[
                      styles.bookCard,
                      wide && styles.bookCardWide,
                    ]}
                  >
                    {work.image_url ? (
                      <Image
                        source={{
                          uri: work.image_url,
                        }}
                        style={[
                          styles.bookCover,
                          wide && styles.bookCoverWide,
                        ]}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[
                          styles.noCover,
                          wide && styles.noCoverWide,
                        ]}
                      >
                        <Text style={styles.noCoverIcon}>
                          ♡
                        </Text>

                        <Text style={styles.noCoverText}>
                          Sem capa
                        </Text>
                      </View>
                    )}

                    <Text
                      style={styles.bookCardTitle}
                      numberOfLines={2}
                    >
                      {work.title}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyShelf}>
                <View style={styles.emptyCircle}>
                  <Text style={styles.emptyHeart}>
                    ♡
                  </Text>
                </View>

                <Text style={styles.emptyTitle}>
                  Sua estante está vazia
                </Text>

                <Text style={styles.emptyText}>
                  Adicione livros, filmes ou séries para
                  começar sua coleção.
                </Text>
              </View>
            )}
          </View>

          {/* detalhes das obras */}
          <View
            style={[
              styles.detailsArea,
              wide && styles.detailsAreaWide,
            ]}
          >
            <Text style={styles.detailsLabel}>
              SUAS OBRAS
            </Text>

            <Text
              style={[
                styles.detailsTitle,
                wide && styles.detailsTitleWide,
              ]}
            >
              Gerencie sua coleção
            </Text>

            <View style={styles.itemsList}>
              {(shelf?.items || []).map((work) => (
                <View
                  key={work.id}
                  style={[
                    styles.itemCard,
                    wide && styles.itemCardWide,
                  ]}
                >
                  {work.image_url ? (
                    <Image
                      source={{
                        uri: work.image_url,
                      }}
                      style={[
                        styles.cover,
                        wide && styles.coverWide,
                      ]}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.cover,
                        styles.coverWithoutImage,
                        wide && styles.coverWide,
                      ]}
                    >
                      <Text style={styles.coverHeart}>
                        ♡
                      </Text>
                    </View>
                  )}

                  <View style={styles.itemInfo}>
                    <View style={styles.itemTitleRow}>
                      <Text
                        style={[
                          styles.itemTitle,
                          wide && styles.itemTitleWide,
                        ]}
                      >
                        {work.title}
                      </Text>
                    </View>

                    <Text style={styles.stars}>
                      {'★'.repeat(
                        Math.max(
                          1,
                          Math.min(
                            5,
                            Math.round(work.rating || 5),
                          ),
                        ),
                      )}
                    </Text>

                    <Text
                      style={[
                        styles.meta,
                        wide && styles.metaWide,
                      ]}
                    >
                      {work.kind === 'livro'
                        ? 'Autor'
                        : 'Criador'}
                      : {work.creator}
                    </Text>

                    {work.publisher ? (
                      <Text
                        style={[
                          styles.meta,
                          wide && styles.metaWide,
                        ]}
                      >
                        Editora: {work.publisher}
                      </Text>
                    ) : null}

                    {work.year ? (
                      <Text
                        style={[
                          styles.meta,
                          wide && styles.metaWide,
                        ]}
                      >
                        Ano de publicação: {work.year}
                      </Text>
                    ) : null}

                    <View style={styles.itemActions}>
                      <Pressable
                        onPress={() =>
                          navigation.navigate(
                            'QuickReview',
                            {
                              id: String(work.id),
                            },
                          )
                        }
                        style={({ pressed }) => [
                          styles.actionButton,
                          pressed &&
                            styles.actionButtonPressed,
                        ]}
                      >
                        <Text style={styles.actionButtonText}>
                          Avaliar {kindLabel(work.kind)}
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() =>
                          removeWork(work.id)
                        }
                        style={({ pressed }) => [
                          styles.removeButton,
                          pressed &&
                            styles.actionButtonPressed,
                        ]}
                      >
                        <Text style={styles.removeButtonText}>
                          Remover
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}

              {shelf && !shelf.items.length ? (
                <View style={styles.emptyDetails}>
                  <Text style={styles.emptyDetailsText}>
                    Nenhuma obra adicionada ainda.
                  </Text>
                </View>
              ) : null}
            </View>

            {/* adicionar obra */}
            {showAdd ? (
              <View
                style={[
                  styles.addPanel,
                  wide && styles.addPanelWide,
                ]}
              >
                <View style={styles.addHeader}>
                  <View>
                    <Text style={styles.addLabel}>
                      NOVA OBRA
                    </Text>

                    <Text style={styles.addTitle}>
                      Adicionar à estante
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => setShowAdd(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.close}>
                      Fechar
                    </Text>
                  </Pressable>
                </View>

                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Pesquisar por título ou autor..."
                  placeholderTextColor="#9993A1"
                  style={styles.searchInput}
                />

                <View style={styles.addList}>
                  {availableWorks
                    .slice(0, 12)
                    .map((work) => (
                      <View
                        key={work.id}
                        style={styles.addRow}
                      >
                        {work.image_url ? (
                          <Image
                            source={{
                              uri: work.image_url,
                            }}
                            style={styles.addCover}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.addCoverEmpty}>
                            <Text>♡</Text>
                          </View>
                        )}

                        <View style={styles.addInfo}>
                          <Text
                            style={styles.addWorkTitle}
                            numberOfLines={1}
                          >
                            {work.title}
                          </Text>

                          <Text style={styles.addWorkMeta}>
                            {work.creator}
                          </Text>
                        </View>

                        <Pressable
                          onPress={() => addWork(work)}
                          style={styles.addAction}
                        >
                          <Text style={styles.addActionText}>
                            + Adicionar
                          </Text>
                        </Pressable>
                      </View>
                    ))}

                  {!availableWorks.length ? (
                    <Text style={styles.empty}>
                      Nenhuma obra disponível para adicionar.
                    </Text>
                  ) : null}
                </View>
              </View>
            ) : (
              <Pressable
                onPress={openAddWorks}
                style={({ pressed }) => [
                  styles.addButton,
                  wide && styles.addButtonWide,
                  pressed && styles.addButtonPressed,
                ]}
              >
                <View style={styles.addButtonCircle}>
                  <Text style={styles.addButtonPlus}>
                    +
                  </Text>
                </View>

                <View>
                  <Text style={styles.addButtonTitle}>
                    Adicionar obra
                  </Text>

                  <Text style={styles.addButtonSubtitle}>
                    Inclua uma nova história na estante
                  </Text>
                </View>

                <Text style={styles.addArrow}>
                  →
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {status ? (
          <View style={styles.statusBox}>
            <Text style={styles.status}>{status}</Text>
          </View>
        ) : null}

        <Pressable
          disabled={saving}
          onPress={saveChanges}
          style={({ pressed }) => [
            styles.save,
            (pressed || saving) && styles.pressed,
          ]}
        >
          <Text style={styles.saveText}>
            {saving
              ? 'SALVANDO...'
              : 'SALVAR ALTERAÇÕES'}
          </Text>
        </Pressable>

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
    backgroundColor: '#FFFFFF',
    paddingBottom: 0,
  },

  /* título */

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
    gap: 14,
  },

  titleDecoration: {
    width: 30,
    height: 1,
    backgroundColor: colors.purple,
    opacity: 0.35,
  },

  pageTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 27,
    letterSpacing: 2.5,
  },

  pageTitleWide: {
    fontSize: 40,
    letterSpacing: 4,
  },

  pageSubtitle: {
    color: '#85818A',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    marginTop: 7,
  },

  pageSubtitleWide: {
    fontSize: 13,
    marginTop: 9,
  },

  /* área principal */

  shelfArea: {
    width: '100%',
  },

  shelfAreaWide: {
    paddingHorizontal: 35,
  },

  /* cabeçalho da estante */

  shelfHeader: {
    minHeight: 90,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8F6FA',
    borderTopWidth: 1,
    borderTopColor: '#E9E4ED',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E4ED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
  },

  shelfHeaderWide: {
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    minHeight: 115,
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  shelfHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    flex: 1,
  },

  shelfIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  shelfIconText: {
    color: '#FFFFFF',
    fontSize: 21,
  },

  shelfHeaderText: {
    flex: 1,
  },

  shelfLabel: {
    color: '#9993A1',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7,
    letterSpacing: 2,
    marginBottom: 2,
  },

  shelfName: {
    color: '#281A38',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 19,
  },

  shelfNameWide: {
    fontSize: 27,
  },

  nameInput: {
    height: 45,
    borderWidth: 1,
    borderColor: colors.purple,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    color: '#281A38',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
  },

  nameInputWide: {
    width: 500,
    height: 54,
    fontSize: 23,
  },

  outlineButton: {
    borderWidth: 1.2,
    borderColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },

  outlineButtonPressed: {
    opacity: 0.55,
    transform: [{ scale: 0.97 }],
  },

  outlineText: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8.5,
    letterSpacing: 0.7,
  },

  /* livros */

  booksArea: {
    backgroundColor: colors.purple,
    paddingVertical: 28,
    paddingHorizontal: 20,
  },

  booksAreaWide: {
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    minHeight: 350,
    justifyContent: 'center',
    paddingVertical: 35,
    paddingHorizontal: 35,
  },

  booksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  booksLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7,
    letterSpacing: 1.8,
  },

  booksTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    marginTop: 1,
  },

  booksTitleWide: {
    fontSize: 28,
  },

  countBadge: {
    minWidth: 34,
    height: 34,
    paddingHorizontal: 9,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
  },

  booksRow: {
    gap: 16,
    alignItems: 'flex-start',
    paddingHorizontal: 2,
  },

  booksRowWide: {
    justifyContent: 'center',
    width: '100%',
    gap: 30,
  },

  bookCard: {
    width: 116,
  },

  bookCardWide: {
    width: 190,
  },

  bookCover: {
    width: 116,
    height: 175,
    borderRadius: 9,
    backgroundColor: '#EEEEEE',
  },

  bookCoverWide: {
    width: 190,
    height: 285,
    borderRadius: 12,
  },

  bookCardTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    lineHeight: 13,
    marginTop: 7,
  },

  noCover: {
    width: 116,
    height: 175,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  noCoverWide: {
    width: 190,
    height: 285,
    borderRadius: 12,
  },

  noCoverIcon: {
    color: '#FFFFFF',
    fontSize: 25,
    marginBottom: 5,
  },

  noCoverText: {
    color: 'rgba(255,255,255,0.65)',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
  },

  /* estante vazia */

  emptyShelf: {
    minHeight: 190,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  emptyCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  emptyHeart: {
    color: '#FFFFFF',
    fontSize: 24,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    marginBottom: 3,
  },

  emptyText: {
    color: 'rgba(255,255,255,0.65)',
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    textAlign: 'center',
    maxWidth: 330,
  },

  /* detalhes */

  detailsArea: {
    backgroundColor: '#F0D66A',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },

  detailsAreaWide: {
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 35,
    paddingTop: 38,
    paddingBottom: 55,
  },

  detailsLabel: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7,
    letterSpacing: 2,
    opacity: 0.65,
  },

  detailsTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 23,
    marginTop: 2,
    marginBottom: 20,
  },

  detailsTitleWide: {
    fontSize: 31,
    marginBottom: 28,
  },

  itemsList: {
    gap: 16,
  },

  itemCard: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 15,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },

  itemCardWide: {
    padding: 20,
    gap: 28,
    borderRadius: 18,
  },

  cover: {
    width: 92,
    height: 140,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
  },

  coverWide: {
    width: 180,
    height: 270,
    borderRadius: 12,
  },

  coverWithoutImage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },

  coverHeart: {
    color: colors.purple,
    fontSize: 28,
  },

  itemInfo: {
    flex: 1,
    paddingTop: 1,
  },

  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
  },

  itemTitleWide: {
    fontSize: 26,
    lineHeight: 34,
  },

  stars: {
    color: colors.green,
    fontSize: 15,
    letterSpacing: 1,
    marginVertical: 5,
  },

  meta: {
    color: colors.purple,
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    lineHeight: 16,
  },

  metaWide: {
    fontSize: 15,
    lineHeight: 23,
  },

  itemActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 13,
  },

  actionButton: {
    backgroundColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },

  actionButtonPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.97 }],
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8.5,
  },

  removeButton: {
    borderWidth: 1,
    borderColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  removeButtonText: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8.5,
  },

  emptyDetails: {
    paddingVertical: 20,
  },

  emptyDetailsText: {
    color: colors.purple,
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },

  /* adicionar */

  addButton: {
    marginTop: 25,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: colors.purple,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  addButtonWide: {
    maxWidth: 650,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 32,
  },

  addButtonPressed: {
    opacity: 0.65,
    transform: [{ scale: 0.985 }],
  },

  addButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonPlus: {
    color: '#FFFFFF',
    fontSize: 22,
  },

  addButtonTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },

  addButtonSubtitle: {
    color: '#746D7B',
    fontFamily: 'Poppins_400Regular',
    fontSize: 8.5,
    marginTop: 1,
  },

  addArrow: {
    color: colors.purple,
    fontSize: 20,
    marginLeft: 'auto',
  },

  addPanel: {
    marginTop: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(40,26,56,0.15)',
  },

  addPanelWide: {
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    padding: 25,
    marginTop: 32,
  },

  addHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
  },

  addLabel: {
    color: '#9993A1',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7,
    letterSpacing: 1.8,
  },

  addTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 19,
  },

  closeButton: {
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  close: {
    color: colors.purple,
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    textDecorationLine: 'underline',
  },

  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D8D3DE',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginTop: 15,
    color: colors.purple,
    backgroundColor: '#FAF9FC',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },

  addList: {
    marginTop: 12,
    gap: 5,
  },

  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#ECE8EE',
  },

  addCover: {
    width: 38,
    height: 55,
    borderRadius: 5,
    backgroundColor: '#EEEEEE',
  },

  addCoverEmpty: {
    width: 38,
    height: 55,
    borderRadius: 5,
    backgroundColor: '#F1EEF4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addInfo: {
    flex: 1,
  },

  addWorkTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
  },

  addWorkMeta: {
    color: '#746D7B',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    marginTop: 1,
  },

  addAction: {
    borderWidth: 1,
    borderColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },

  addActionText: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8.5,
  },

  empty: {
    color: colors.purple,
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    textAlign: 'center',
    paddingVertical: 24,
  },

  /* mensagens */

  statusBox: {
    alignSelf: 'center',
    width: '90%',
    maxWidth: 800,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#F8F6FA',
    borderWidth: 1,
    borderColor: '#E4DEE9',
  },

  status: {
    color: colors.purple,
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    textAlign: 'center',
  },

  /* salvar */

  save: {
    alignSelf: 'center',
    marginVertical: 32,
    backgroundColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 27,
    paddingVertical: 12,
  },

  saveText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.7,
  },

  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.97 }],
  },
});
