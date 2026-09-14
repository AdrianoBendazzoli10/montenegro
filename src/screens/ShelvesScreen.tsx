import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { api, type ApiShelf } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'Shelves'>;

const demoShelves = [
  { title: 'Saga Favorita', images: [
    'https://www.figma.com/api/mcp/asset/b15c343d-8b8f-42ba-9d3b-09783c491219.png',
    'https://www.figma.com/api/mcp/asset/d76c5b08-993b-4486-a8e6-d79f80d9e7f5.png',
    'https://www.figma.com/api/mcp/asset/ce5f2f2f-e04d-4f1b-a488-f82754c1cce9.png',
    'https://www.figma.com/api/mcp/asset/bdb972b5-6b4f-4fcd-ba34-d74d5c15a0af.png',
  ]},
  { title: 'Nostalgia', images: [
    'https://www.figma.com/api/mcp/asset/e4ecd34f-13ac-4d51-9b80-fa4086223f7c.png',
    'https://www.figma.com/api/mcp/asset/17854abf-51c0-424e-bde3-1fc88cd2462c.png',
    'https://www.figma.com/api/mcp/asset/435c6a91-74b3-4f43-928e-7b988fe30882.png',
    'https://www.figma.com/api/mcp/asset/a58587a5-84ca-4061-b586-ed4b7a099cf3.png',
  ]},
  { title: 'Favoritos de terror', images: [
    'https://www.figma.com/api/mcp/asset/37f41b69-c9fe-4388-8fbb-6502843a199a.png',
    'https://www.figma.com/api/mcp/asset/133f6863-3f88-4830-8750-d3686c4f82dc.png',
    'https://www.figma.com/api/mcp/asset/fc51ac93-2e20-4244-8c3e-14bf36833a88.png',
    'https://www.figma.com/api/mcp/asset/0692bfb7-519e-4dff-91d9-7880b60c05c0.png',
  ]},
  { title: 'Nós', images: [
    'https://www.figma.com/api/mcp/asset/466ce8c2-290d-48f7-9594-71d21f1b4151.png',
    'https://www.figma.com/api/mcp/asset/6ade13d5-9499-407c-944a-619f167e446d.png',
    'https://www.figma.com/api/mcp/asset/71c232a4-c0d2-471c-830f-94b085be07dd.png',
    'https://www.figma.com/api/mcp/asset/c78d60ad-9232-49bd-a180-5d4ba0fa6a3c.png',
  ]},
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
      setStatus(error instanceof Error ? error.message : 'Não foi possível carregar suas estantes.');
    }
  }

  useEffect(() => { loadShelves(); }, []);

  async function createShelf() {
    if (!newName.trim()) return;
    try {
      const response = await api.createShelf(newName.trim());
      setShelves((old) => [...old, { ...response.shelf, items: response.shelf.items || [] }]);
      setNewName('');
      setCreating(false);
      setStatus('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível criar a estante.');
    }
  }

  const visible = shelves.length
    ? shelves.map((shelf) => ({ id: shelf.id, title: shelf.name, images: shelf.items.map((item) => item.image_url || '').filter(Boolean) }))
    : demoShelves.map((shelf, index) => ({ id: -(index + 1), ...shelf }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <AppHeader navigation={navigation} />
        <Text style={[styles.title, wide && styles.titleWide]}>ESTANTES</Text>
        {status ? <Text style={styles.status}>{status}</Text> : null}

        {visible.map((shelf) => (
          <View key={shelf.id} style={styles.shelfBlock}>
            <View style={[styles.purpleStrip, wide && styles.purpleStripWide]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.booksRow, wide && styles.booksRowWide]} decelerationRate="fast">
                {shelf.images.length ? shelf.images.map((img, index) => <Image key={`${shelf.id}-${index}`} source={{ uri: img }} style={[styles.book, wide && styles.bookWide]} resizeMode="cover" />) : <Text style={styles.emptyShelf}>Esta estante ainda está vazia.</Text>}
              </ScrollView>
            </View>
            <View style={[styles.yellowStrip, wide && styles.yellowStripWide]}>
              <Text style={[styles.shelfTitle, wide && styles.shelfTitleWide]}>{shelf.title}</Text>
              <Pressable style={styles.editButton}><Text style={styles.editText}>EDITAR ESTANTE</Text></Pressable>
            </View>
          </View>
        ))}

        {creating ? <View style={styles.newShelfForm}>
          <TextInput value={newName} onChangeText={setNewName} placeholder="Nome da nova estante" placeholderTextColor="#7D838B" style={styles.newShelfInput} autoFocus />
          <View style={styles.newShelfActions}>
            <Pressable onPress={() => { setCreating(false); setNewName(''); }}><Text style={styles.cancelText}>Cancelar</Text></Pressable>
            <Pressable onPress={createShelf} style={styles.createButton}><Text style={styles.createButtonText}>Criar estante</Text></Pressable>
          </View>
        </View> : <Pressable onPress={() => setCreating(true)} style={styles.newShelf}><Text style={[styles.newShelfText, wide && styles.newShelfTextWide]}>Nova Estante</Text></Pressable>}

        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  page: { paddingBottom: 0, backgroundColor: '#FFFFFF' },
  title: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 30, textAlign: 'center', marginTop: 30, marginBottom: 18 },
  titleWide: { fontSize: 44, marginTop: 48, marginBottom: 46 },
  status: { color: '#B00020', fontFamily: 'Poppins_400Regular', fontSize: 11, textAlign: 'center', marginHorizontal: 22, marginBottom: 15 },
  shelfBlock: { marginBottom: 0 },
  purpleStrip: { backgroundColor: colors.purple, paddingVertical: 16 },
  purpleStripWide: { minHeight: 307, paddingVertical: 0, justifyContent: 'center' },
  booksRow: { paddingHorizontal: 16, gap: 18, alignItems: 'center' },
  booksRowWide: { width: '100%', justifyContent: 'space-around', paddingHorizontal: 65, gap: 60 },
  book: { width: 110, height: 166, borderRadius: 8, backgroundColor: '#EEEEEE' },
  bookWide: { width: 245, height: 379, borderRadius: 15, marginTop: -78 },
  emptyShelf: { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontSize: 14, paddingVertical: 60 },
  yellowStrip: { minHeight: 70, backgroundColor: 'rgba(238,203,63,.83)', paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  yellowStripWide: { minHeight: 202, paddingHorizontal: 65, paddingTop: 82, paddingBottom: 20 },
  shelfTitle: { flex: 1, color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 22 },
  shelfTitleWide: { fontSize: 40 },
  editButton: { borderWidth: 1.2, borderColor: colors.purple, borderRadius: 999, paddingHorizontal: 15, paddingVertical: 8 },
  editText: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 9 },
  newShelf: { alignSelf: 'center', marginVertical: 32, borderBottomWidth: 1, borderBottomColor: '#001A38', paddingBottom: 4 },
  newShelfText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 15 },
  newShelfTextWide: { fontSize: 28 },
  newShelfForm: { width: '90%', maxWidth: 560, alignSelf: 'center', marginVertical: 30, gap: 14 },
  newShelfInput: { height: 54, borderWidth: 1, borderColor: '#001A38', borderRadius: 10, paddingHorizontal: 16, color: '#001A38', fontFamily: 'Poppins_400Regular' },
  newShelfActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 18 },
  cancelText: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 13 },
  createButton: { backgroundColor: colors.purple, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 9 },
  createButtonText: { color: '#FFFFFF', fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
});
