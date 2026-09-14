import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

const background = 'https://www.figma.com/api/mcp/asset/7fd76408-3ac8-4e14-a508-fcdd6a66c5b1.png';
const aindaEstouAqui = 'https://www.figma.com/api/mcp/asset/13c59bd1-526c-4371-8f6d-d76b6ec9f814.png';
const meuPe = 'https://www.figma.com/api/mcp/asset/e14439f8-da0c-4dab-9668-301aac7d251e.png';
const cidadeInvisivel = 'https://www.figma.com/api/mcp/asset/98d0ecd5-e1d6-497f-b8e7-13aa26c078d9.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const compact = width < 380;
  const cardWidth = Math.min(width - 40, 340);

  return (
    <View style={styles.root}>
      <ImageBackground source={{ uri: background }} style={styles.background} imageStyle={styles.backgroundImage} resizeMode="cover">
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safe}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, wide && styles.contentWide]}>
            <View style={[styles.hero, wide && styles.heroWide]}>
              <Text style={[styles.logoEmoji, wide && styles.logoEmojiWide, compact && { fontSize: 28 }]}>🎬  🪑  🇧🇷</Text>
              <Text style={[styles.brand, wide && styles.brandWide, compact && { fontSize: 31 }]}>MONTENEGRO</Text>
              <Text style={[styles.title, wide && styles.titleWide, compact && { fontSize: 27 }]}>ENTRE CAPAS E TELAS</Text>
              <Text style={[styles.description, wide && styles.descriptionWide]}>Aqui você pode dar sua opinião sobre os filmes, séries e livros brasileiros que marcaram você ou encontrar novas histórias para se apaixonar.</Text>
              <Pressable onPress={() => navigation.navigate('Login')} style={({ pressed }) => [styles.enterButton, wide && styles.enterButtonWide, pressed && styles.pressed]}><Text style={[styles.enterText, wide && styles.enterTextWide]}>Entrar</Text></Pressable>
            </View>

            <View style={[styles.cardsWrap, wide && styles.cardsWrapWide]}>
              <View style={[styles.card, styles.greenCard, wide ? styles.cardWide : { width: cardWidth }]}>
                <Image source={{ uri: aindaEstouAqui }} style={[styles.poster, wide && styles.posterWide]} resizeMode="cover" />
                <Text style={[styles.cardTitleLight, wide && styles.cardTitleWide]}>AINDA{`\n`}ESTOU AQUI</Text>
                <Text style={styles.stars}>★★★★★</Text>
                <Text style={styles.question}>Valeu a pena assistir?</Text>
                <View style={styles.answerRow}><View style={styles.pill}><Text style={styles.pillText}>Sim</Text></View><View style={[styles.pill, styles.widePill]}><Text style={styles.pillText}>Mais ou menos</Text></View><View style={styles.pill}><Text style={styles.pillText}>Não</Text></View></View>
              </View>

              <View style={[styles.card, styles.yellowCard, wide ? styles.cardWide : { width: cardWidth }]}>
                <Image source={{ uri: meuPe }} style={[styles.poster, styles.tallPoster, wide && styles.posterWide]} resizeMode="cover" />
                <Text style={[styles.cardTitlePurple, wide && styles.cardTitleWide]}>O MEU PÉ DE{`\n`}LARANJA LIMA</Text>
                <Text style={styles.quote}>“Me adotou emocionalmente”</Text>
              </View>

              <View style={[styles.card, styles.greenCard, wide ? styles.cardWide : { width: cardWidth }]}>
                <View style={styles.cityTop}><View style={styles.scoreBlock}><Text style={styles.stars}>★★★★★</Text><Text style={styles.scoreText}>Roteiro             9{`\n`}Atuação             8{`\n`}Trilha sonora   10{`\n`}Fotografia         9{`\n`}Originalidade   7</Text></View><Image source={{ uri: cidadeInvisivel }} style={[styles.cityPoster, wide && styles.cityPosterWide]} resizeMode="cover" /></View>
                <Text style={[styles.cardTitleLight, wide && styles.cardTitleWide]}>CIDADE{`\n`}INVISÍVEL</Text>
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
  contentWide: { minHeight: 1095, justifyContent: 'center', paddingTop: 45, paddingBottom: 70 },
  hero: { width: '100%', maxWidth: 480, alignItems: 'center' },
  heroWide: { maxWidth: 850 },
  logoEmoji: { fontSize: 34, marginBottom: 8 },
  logoEmojiWide: { fontSize: 64, marginBottom: 4 },
  brand: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 38, textAlign: 'center', letterSpacing: 0.8 },
  brandWide: { fontSize: 64, lineHeight: 78 },
  title: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 31, lineHeight: 38, textAlign: 'center', marginTop: -2 },
  titleWide: { fontSize: 64, lineHeight: 78, marginTop: -14 },
  description: { color: colors.cream, fontFamily: 'Poppins_400Regular', fontSize: 16, lineHeight: 25, textAlign: 'center', marginTop: 28, paddingHorizontal: 4 },
  descriptionWide: { maxWidth: 685, fontSize: 25, lineHeight: 36, marginTop: 48 },
  enterButton: { borderWidth: 1.5, borderColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 42, paddingVertical: 9, marginTop: 26 },
  enterButtonWide: { width: 213, height: 72, alignItems: 'center', justifyContent: 'center', marginTop: 34 },
  enterText: { color: colors.cream, fontFamily: 'Poppins_400Regular', fontSize: 22 },
  enterTextWide: { fontSize: 31 },
  pressed: { opacity: 0.72 },
  cardsWrap: { width: '100%', maxWidth: 480, alignItems: 'center', gap: 18, marginTop: 34 },
  cardsWrapWide: { maxWidth: 920, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', gap: 29, marginTop: 55 },
  card: { borderRadius: 12, paddingHorizontal: 18, paddingVertical: 14, alignItems: 'center', overflow: 'hidden' },
  cardWide: { width: 287, height: 351, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 12, justifyContent: 'flex-start' },
  greenCard: { backgroundColor: '#009172' },
  yellowCard: { backgroundColor: '#FFDD56' },
  poster: { width: 106, height: 150, borderRadius: 2, marginBottom: 8 },
  posterWide: { width: 109, height: 155 },
  tallPoster: { width: 100, height: 152 },
  cityPoster: { width: 92, height: 130, marginLeft: 12 },
  cityPosterWide: { width: 101, height: 141 },
  cityTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' },
  scoreBlock: { paddingTop: 7 },
  cardTitleLight: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 28, lineHeight: 34, textAlign: 'center' },
  cardTitlePurple: { color: colors.purple, fontFamily: 'Cinzel_700Bold', fontSize: 26, lineHeight: 33, textAlign: 'center' },
  cardTitleWide: { fontSize: 31, lineHeight: 39 },
  stars: { color: '#FFD600', fontSize: 20, letterSpacing: 2, marginTop: 3 },
  question: { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontSize: 14, marginTop: 2 },
  answerRow: { flexDirection: 'row', gap: 7, marginTop: 7 },
  pill: { backgroundColor: colors.purple, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  widePill: { paddingHorizontal: 15 },
  pillText: { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontSize: 11 },
  quote: { color: colors.purple, fontFamily: 'Poppins_400Regular', fontSize: 14, alignSelf: 'flex-start', marginTop: 6 },
  scoreText: { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontSize: 11, lineHeight: 17, marginTop: 10 },
});
