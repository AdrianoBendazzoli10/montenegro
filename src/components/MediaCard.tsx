import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { MediaItem } from '../data/media';
import { colors } from '../theme/colors';

type Props = { item: MediaItem; onPress: () => void; compact?: boolean };

export function MediaCard({ item, onPress, compact = false }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, compact && styles.compact, pressed && styles.pressed]}>
      <Image source={{ uri: item.image }} style={[styles.cover, compact && styles.coverCompact]} resizeMode="cover" />
      <View style={styles.body}>
        <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.year} · {item.creator}</Text>
        <Text style={styles.rating}>★ {item.rating.toFixed(1)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 170, borderRadius: 18, overflow: 'hidden', backgroundColor: colors.green, marginRight: 14 },
  compact: { width: '48%', marginRight: 0, marginBottom: 16 },
  cover: { width: '100%', height: 220, backgroundColor: colors.navySoft },
  coverCompact: { height: 190 },
  body: { padding: 12, minHeight: 105 },
  title: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 16, lineHeight: 21 },
  meta: { color: 'rgba(237,231,219,.7)', fontFamily: 'Poppins_400Regular', fontSize: 11, marginTop: 6 },
  rating: { color: colors.yellow, fontFamily: 'Poppins_600SemiBold', fontSize: 13, marginTop: 7 },
  pressed: { opacity: .82, transform: [{ scale: .985 }] },
});
