import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Shelves'>;

const shelves = [
  { title: 'Saga Favorita', images: [
    'https://www.figma.com/api/mcp/asset/6588de04-fe82-4a9c-8e2c-60a1195fcd18.png',
    'https://www.figma.com/api/mcp/asset/ef9fb3b7-84dd-425a-a394-ae4307adc911.png',
    'https://www.figma.com/api/mcp/asset/b62c812f-565c-471e-a8ec-095d76be0481.png',
    'https://www.figma.com/api/mcp/asset/707ed185-9b81-4e10-b5dc-2d9ba0961d2e.png',
  ]},
  { title: 'Nostalgia', images: [
    'https://www.figma.com/api/mcp/asset/ac225ed1-ed95-4788-8fd1-a42e41681359.png',
    'https://www.figma.com/api/mcp/asset/dcb631ed-7d94-4c50-899c-9311197ac45b.png',
    'https://www.figma.com/api/mcp/asset/f7f4729e-72a6-4c68-ac28-4d41b81a258c.png',
    'https://www.figma.com/api/mcp/asset/76929265-aa1e-41b6-be92-78ee9a3690c5.png',
  ]},
  { title: 'Favoritos de terror', images: [
    'https://www.figma.com/api/mcp/asset/0856913c-13b5-4061-b2cf-297a02065d32.png',
    'https://www.figma.com/api/mcp/asset/9757f524-b727-480d-a95e-5dfac7bcd7d4.png',
    'https://www.figma.com/api/mcp/asset/1cbf7a3c-6d96-4c62-8c2d-df541034eb76.png',
    'https://www.figma.com/api/mcp/asset/db90940f-109f-4ae3-a558-7b0def4708fb.png',
  ]},
  { title: 'Nós', images: [
    'https://www.figma.com/api/mcp/asset/5cc25f33-82e9-4e74-a543-2b6ab699a248.png',
    'https://www.figma.com/api/mcp/asset/0a9c6578-ad35-4439-bdfe-77fecd24cae4.png',
    'https://www.figma.com/api/mcp/asset/fac2c066-8eb9-47c4-aa2b-1d615fe53088.png',
    'https://www.figma.com/api/mcp/asset/a024a2d8-6d36-44ee-b6a1-2d769e519354.png',
  ]},
];

export function ShelvesScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></Pressable>
          <Text style={styles.brand}>MONTENEGRO</Text>
          <Pressable onPress={() => navigation.navigate('Profile')}><Text style={styles.profileDot}>●</Text></Pressable>
        </View>
        <Text style={styles.title}>ESTANTES</Text>

        {shelves.map((shelf) => (
          <View key={shelf.title} style={styles.shelfBlock}>
            <View style={styles.purpleStrip}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.booksRow} snapToInterval={122} decelerationRate="fast">
                {shelf.images.map((img, index) => <Image key={`${shelf.title}-${index}`} source={{ uri: img }} style={styles.book} resizeMode="cover" />)}
              </ScrollView>
            </View>
            <View style={styles.yellowStrip}>
              <Text style={styles.shelfTitle}>{shelf.title}</Text>
              <Pressable style={styles.editButton}><Text style={styles.editText}>EDITAR ESTANTE</Text></Pressable>
            </View>
          </View>
        ))}

        <Pressable style={styles.newShelf}><Text style={styles.newShelfText}>Nova Estante</Text></Pressable>
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
  profileDot: { color: '#fff', fontSize: 16 },
  title: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 30, textAlign: 'center', marginTop: 30, marginBottom: 18 },
  shelfBlock: { marginBottom: 0 },
  purpleStrip: { backgroundColor: colors.purple, paddingVertical: 16 },
  booksRow: { paddingHorizontal: 16, gap: 12 },
  book: { width: 110, height: 166, borderRadius: 8, backgroundColor: '#eee' },
  yellowStrip: { minHeight: 70, backgroundColor: 'rgba(238,203,63,.83)', paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  shelfTitle: { flex: 1, color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 22 },
  editButton: { borderWidth: 1.2, borderColor: colors.purple, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  editText: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 9 },
  newShelf: { alignSelf: 'center', marginVertical: 28, borderBottomWidth: 1, borderBottomColor: '#001A38', paddingBottom: 3 },
  newShelfText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 15 },
  footer: { backgroundColor: colors.purple, paddingVertical: 34 },
  footerBrand: { color: '#FFDD56', fontFamily: 'Cinzel_700Bold', fontSize: 24, textAlign: 'center' },
});