import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, MediaKind } from '../navigation/types';
import { mediaItems } from '../data/media';
import { MediaCard } from '../components/MediaCard';
import { ScreenShell } from '../components/ScreenShell';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Explore'>;

const categories: { label: string; kind: MediaKind; emoji: string }[] = [
  { label: 'Livros', kind: 'livro', emoji: '📚' },
  { label: 'Filmes', kind: 'filme', emoji: '🎬' },
  { label: 'Séries', kind: 'serie', emoji: '📺' },
];

export function ExploreScreen({ navigation }: Props) {
  return (
    <ScreenShell
      title="Montenegro"
      subtitle="Entre capas e telas"
      right={<Pressable onPress={() => navigation.navigate('Profile')}><Text style={styles.profile}>☺</Text></Pressable>}
    >
      <Text style={styles.hero}>O que você quer descobrir hoje?</Text>
      <Text style={styles.copy}>Explore histórias brasileiras e compartilhe o que cada obra fez você sentir.</Text>

      <View style={styles.categories}>
        {categories.map((category) => (
          <Pressable key={category.kind} onPress={() => navigation.navigate('Catalog', { kind: category.kind })} style={styles.category}>
            <Text style={styles.emoji}>{category.emoji}</Text>
            <Text style={styles.categoryText}>{category.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Em destaque</Text>
        <Pressable onPress={() => navigation.navigate('Shelves')}><Text style={styles.sectionLink}>Minhas estantes</Text></Pressable>
      </View>
      <FlatList
        horizontal
        data={mediaItems.slice(0, 5)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MediaCard item={item} onPress={() => navigation.navigate('Details', { id: item.id })} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      <View style={styles.callout}>
        <Text style={styles.calloutTitle}>Tem uma obra brasileira que não está aqui?</Text>
        <Text style={styles.calloutText}>Cadastre uma indicação para ampliar o catálogo da comunidade.</Text>
        <Pressable onPress={() => navigation.navigate('AddWork')} style={styles.calloutButton}>
          <Text style={styles.calloutButtonText}>+ Cadastrar obra</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profile: { color: colors.cream, fontSize: 25 },
  hero: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 30, lineHeight: 38, textAlign: 'center', marginTop: 18 },
  copy: { color: 'rgba(237,231,219,.75)', fontFamily: 'Poppins_400Regular', fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 10, marginBottom: 26 },
  categories: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  category: { flex: 1, minHeight: 96, backgroundColor: colors.purple, borderRadius: 18, alignItems: 'center', justifyContent: 'center', padding: 10 },
  emoji: { fontSize: 27, marginBottom: 5 },
  categoryText: { color: colors.cream, fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 21 },
  sectionLink: { color: colors.yellow, fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
  list: { paddingBottom: 8 },
  callout: { marginTop: 28, backgroundColor: colors.green, borderRadius: 22, padding: 20 },
  calloutTitle: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 20, lineHeight: 26 },
  calloutText: { color: colors.cream, fontFamily: 'Poppins_400Regular', fontSize: 13, lineHeight: 20, marginTop: 8 },
  calloutButton: { alignSelf: 'flex-start', backgroundColor: colors.yellow, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 15, marginTop: 16 },
  calloutButtonText: { color: colors.navy, fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
});
