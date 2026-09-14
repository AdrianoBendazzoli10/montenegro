import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export function AppHeader({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;

  return (
    <View style={[styles.header, wide && styles.headerWide]}>
      <Pressable onPress={() => navigation.navigate('Explore')} hitSlop={8}>
        <Text style={[styles.brand, wide && styles.brandWide]}>MONTENEGRO</Text>
      </Pressable>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.navRow, wide && styles.navRowWide]}
        style={styles.navScroll}
      >
        <Pressable onPress={() => navigation.navigate('Catalog', { kind: 'livro' })}><Text style={styles.navText}>Obras</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('Shelves')}><Text style={styles.navText}>Estantes</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('QuickReview', { id: '1' })}><Text style={styles.navText}>Avaliações</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('AddWork')}><Text style={styles.navText}>Cadastrar obras</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('Profile')}><Text style={styles.navText}>Perfil</Text></Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 18,
    marginTop: 10,
    minHeight: 58,
    backgroundColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 7,
  },
  headerWide: {
    alignSelf: 'center',
    width: '85%',
    maxWidth: 1225,
    height: 87,
    minHeight: 87,
    paddingHorizontal: 76,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  brand: {
    color: '#FFFFFF',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 19,
    textAlign: 'center',
  },
  brandWide: { fontSize: 27, textAlign: 'left' },
  navScroll: { flexGrow: 0 },
  navRow: { gap: 24, alignItems: 'center', paddingHorizontal: 2 },
  navRowWide: { gap: 30, paddingHorizontal: 0 },
  navText: { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontSize: 13 },
});
