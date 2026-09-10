import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

const background = 'https://www.figma.com/api/mcp/asset/927570ba-6f4b-4e78-9769-82658458f964.png';
const aindaEstouAqui = 'https://www.figma.com/api/mcp/asset/4445cac2-0f4a-4d44-ba3c-f4c201f81c15.png';
const meuPe = 'https://www.figma.com/api/mcp/asset/9f946260-5296-444c-aa1a-e8cf7a75012a.png';
const cidadeInvisivel = 'https://www.figma.com/api/mcp/asset/d04fcd4c-26a2-4a7a-a9b5-66fe1331b146.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 380;
  const cardWidth = Math.min(width - 40, 340);

  return (
    <View style={styles.root}>
      <ImageBackground source={{ uri: background }} style={styles.background} imageStyle={styles.backgroundImage} resizeMode="cover">
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safe}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={styles.hero}>
              <Text style={[styles.logoEmoji, compact && { fontSize: 28 }]}>🎬 🎞️ 🇧🇷</Text>
              <Text style={[styles.brand, compact && { fontSize: 31 }]}>MONTENEGRO</Text>
              <Text style={[styles.title, compact && { fontSize: 27 }]}>ENTRE CAPAS E TELAS</Text>
              <Text style={styles.description}>
                Aqui você pode dar sua opinião sobre os filmes, séries e livros brasileiros que marcaram você ou encontrar novas histórias para se apaixonar.
              </Text>
              <Pressable onPress={() => navigation.navigate('Login')} style={({ pressed }) => [styles.enterButton, pressed && styles.pressed]}>
                <Text style={styles.enterText}>Entrar</Text>
              </Pressable>
            </View>

            <View style={styles.cardsWrap}>
              <View style={[styles.card, styles.greenCard, { width: cardWidth }]}>
                <Image source={{ uri: aindaEstouAqui }} style={styles.poster} resizeMode="cover" />
                <Text style={styles.cardTitleLight}>AINDA{`\n`}ESTOU AQUI</Text>
                <Text style={styles.stars}>★★★★★</Text>
                <Text style={styles.question}>Valeu a pena assistir?</Text>
                <View style={styles.answerRow}>
                  <View style={styles.pill}><Text style={styles.pillText}>Sim</Text></View>
                  <View style={[styles.pill, styles.widePill]}><Text style={styles.pillText}>Mais ou menos</Text></View>
                  <View style={styles.pill}><Text style={styles.pillText}>Não</Text></View>
                </View>
              </View>

              <View style={[styles.card, styles.yellowCard, { width: cardWidth }]}>
                <Image source={{ uri: meuPe }} style={[styles.poster, styles.tallPoster]} resizeMode="cover" />
                <Text style={styles.cardTitlePurple}>O MEU PÉ DE{`\n`}LARANJA LIMA</Text>
                <Text style={styles.quote}>“Me adotou emocionalmente”</Text>
              </View>

              <View style={[styles.card, styles.greenCard, { width: cardWidth }]}>
                <View style={styles.cityTop}>
                  <View style={styles.scoreBlock}>
                    <Text style={styles.stars}>★★★★★</Text>
                    <Text style={styles.scoreText}>Roteiro             9{`\n`}Atuação             8{`\n`}Trilha sonora   10{`\n`}Fotografia         9{`\n`}Originalidade   7</Text>
                  </View>
                  <Image source={{ uri: cidadeInvisivel }} style={styles.cityPoster} resizeMode="cover" />
                </View>
                <Text style={styles.cardTitleLight}>CIDADE{`\n`}INVISÍVEL</Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy },
  background: { flex: 1 },
  backgroundImage: { opacity: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(1,0,58,.52)' },
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 38, alignItems: 'center' },
  hero: { width: '100%', maxWidth: 480, alignItems: 'center' },
  logoEmoji: { fontSize: 34, marginBottom: 8 },
  brand: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 38, textAlign: 'center', letterSpacing: .8 },
  title: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 31, lineHeight: 38, textAlign: 'center', marginTop: -2 },
  description: { color: colors.cream, fontFamily: 'Poppins_400Regular', fontSize: 16, lineHeight: 25, textAlign: 'center', marginTop: 28, paddingHorizontal: 4 },
  enterButton: { borderWidth: 1.5, borderColor: '#fff', borderRadius: 999, paddingHorizontal: 42, paddingVertical: 9, marginTop: 26 },
  enterText: { color: colors.cream, fontFamily: 'Poppins_400Regular', fontSize: 22 },
  pressed: { opacity: .72 },
  cardsWrap: { width: '100%', maxWidth: 480, alignItems: 'center', gap: 18, marginTop: 34 },
  card: { borderRadius: 12, paddingHorizontal: 18, paddingVertical: 14, alignItems: 'center', overflow: 'hidden' },
  greenCard: { backgroundColor: '#009B7E' },
  yellowCard: { backgroundColor: '#FFDE59' },
  poster: { width: 106, height: 150, borderRadius: 2, marginBottom: 8 },
  tallPoster: { width: 100, height: 152 },
  cityPoster: { width: 92, height: 130, marginLeft: 12 },
  cityTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' },
  scoreBlock: { paddingTop: 7 },
  cardTitleLight: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 28, lineHeight: 34, textAlign: 'center' },
  cardTitlePurple: { color: colors.purple, fontFamily: 'Cinzel_700Bold', fontSize: 26, lineHeight: 33, textAlign: 'center' },
  stars: { color: '#FFD600', fontSize: 20, letterSpacing: 2, marginTop: 3 },
  question: { color: '#fff', fontFamily: 'Poppins_400Regular', fontSize: 14, marginTop: 2 },
  answerRow: { flexDirection: 'row', gap: 7, marginTop: 7 },
  pill: { backgroundColor: colors.purple, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  widePill: { paddingHorizontal: 15 },
  pillText: { color: '#fff', fontFamily: 'Poppins_400Regular', fontSize: 11 },
  quote: { color: colors.purple, fontFamily: 'Poppins_400Regular', fontSize: 14, alignSelf: 'flex-start', marginTop: 6 },
  scoreText: { color: '#fff', fontFamily: 'Poppins_400Regular', fontSize: 11, lineHeight: 17, marginTop: 10 },
});