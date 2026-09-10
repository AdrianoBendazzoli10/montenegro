import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeaturedCard } from '../components/FeaturedCard';
import { featured } from '../data/featured';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../navigation/types';

const backgroundImage = 'https://www.figma.com/api/mcp/asset/af11bd0e-529f-4b65-b247-7ae2df403377.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View style={styles.root}>
      <ImageBackground source={{ uri: backgroundImage }} style={styles.background} resizeMode="cover" imageStyle={styles.backgroundImage}>
        <View style={styles.tint} />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.hero}>
              <Text style={[styles.brand, isTablet && styles.brandTablet]}>MONTENEGRO</Text>
              <Text style={[styles.heading, isTablet && styles.headingTablet]}>ENTRE CAPAS E TELAS</Text>
              <Text style={[styles.description, isTablet && styles.descriptionTablet]}>
                Aqui você pode dar sua opinião sobre os filmes, séries e livros brasileiros que marcaram você ou encontrar novas histórias para se apaixonar.
              </Text>

              <Pressable onPress={() => navigation.navigate('Login')} style={({ pressed }) => [styles.enterButton, pressed && styles.pressed]}>
                <Text style={styles.enterText}>Entrar</Text>
              </Pressable>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Destaques</Text>
              <Text style={styles.sectionSubtitle}>Histórias brasileiras para descobrir, avaliar e guardar.</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow} snapToInterval={266} decelerationRate="fast">
              {featured.map((item) => (
                <FeaturedCard key={item.id} {...item} />
              ))}
            </ScrollView>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy },
  background: { flex: 1 },
  backgroundImage: { opacity: 0.34 },
  tint: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
  safeArea: { flex: 1 },
  content: { paddingBottom: 40 },
  hero: {
    paddingHorizontal: 22,
    paddingTop: 52,
    alignItems: 'center',
  },
  brand: {
    color: colors.cream,
    fontFamily: 'Cinzel_700Bold',
    fontSize: 34,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  brandTablet: { fontSize: 50 },
  heading: {
    color: colors.cream,
    fontFamily: 'Cinzel_700Bold',
    fontSize: 31,
    lineHeight: 38,
    textAlign: 'center',
    marginTop: 2,
  },
  headingTablet: { fontSize: 46, lineHeight: 54 },
  description: {
    maxWidth: 680,
    color: colors.cream,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 34,
  },
  descriptionTablet: { fontSize: 20, lineHeight: 30 },
  enterButton: {
    minWidth: 150,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginTop: 28,
    alignItems: 'center',
  },
  pressed: { opacity: 0.72 },
  enterText: {
    color: colors.cream,
    fontFamily: 'Poppins_400Regular',
    fontSize: 24,
  },
  sectionHeader: {
    paddingHorizontal: 22,
    marginTop: 48,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.cream,
    fontFamily: 'Cinzel_700Bold',
    fontSize: 22,
  },
  sectionSubtitle: {
    color: 'rgba(237,231,219,0.78)',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    marginTop: 4,
  },
  cardsRow: { paddingLeft: 22, paddingRight: 6 },
});
