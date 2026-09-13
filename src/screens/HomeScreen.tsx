import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

const background = 'https://www.figma.com/api/mcp/asset/23ceab87-8cf0-46ce-8f4b-46e4edd94537.png';
const logo = 'https://www.figma.com/api/mcp/asset/15244d68-8642-4ed9-8ccb-40456a8923df.png';
const aindaEstouAqui = 'https://www.figma.com/api/mcp/asset/280b49f0-ecc9-45bd-aad6-003e8bc1133f.png';
const meuPe = 'https://www.figma.com/api/mcp/asset/096f491b-4897-4c01-b6ee-3f6f31edfa1f.png';
const cidadeInvisivel = 'https://www.figma.com/api/mcp/asset/f109d143-c2b2-40d2-9964-3cfd7417b015.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const phone = width < 600;
  const compact = width < 380;
  const cardWidth = phone ? Math.min(width - 72, 287) : 287;

  return (
    <View style={styles.root}>
      <ImageBackground source={{ uri: background }} style={styles.background} imageStyle={styles.backgroundImage} resizeMode="cover">
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safe}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, phone && styles.contentPhone]}>
            <View style={styles.hero}>
              <Image source={{ uri: logo }} style={[styles.logo, phone && styles.logoPhone]} resizeMode="contain" />
              <Text style={[styles.brand, phone && styles.brandPhone, compact && styles.brandCompact]}>MONTENEGRO</Text>
              <Text style={[styles.title, phone && styles.titlePhone, compact && styles.titleCompact]}>ENTRE CAPAS E TELAS</Text>
              <Text style={[styles.description, phone && styles.descriptionPhone]}>
                Aqui você pode dar sua opinião sobre os filmes, séries e livros brasileiros que marcaram você ou encontrar novas histórias para se apaixonar.
              </Text>
              <Pressable onPress={() => navigation.navigate('Login')} style={({ pressed }) => [styles.enterButton, phone && styles.enterButtonPhone, pressed && styles.pressed]}>
                <Text style={[styles.enterText, phone && styles.enterTextPhone]}>Entrar</Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.cardsWrap, phone && styles.cardsWrapPhone]}
              style={styles.cardsScroller}
              snapToInterval={phone ? cardWidth + 18 : undefined}
              decelerationRate={phone ? 'fast' : 'normal'}
            >
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
                <Image source={{ uri: meuPe }} style={styles.posterBook} resizeMode="cover" />
                <Text style={styles.cardTitlePurple}>O MEU PÉ DE{`\n`}LARANJA LIMA</Text>
                <Text style={styles.quote}>“Me adotou emocionalmente”</Text>
              </View>

              <View style={[styles.card, styles.greenCard, { width: cardWidth }]}>
                <View style={styles.cityTop}>
                  <View style={styles.scoreBlock}>
                    <Text style={styles.stars}>★★★★★</Text>
                    <View style={styles.scoreRow}><Text style={styles.scoreText}>Roteiro</Text><Text style={styles.scoreText}>9</Text></View>
                    <View style={styles.scoreRow}><Text style={styles.scoreText}>Atuação</Text><Text style={styles.scoreText}>8</Text></View>
                    <View style={styles.scoreRow}><Text style={styles.scoreText}>Trilha sonora</Text><Text style={styles.scoreText}>10</Text></View>
                    <View style={styles.scoreRow}><Text style={styles.scoreText}>Fotografia</Text><Text style={styles.scoreText}>9</Text></View>
                    <View style={styles.scoreRow}><Text style={styles.scoreText}>Originalidade</Text><Text style={styles.scoreText}>7</Text></View>
                  </View>
                  <Image source={{ uri: cidadeInvisivel }} style={styles.cityPoster} resizeMode="cover" />
                </View>
                <Text style={styles.cardTitleLight}>CIDADE{`\n`}INVISÍVEL</Text>
              </View>
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
  backgroundImage: { opacity: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(1,0,58,.20)' },
  safe: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 46, paddingBottom: 50, alignItems: 'center' },
  contentPhone: { paddingHorizontal: 0, paddingTop: 22, paddingBottom: 34 },
  hero: { width: '100%', maxWidth: 760, alignItems: 'center', paddingHorizontal: 20 },
  logo: { width: 235, height: 88, marginBottom: -4 },
  logoPhone: { width: 170, height: 64, marginBottom: 2 },
  brand: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 52, lineHeight: 62, textAlign: 'center', letterSpacing: .4 },
  brandPhone: { fontSize: 38, lineHeight: 45 },
  brandCompact: { fontSize: 32, lineHeight: 39 },
  title: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 52, lineHeight: 60, textAlign: 'center', marginTop: -4 },
  titlePhone: { fontSize: 30, lineHeight: 37, marginTop: 0 },
  titleCompact: { fontSize: 27, lineHeight: 33 },
  description: { color: colors.cream, fontFamily: 'Poppins_400Regular', fontSize: 22, lineHeight: 33, textAlign: 'center', marginTop: 42, maxWidth: 690 },
  descriptionPhone: { fontSize: 15, lineHeight: 23, marginTop: 24, maxWidth: 430 },
  enterButton: { width: 213, height: 60, borderWidth: 2, borderColor: '#fff', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 30 },
  enterButtonPhone: { width: 170, height: 50, marginTop: 22 },
  enterText: { color: colors.cream, fontFamily: 'Poppins_400Regular', fontSize: 28 },
  enterTextPhone: { fontSize: 21 },
  pressed: { opacity: .72 },
  cardsScroller: { width: '100%', maxWidth: 980, marginTop: 46 },
  cardsWrap: { flexGrow: 1, justifyContent: 'center', gap: 28, paddingHorizontal: 18 },
  cardsWrapPhone: { justifyContent: 'flex-start', gap: 18, paddingHorizontal: 24, paddingRight: 42 },
  card: { height: 351, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 12, alignItems: 'center', overflow: 'hidden' },
  greenCard: { backgroundColor: colors.green },
  yellowCard: { backgroundColor: colors.yellow },
  poster: { width: 109, height: 155, marginBottom: 3 },
  posterBook: { width: 110, height: 167, marginBottom: 4 },
  cityPoster: { width: 101, height: 141, marginLeft: 10, marginTop: 24 },
  cityTop: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' },
  scoreBlock: { width: 132, paddingTop: 12 },
  cardTitleLight: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 29, lineHeight: 36, textAlign: 'center' },
  cardTitlePurple: { color: colors.purple, fontFamily: 'Cinzel_700Bold', fontSize: 27, lineHeight: 35, textAlign: 'center', marginTop: 5 },
  stars: { color: '#FFD600', fontSize: 19, lineHeight: 24, letterSpacing: 1.5 },
  question: { color: colors.cream, fontFamily: 'Poppins_400Regular', fontSize: 14, lineHeight: 20, marginTop: -1 },
  answerRow: { flexDirection: 'row', gap: 7, marginTop: 5 },
  pill: { backgroundColor: colors.purple, borderRadius: 30, paddingHorizontal: 12, height: 24, justifyContent: 'center' },
  widePill: { paddingHorizontal: 14 },
  pillText: { color: '#fff', fontFamily: 'Poppins_400Regular', fontSize: 11 },
  quote: { color: colors.purple, fontFamily: 'Poppins_400Regular', fontSize: 13, alignSelf: 'flex-start', marginTop: 5 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between' },
  scoreText: { color: colors.cream, fontFamily: 'Poppins_400Regular', fontSize: 10, lineHeight: 16 },
});