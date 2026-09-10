import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { mediaItems } from '../data/media';
import { MediaCard } from '../components/MediaCard';
import { ScreenShell } from '../components/ScreenShell';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Shelves'>;

export function ShelvesScreen({ navigation }: Props) {
  return (
    <ScreenShell title="Minhas estantes" subtitle="Organize suas histórias" onBack={() => navigation.goBack()}>
      <View style={styles.tabs}>
        {['Quero conhecer', 'Já vi/li', 'Favoritos'].map((label, index) => (
          <Pressable key={label} style={[styles.tab, index === 0 && styles.activeTab]}><Text style={styles.tabText}>{label}</Text></Pressable>
        ))}
      </View>
      <Text style={styles.section}>Quero conhecer</Text>
      <View style={styles.grid}>
        {mediaItems.slice(0, 4).map((item) => (
          <MediaCard key={item.id} compact item={item} onPress={() => navigation.navigate('Details', { id: item.id })} />
        ))}
      </View>
      <Text style={styles.tip}>As estantes já estão navegáveis. Quando o backend entrar, elas podem ser salvas por usuário no banco.</Text>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 7, marginTop: 8, marginBottom: 26 },
  tab: { flex: 1, minHeight: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.purple, paddingHorizontal: 7 },
  activeTab: { backgroundColor: colors.green },
  tabText: { color: colors.cream, fontFamily: 'Poppins_600SemiBold', fontSize: 10, textAlign: 'center' },
  section: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 22, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tip: { color: 'rgba(237,231,219,.62)', fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 19, marginTop: 8 },
});
