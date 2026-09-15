import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useEffect, useRef } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

const background =
  'https://www.figma.com/api/mcp/asset/7fd76408-3ac8-4e14-a508-fcdd6a66c5b1.png';

const aindaEstouAqui =
  'https://www.figma.com/api/mcp/asset/13c59bd1-526c-4371-8f6d-d76b6ec9f814.png';

const meuPe =
  'https://www.figma.com/api/mcp/asset/e14439f8-da0c-4dab-9668-301aac7d251e.png';

const cidadeInvisivel =
  'https://www.figma.com/api/mcp/asset/98d0ecd5-e1d6-497f-b8e7-13aa26c078d9.png';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

export function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();

  const wide = width >= 900;
  const compact = width < 380;
  const cardWidth = Math.min(width - 40, 340);

  const heroOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const heroTranslate = useRef(
    new Animated.Value(25),
  ).current;

  const buttonScale = useRef(
    new Animated.Value(1),
  ).current;

  const cardOneOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const cardOneTranslate = useRef(
    new Animated.Value(35),
  ).current;

  const cardTwoOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const cardTwoTranslate = useRef(
    new Animated.Value(35),
  ).current;

  const cardThreeOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const cardThreeTranslate = useRef(
    new Animated.Value(35),
  ).current;

  const floatOne = useRef(
    new Animated.Value(0),
  ).current;

  const floatTwo = useRef(
    new Animated.Value(0),
  ).current;

  const floatThree = useRef(
    new Animated.Value(0),
  ).current;

  const glow = useRef(
    new Animated.Value(0.45),
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(heroTranslate, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.sequence([
        Animated.delay(250),

        Animated.parallel([
          Animated.timing(cardOneOpacity, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),

          Animated.timing(cardOneTranslate, {
            toValue: 0,
            duration: 650,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(cardTwoOpacity, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),

          Animated.timing(cardTwoTranslate, {
            toValue: 0,
            duration: 650,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(cardThreeOpacity, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),

          Animated.timing(cardThreeTranslate, {
            toValue: 0,
            duration: 650,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    const createFloatAnimation = (
      value: Animated.Value,
      delay: number,
      distance: number,
      duration: number,
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),

          Animated.timing(value, {
            toValue: -distance,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),

          Animated.timing(value, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );
    };

    createFloatAnimation(
      floatOne,
      900,
      6,
      2200,
    ).start();

    createFloatAnimation(
      floatTwo,
      1300,
      8,
      2500,
    ).start();

    createFloatAnimation(
      floatThree,
      1700,
      5,
      2100,
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 0.9,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(glow, {
          toValue: 0.45,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [
    heroOpacity,
    heroTranslate,
    cardOneOpacity,
    cardOneTranslate,
    cardTwoOpacity,
    cardTwoTranslate,
    cardThreeOpacity,
    cardThreeTranslate,
    floatOne,
    floatTwo,
    floatThree,
    glow,
  ]);

  function pressButton() {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.94,
        duration: 90,
        useNativeDriver: true,
      }),

      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      navigation.navigate('Login');
    }, 80);
  }

  return (
    <View style={styles.root}>
      <ImageBackground
        source={{ uri: background }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.decorations}>
          <Animated.View
            style={[
              styles.circle,
              styles.circleOne,
              {
                opacity: glow,
                transform: [
                  {
                    translateY: floatOne,
                  },
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.circle,
              styles.circleTwo,
              {
                opacity: glow,
                transform: [
                  {
                    translateY: floatTwo,
                  },
                ],
              },
            ]}
          />

          <View style={styles.verticalLine} />

          <View style={styles.horizontalLine} />
        </View>

        <SafeAreaView style={styles.safe}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              wide && styles.contentWide,
            ]}
          >
            <Animated.View
              style={[
                styles.hero,
                wide && styles.heroWide,
                {
                  opacity: heroOpacity,
                  transform: [
                    {
                      translateY: heroTranslate,
                    },
                  ],
                },
              ]}
            >
              <View style={styles.logoMark}>
                <View style={styles.logoLine} />
                <View style={styles.logoDot} />
                <View style={styles.logoLine} />
              </View>

              <Text
                style={[
                  styles.brand,
                  wide && styles.brandWide,
                  compact && styles.brandCompact,
                ]}
              >
                MONTENEGRO
              </Text>

              <Text
                style={[
                  styles.title,
                  wide && styles.titleWide,
                  compact && styles.titleCompact,
                ]}
              >
                ENTRE CAPAS E TELAS
              </Text>

              <View style={styles.titleLine}>
                <View style={styles.titleLineSide} />

                <View style={styles.titleLineCenter} />

                <View style={styles.titleLineSide} />
              </View>

              <Text
                style={[
                  styles.description,
                  wide && styles.descriptionWide,
                ]}
              >
                Aqui você pode dar sua opinião
                sobre os filmes, séries e livros
                brasileiros que marcaram você ou
                encontrar novas histórias para se
                apaixonar.
              </Text>

              <Animated.View
                style={{
                  transform: [
                    {
                      scale: buttonScale,
                    },
                  ],
                }}
              >
                <Pressable
                  onPress={pressButton}
                  style={({ pressed }) => [
                    styles.enterButton,
                    wide && styles.enterButtonWide,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.enterText,
                      wide && styles.enterTextWide,
                    ]}
                  >
                    Entrar
                  </Text>

                  <View style={styles.buttonArrow}>
                    <Text style={styles.arrowText}>
                      →
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>
            </Animated.View>

            <View
              style={[
                styles.cardsWrap,
                wide && styles.cardsWrapWide,
              ]}
            >
              <Animated.View
                style={[
                  styles.cardAnimation,
                  {
                    opacity: cardOneOpacity,
                    transform: [
                      {
                        translateY: Animated.add(
                          cardOneTranslate,
                          floatOne,
                        ),
                      },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    styles.card,
                    styles.greenCard,
                    wide
                      ? styles.cardWide
                      : { width: cardWidth },
                  ]}
                >
                  <View style={styles.cardAccent} />

                  <Image
                    source={{
                      uri: aindaEstouAqui,
                    }}
                    style={[
                      styles.poster,
                      wide && styles.posterWide,
                    ]}
                    resizeMode="cover"
                  />

                  <Text
                    style={[
                      styles.cardTitleLight,
                      wide && styles.cardTitleWide,
                    ]}
                  >
                    AINDA
                    {`\n`}
                    ESTOU AQUI
                  </Text>

                  <Text style={styles.stars}>
                    ★★★★★
                  </Text>

                  <Text style={styles.question}>
                    Valeu a pena assistir?
                  </Text>

                  <View style={styles.answerRow}>
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>
                        Sim
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.pill,
                        styles.widePill,
                      ]}
                    >
                      <Text style={styles.pillText}>
                        Mais ou menos
                      </Text>
                    </View>

                    <View style={styles.pill}>
                      <Text style={styles.pillText}>
                        Não
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.cardAnimation,
                  {
                    opacity: cardTwoOpacity,
                    transform: [
                      {
                        translateY: Animated.add(
                          cardTwoTranslate,
                          floatTwo,
                        ),
                      },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    styles.card,
                    styles.yellowCard,
                    wide
                      ? styles.cardWide
                      : { width: cardWidth },
                  ]}
                >
                  <View
                    style={[
                      styles.cardAccent,
                      styles.cardAccentPurple,
                    ]}
                  />

                  <Image
                    source={{
                      uri: meuPe,
                    }}
                    style={[
                      styles.poster,
                      styles.tallPoster,
                      wide && styles.posterWide,
                    ]}
                    resizeMode="cover"
                  />

                  <Text
                    style={[
                      styles.cardTitlePurple,
                      wide && styles.cardTitleWide,
                    ]}
                  >
                    O MEU PÉ DE
                    {`\n`}
                    LARANJA LIMA
                  </Text>

                  <View style={styles.quoteBox}>
                    <Text style={styles.quoteMark}>
                      “
                    </Text>

                    <Text style={styles.quote}>
                      Me adotou emocionalmente
                    </Text>
                  </View>
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.cardAnimation,
                  {
                    opacity: cardThreeOpacity,
                    transform: [
                      {
                        translateY: Animated.add(
                          cardThreeTranslate,
                          floatThree,
                        ),
                      },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    styles.card,
                    styles.greenCard,
                    wide
                      ? styles.cardWide
                      : { width: cardWidth },
                  ]}
                >
                  <View style={styles.cardAccent} />

                  <View style={styles.cityTop}>
                    <View
                      style={styles.scoreBlock}
                    >
                      <Text style={styles.stars}>
                        ★★★★★
                      </Text>

                      <Text
                        style={styles.scoreText}
                      >
                        Roteiro             9
                        {`\n`}
                        Atuação             8
                        {`\n`}
                        Trilha sonora   10
                        {`\n`}
                        Fotografia         9
                        {`\n`}
                        Originalidade   7
                      </Text>
                    </View>

                    <Image
                      source={{
                        uri: cidadeInvisivel,
                      }}
                      style={[
                        styles.cityPoster,
                        wide &&
                          styles.cityPosterWide,
                      ]}
                      resizeMode="cover"
                    />
                  </View>

                  <Text
                    style={[
                      styles.cardTitleLight,
                      wide && styles.cardTitleWide,
                    ]}
                  >
                    CIDADE
                    {`\n`}
                    INVISÍVEL
                  </Text>

                  <View style={styles.ratingLabel}>
                    <Text
                      style={styles.ratingLabelText}
                    >
                      AVALIAÇÃO DO MONTENEGRO
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </View>

            <Animated.View
              style={[
                styles.bottomMessage,
                {
                  opacity: heroOpacity,
                },
              ]}
            >
              <View style={styles.bottomLine} />

              <Text style={styles.bottomText}>
                histórias que ficam com você
              </Text>

              <View style={styles.bottomLine} />
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.navy,
  },

  background: {
    flex: 1,
  },

  backgroundImage: {
    opacity: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(1, 0, 58, 0.63)',
  },

  safe: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 55,
    alignItems: 'center',
  },

  contentWide: {
    minHeight: 1095,
    justifyContent: 'center',
    paddingTop: 55,
    paddingBottom: 75,
  },

  /* decoração do fundo */

  decorations: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
  },

  circle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor:
      'rgba(255, 255, 255, 0.16)',
    borderRadius: 999,
  },

  circleOne: {
    width: 270,
    height: 270,
    right: -120,
    top: 90,
  },

  circleTwo: {
    width: 190,
    height: 190,
    left: -95,
    bottom: 160,
  },

  verticalLine: {
    position: 'absolute',
    width: 1,
    height: 180,
    right: 40,
    top: 260,
    backgroundColor:
      'rgba(255, 255, 255, 0.08)',
  },

  horizontalLine: {
    position: 'absolute',
    width: 160,
    height: 1,
    left: -50,
    top: 310,
    backgroundColor:
      'rgba(255, 255, 255, 0.08)',
  },

  /* hero */

  hero: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
  },

  heroWide: {
    maxWidth: 850,
  },

  logoMark: {
    width: 56,
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginBottom: 12,
  },

  logoLine: {
    width: 17,
    height: 1,
    backgroundColor: colors.cream,
    opacity: 0.8,
  },

  logoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.cream,
    backgroundColor: 'transparent',
  },

  brand: {
    color: colors.cream,
    fontFamily: 'Cinzel_700Bold',
    fontSize: 38,
    textAlign: 'center',
    letterSpacing: 1.4,
  },

  brandWide: {
    fontSize: 64,
    lineHeight: 78,
  },

  brandCompact: {
    fontSize: 31,
  },

  title: {
    color: colors.cream,
    fontFamily: 'Cinzel_700Bold',
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'center',
    marginTop: 1,
    letterSpacing: 0.4,
  },

  titleWide: {
    fontSize: 60,
    lineHeight: 74,
    marginTop: -12,
  },

  titleCompact: {
    fontSize: 25,
  },

  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 14,
  },

  titleLineSide: {
    width: 25,
    height: 1,
    backgroundColor: colors.green,
  },

  titleLineCenter: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.green,
  },

  description: {
    color: colors.cream,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 22,
    paddingHorizontal: 8,
    opacity: 0.92,
  },

  descriptionWide: {
    maxWidth: 685,
    fontSize: 19,
    lineHeight: 31,
    marginTop: 38,
  },

  enterButton: {
    minWidth: 145,
    height: 47,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 999,
    paddingHorizontal: 23,
    marginTop: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    backgroundColor:
      'rgba(255,255,255,0.07)',
  },

  enterButtonWide: {
    width: 213,
    height: 62,
    marginTop: 34,
  },

  enterText: {
    color: colors.cream,
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
  },

  enterTextWide: {
    fontSize: 18,
  },

  buttonArrow: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 16,
  },

  pressed: {
    opacity: 0.72,
  },

  /* cards */

  cardsWrap: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    gap: 18,
    marginTop: 43,
  },

  cardsWrapWide: {
    maxWidth: 920,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 24,
    marginTop: 58,
  },

  cardAnimation: {
    alignSelf: 'center',
  },

  card: {
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 17,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.12)',
  },

  cardWide: {
    width: 287,
    height: 365,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },

  greenCard: {
    backgroundColor: '#009172',
  },

  yellowCard: {
    backgroundColor: '#FFDD56',
  },

  cardAccent: {
    position: 'absolute',
    width: 55,
    height: 3,
    borderRadius: 2,
    backgroundColor:
      'rgba(255,255,255,0.65)',
    top: 0,
  },

  cardAccentPurple: {
    backgroundColor:
      'rgba(91,54,105,0.5)',
  },

  poster: {
    width: 106,
    height: 150,
    borderRadius: 3,
    marginBottom: 9,
  },

  posterWide: {
    width: 109,
    height: 155,
  },

  tallPoster: {
    width: 100,
    height: 152,
  },

  cityPoster: {
    width: 92,
    height: 130,
    marginLeft: 12,
    borderRadius: 3,
  },

  cityPosterWide: {
    width: 101,
    height: 141,
  },

  cityTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  scoreBlock: {
    paddingTop: 7,
  },

  cardTitleLight: {
    color: colors.cream,
    fontFamily: 'Cinzel_700Bold',
    fontSize: 25,
    lineHeight: 31,
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  cardTitlePurple: {
    color: colors.purple,
    fontFamily: 'Cinzel_700Bold',
    fontSize: 24,
    lineHeight: 31,
    textAlign: 'center',
  },

  cardTitleWide: {
    fontSize: 28,
    lineHeight: 36,
  },

  stars: {
    color: '#FFD600',
    fontSize: 18,
    letterSpacing: 2,
    marginTop: 4,
  },

  question: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginTop: 3,
  },

  answerRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 7,
  },

  pill: {
    backgroundColor: colors.purple,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  widePill: {
    paddingHorizontal: 12,
  },

  pillText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
  },

  quoteBox: {
    width: '100%',
    marginTop: 5,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  quoteMark: {
    color: colors.purple,
    fontFamily: 'Cinzel_700Bold',
    fontSize: 22,
    lineHeight: 20,
    marginRight: 3,
  },

  quote: {
    flex: 1,
    color: colors.purple,
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },

  scoreText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    lineHeight: 17,
    marginTop: 9,
  },

  ratingLabel: {
    marginTop: 8,
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.3)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  ratingLabelText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 6.5,
    letterSpacing: 0.8,
  },

  /* mensagem inferior */

  bottomMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 42,
    opacity: 0.8,
  },

  bottomLine: {
    width: 25,
    height: 1,
    backgroundColor:
      'rgba(255,255,255,0.5)',
  },

  bottomText: {
    color: colors.cream,
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});