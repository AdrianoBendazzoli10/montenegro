import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { api, type ApiShelf, type ApiWork } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'EditShelf'>;

const fallbackCovers = [
  'https://www.figma.com/api/mcp/asset/3e3d1107-c218-428b-b25f-be14204248fb.png',
  'https://www.figma.com/api/mcp/asset/e53df747-bcd5-4957-97a8-c163714d7eb6.png',
  'https://www.figma.com/api/mcp/asset/6a4911a7-c44c-45a5-8ca6-af201ccbe49f.png',
  'https://www.figma.com/api/mcp/asset/d1c47c1e-49f7-4137-9236-ce155e6c0e49.png',
  'https://www.figma.com/api/mcp/asset/bcf18069-6824-4149-85cf-0b51ff9e1895.png',
];

function coverFor(work: ApiWork, index: number) {
  return work.image_url || fallbackCovers[index % fallbackCovers.length];
}

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
      const selected = response.shelves.find((item) => item.id === shelfId);
      if (!selected) {
        setStatus('Estante não encontrada.');
        return;
      }
      setShelf(selected);
      setName(selected.name);
      setStatus('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível carregar a estante.');
    }
  }

  useEffect(() => { load(); }, [shelfId]);

  const availableWorks = useMemo(() => {
    const ids = new Set((shelf?.items || []).map((item) => item.id));
    const term = search.trim().toLowerCase();
    return allWorks.filter((item) => !ids.has(item.id) && (!term || item.title.toLowerCase().includes(term) || item.creator.toLowerCase().includes(term)));
  }, [allWorks, search, shelf]);

  async function saveChanges() {
    if (!shelf || !name.trim()) {
      setStatus('Informe um nome para a estante.');
      return;
    }
    try {
      setSaving(true);
      const response = await api.renameShelf(shelf.id, name.trim());
      setShelf((current) => current ? { ...current, name: response.shelf.name } : current);
      setEditingName(false);
      setStatus('Alterações salvas.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  }

  async function removeWork(workId: number) {
    if (!shelf) return;
    try {
      await api.removeShelfItem(shelf.id, workId);
      setShelf({ ...shelf, items: shelf.items.filter((item) => item.id !== workId) });
      setStatus('Obra removida da estante.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível remover a obra.');
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
      setStatus(error instanceof Error ? error.message : 'Não foi possível carregar as obras.');
    }
  }

  async function addWork(work: ApiWork) {
    if (!shelf) return;
    try {
      await api.addShelfItem(shelf.id, work.id);
      setShelf({ ...shelf, items: [...shelf.items, work] });
      setStatus(`${work.title} foi adicionado à estante.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível adicionar a obra.');
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <AppHeader navigation={navigation} />
        <Text style={[styles.pageTitle, wide && styles.pageTitleWide]}>ESTANTES</Text>

        <View style={[styles.carousel, wide && styles.carouselWide]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.carouselRow, wide && styles.carouselRowWide]}>
            {(shelf?.items || []).slice(0, 5).map((work, index) => (
              <Image key={work.id} source={{ uri: coverFor(work, index) }} style={[styles.carouselCover, wide && styles.carouselCoverWide]} resizeMode="cover" />
            ))}
            {!shelf?.items.length ? fallbackCovers.slice(0, 4).map((uri) => <Image key={uri} source={{ uri }} style={[styles.carouselCover, wide && styles.carouselCoverWide]} resizeMode="cover" />) : null}
          </ScrollView>
        </View>

        <View style={[styles.editArea, wide && styles.editAreaWide]}>
          <View style={[styles.nameRow, wide && styles.nameRowWide]}>
            {editingName ? <TextInput value={name} onChangeText={setName} style={[styles.nameInput, wide && styles.nameInputWide]} autoFocus /> : <Text style={[styles.shelfName, wide && styles.shelfNameWide]}>{shelf?.name || 'Carregando...'}</Text>}
            <Pressable onPress={() => setEditingName((value) => !value)} style={styles.outlineButton}><Text style={styles.outlineText}>{editingName ? 'CANCELAR' : 'EDITAR NOME'}</Text></Pressable>
          </View>

          <Text style={[styles.worksHeading, wide && styles.worksHeadingWide]}>Obras:</Text>

          <View style={styles.itemsList}>
            {(shelf?.items || []).map((work, index) => (
              <View key={work.id} style={[styles.itemRow, wide && styles.itemRowWide]}>
                <Image source={{ uri: coverFor(work, index) }} style={[styles.cover, wide && styles.coverWide]} resizeMode="cover" />
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemTitle, wide && styles.itemTitleWide]}>{work.title}</Text>
                  <Text style={styles.stars}>{'★'.repeat(Math.max(1, Math.min(5, Math.round(work.rating || 5))))}</Text>
                  <Text style={[styles.meta, wide && styles.metaWide]}>{work.kind === 'livro' ? 'Autor' : 'Criador'}: {work.creator}</Text>
                  {work.publisher ? <Text style={[styles.meta, wide && styles.metaWide]}>Editora: {work.publisher}</Text> : null}
                  {work.year ? <Text style={[styles.meta, wide && styles.metaWide]}>Ano de publicação: {work.year}</Text> : null}
                  <View style={styles.itemActions}>
                    <Pressable onPress={() => navigation.navigate('QuickReview', { id: String(work.id) })} style={styles.smallButton}><Text style={styles.smallButtonText}>Quero avaliar esse {kindLabel(work.kind)}!</Text></Pressable>
                    <Pressable onPress={() => removeWork(work.id)} style={styles.smallButton}><Text style={styles.smallButtonText}>Excluir da estante  ⌫</Text></Pressable>
                  </View>
                </View>
              </View>
            ))}
            {shelf && !shelf.items.length ? <Text style={styles.empty}>Nenhuma obra nessa estante ainda.</Text> : null}
          </View>

          {showAdd ? <View style={[styles.addPanel, wide && styles.addPanelWide]}>
            <View style={styles.addHeader}>
              <Text style={styles.addTitle}>Adicionar obra</Text>
              <Pressable onPress={() => setShowAdd(false)}><Text style={styles.close}>Fechar</Text></Pressable>
            </View>
            <TextInput value={search} onChangeText={setSearch} placeholder="Pesquisar obra" placeholderTextColor="#6E7480" style={styles.searchInput} />
            <View style={styles.addList}>
              {availableWorks.slice(0, 12).map((work) => (
                <View key={work.id} style={styles.addRow}>
                  <View style={styles.addInfo}><Text style={styles.addWorkTitle}>{work.title}</Text><Text style={styles.addWorkMeta}>{work.creator}</Text></View>
                  <Pressable onPress={() => addWork(work)} style={styles.addAction}><Text style={styles.addActionText}>Adicionar +</Text></Pressable>
                </View>
              ))}
              {!availableWorks.length ? <Text style={styles.empty}>Nenhuma obra disponível para adicionar.</Text> : null}
            </View>
          </View> : <Pressable onPress={openAddWorks} style={[styles.addButton, wide && styles.addButtonWide]}><Text style={styles.addButtonText}>ADICIONAR OBRA  +</Text></Pressable>}
        </View>

        {status ? <Text style={styles.status}>{status}</Text> : null}
        <Pressable disabled={saving} onPress={saveChanges} style={({ pressed }) => [styles.save, (pressed || saving) && styles.pressed]}><Text style={styles.saveText}>{saving ? 'Salvando...' : 'Salvar Alterações'}</Text></Pressable>
        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  page: { backgroundColor: '#FFFFFF', paddingBottom: 0 },
  pageTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 30, textAlign: 'center', marginTop: 28, marginBottom: 24 },
  pageTitleWide: { fontSize: 44, marginTop: 36, marginBottom: 35 },
  carousel: { backgroundColor: colors.purple, paddingVertical: 18 },
  carouselWide: { minHeight: 307, justifyContent: 'center' },
  carouselRow: { paddingHorizontal: 16, gap: 16, alignItems: 'center' },
  carouselRowWide: { width: '100%', justifyContent: 'space-around', paddingHorizontal: 65, gap: 56 },
  carouselCover: { width: 110, height: 166, borderRadius: 8 },
  carouselCoverWide: { width: 245, height: 379, borderRadius: 15, marginTop: -20 },
  editArea: { backgroundColor: 'rgba(238,203,63,.83)', paddingHorizontal: 18, paddingTop: 28, paddingBottom: 54 },
  editAreaWide: { paddingHorizontal: 50, paddingTop: 62, paddingBottom: 82 },
  nameRow: { gap: 12 },
  nameRowWide: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  shelfName: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 27 },
  shelfNameWide: { fontSize: 40 },
  nameInput: { height: 52, borderWidth: 1.5, borderColor: '#001A38', borderRadius: 10, paddingHorizontal: 14, color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 20 },
  nameInputWide: { width: 520, height: 60, fontSize: 30 },
  outlineButton: { alignSelf: 'flex-start', borderWidth: 1.3, borderColor: '#001A38', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
  outlineText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 10 },
  worksHeading: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 24, marginTop: 34 },
  worksHeadingWide: { fontSize: 36, marginTop: 54 },
  itemsList: { marginTop: 12, gap: 32 },
  itemRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  itemRowWide: { gap: 54, minHeight: 390, alignItems: 'center' },
  cover: { width: 108, height: 165, borderRadius: 8, backgroundColor: '#EEEEEE' },
  coverWide: { width: 245, height: 379, borderRadius: 15 },
  itemInfo: { flex: 1 },
  itemTitle: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 16, lineHeight: 22 },
  itemTitleWide: { fontSize: 28, lineHeight: 38 },
  stars: { color: colors.green, fontSize: 16, letterSpacing: 1, marginVertical: 5 },
  meta: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 11, lineHeight: 17 },
  metaWide: { fontSize: 17, lineHeight: 25 },
  itemActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 14 },
  smallButton: { borderWidth: 1.2, borderColor: '#001A38', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  smallButtonText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 9.5 },
  addButton: { alignSelf: 'center', borderWidth: 1.4, borderColor: '#001A38', borderRadius: 999, paddingHorizontal: 22, paddingVertical: 10, marginTop: 42 },
  addButtonWide: { minWidth: 280, minHeight: 57, justifyContent: 'center', marginTop: 58 },
  addButtonText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 11, textAlign: 'center' },
  addPanel: { marginTop: 34, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(0,26,56,.18)' },
  addPanelWide: { width: '78%', maxWidth: 900, alignSelf: 'center', padding: 24 },
  addHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 20 },
  close: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 12, textDecorationLine: 'underline' },
  searchInput: { height: 48, borderWidth: 1, borderColor: '#001A38', borderRadius: 10, paddingHorizontal: 14, marginTop: 14, color: '#001A38', fontFamily: 'Poppins_400Regular' },
  addList: { marginTop: 12, gap: 8 },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#E4E4E4' },
  addInfo: { flex: 1 },
  addWorkTitle: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  addWorkMeta: { color: '#52606D', fontFamily: 'Poppins_400Regular', fontSize: 10 },
  addAction: { borderWidth: 1, borderColor: colors.purple, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  addActionText: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 10 },
  empty: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 13, textAlign: 'center', paddingVertical: 24 },
  status: { color: '#6B4D00', fontFamily: 'Poppins_400Regular', fontSize: 12, textAlign: 'center', marginHorizontal: 20, marginTop: 20 },
  save: { alignSelf: 'center', marginVertical: 34, paddingHorizontal: 10, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#001A38' },
  saveText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 15 },
  pressed: { opacity: 0.6 },
});
