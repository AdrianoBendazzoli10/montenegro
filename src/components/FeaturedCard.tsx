import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type FeaturedCardProps = {
  title: string;
  image: string;
  background: string;
  text: string;
  kind: 'poll' | 'quote' | 'ratings';
};

export function FeaturedCard({ title, image, background, text, kind }: FeaturedCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: background }]}>
      <Image source={{ uri: image }} style={styles.cover} resizeMode="cover" />

      {kind === 'ratings' && (
        <View style={styles.ratingWrap}>
          <Text style={styles.stars}>★★★★★</Text>
          <View style={styles.ratingRows}>
            {[
              ['Roteiro', '9'],
              ['Atuação', '8'],
              ['Trilha sonora', '10'],
              ['Fotografia', '9'],
              ['Originalidade', '7'],
            ].map(([label, score]) => (
              <View key={label} style={styles.ratingRow}>
                <Text style={styles.ratingText}>{label}</Text>
                <Text style={styles.ratingText}>{score}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text style={[styles.title, { color: text }]}>{title}</Text>

      {kind === 'poll' && (
        <>
          <Text style={styles.question}>Valeu a pena assistir?</Text>
          <View style={styles.pollRow}>
            {['Sim', 'Mais ou menos', 'Não'].map((label) => (
              <Pressable key={label} style={styles.pollButton}>
                <Text style={styles.pollText}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {kind === 'quote' && <Text style={[styles.quote, { color: text }]}>“Me adotou emocionalmente”</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    minHeight: 310,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 16,
  },
  cover: {
    width: 106,
    height: 150,
    borderRadius: 2,
    marginBottom: 14,
  },
  title: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 27,
    lineHeight: 34,
    textAlign: 'center',
    marginTop: 4,
  },
  stars: {
    color: '#FFD500',
    fontSize: 22,
    letterSpacing: 1,
    marginBottom: 8,
  },
  question: {
    color: colors.cream,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginTop: 8,
  },
  pollRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  pollButton: {
    backgroundColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pollText: {
    color: colors.white,
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },
  quote: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  ratingWrap: {
    width: '100%',
    marginBottom: 10,
  },
  ratingRows: {
    width: '100%',
    gap: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingText: {
    color: colors.cream,
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },
});
