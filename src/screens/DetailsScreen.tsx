import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { getMediaById } from '../data/media';
import { ScreenShell } from '../components/ScreenShell';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({ navigation, route }: Props) {
  const item = getMediaById(route.params.id);
  return (
    <ScreenShell title="Detalhes" onBack={() => navigation.goBack()}>
      <View style={styles.hero}>
        <Image source={{ uri: item.image }} style={styles.cover} resizeMode="cover" />
        <View style={styles.info}>
          <Text style={styles.kind}>{item.kind.toUpperCase()}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.creator}>{item.creator} · {item.year}</Text>
          <Text style={styles.rating}>★ {item.rating.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.tags}>{item.tags.map((tag) => <Text key={tag} style={styles.tag}>{tag}</Text>)}</View>

      <View style={styles.actions}>
        <AppButton label="Avaliação rápida" onPress={() => navigation.navigate('QuickReview', { id: item.id })} />
        <AppButton label="Avaliação detalhada" variant="secondary" onPress={() => navigation.navigate('DetailedReview', { id: item.id })} />
        <Pressable onPress={() => navigation.navigate('Shelves')} style={styles.shelf}><Text style={styles.shelfText}>＋ Adicionar à estante</Text></Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', gap: 18, alignItems: 'center', marginTop: 8 },
  cover: { width: 132, height: 190, borderRadius: 16, backgroundColor: colors.navySoft },
  info: { flex: 1 },
  kind: { color: colors.yellow, fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 1.5 },
  title: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 26, lineHeight: 32, marginTop: 7 },
  creator: { color: 'rgba(237,231,219,.65)', fontFamily: 'Poppins_400Regular', fontSize: 12, marginTop: 8 },
  rating: { color: colors.yellow, fontFamily: 'Poppins_600SemiBold', fontSize: 18, marginTop: 14 },
  description: { color: colors.cream, fontFamily: 'Poppins_400Regular', fontSize: 14, lineHeight: 23, marginTop: 26 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 },
  tag: { color: colors.cream, backgroundColor: colors.purple, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, fontFamily: 'Poppins_400Regular', fontSize: 11 },
  actions: { gap: 12, marginTop: 30 },
  shelf: { minHeight: 48, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(237,231,219,.35)', alignItems: 'center', justifyContent: 'center' },
  shelfText: { color: colors.cream, fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
});
