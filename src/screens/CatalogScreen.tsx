import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { getMediaByKind } from '../data/media';
import { MediaCard } from '../components/MediaCard';
import { ScreenShell } from '../components/ScreenShell';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Catalog'>;

const labels = { livro: 'Livros', filme: 'Filmes', serie: 'Séries' } as const;

export function CatalogScreen({ navigation, route }: Props) {
  const items = getMediaByKind(route.params.kind);
  return (
    <ScreenShell title={labels[route.params.kind]} subtitle="Produções brasileiras" onBack={() => navigation.goBack()}>
      <Text style={styles.intro}>Encontre uma história, abra os detalhes e registre sua opinião.</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <MediaCard key={item.id} compact item={item} onPress={() => navigation.navigate('Details', { id: item.id })} />
        ))}
      </View>
      {items.length < 2 ? <Text style={styles.note}>O catálogo é demonstrativo e já está pronto para receber dados de uma API depois.</Text> : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  intro: { color: 'rgba(237,231,219,.72)', fontFamily: 'Poppins_400Regular', fontSize: 14, lineHeight: 22, margin: 4, marginBottom: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  note: { color: colors.yellow, fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 19, marginTop: 10 },
});
