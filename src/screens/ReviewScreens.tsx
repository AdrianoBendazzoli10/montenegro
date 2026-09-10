import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { getMediaById } from '../data/media';
import { ScreenShell } from '../components/ScreenShell';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';

type QuickProps = NativeStackScreenProps<RootStackParamList, 'QuickReview'>;
type DetailedProps = NativeStackScreenProps<RootStackParamList, 'DetailedReview'>;

export function QuickReviewScreen({ navigation, route }: QuickProps) {
  const item = getMediaById(route.params.id);
  const [rating, setRating] = useState(0);
  const [worthIt, setWorthIt] = useState<string | null>(null);

  return (
    <ScreenShell title="Avaliação rápida" subtitle={item.title} onBack={() => navigation.goBack()}>
      <View style={styles.panel}>
        <Text style={styles.question}>Que nota você dá?</Text>
        <View style={styles.stars}>{[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)}><Text style={[styles.star, star <= rating && styles.starActive]}>★</Text></Pressable>
        ))}</View>
        <Text style={styles.question}>Valeu a pena?</Text>
        <View style={styles.choices}>{['Sim', 'Mais ou menos', 'Não'].map((choice) => (
          <Pressable key={choice} onPress={() => setWorthIt(choice)} style={[styles.choice, worthIt === choice && styles.choiceActive]}>
            <Text style={styles.choiceText}>{choice}</Text>
          </Pressable>
        ))}</View>
        <AppButton label="Salvar avaliação" onPress={() => navigation.navigate('Details', { id: item.id })} style={styles.save} />
      </View>
    </ScreenShell>
  );
}

export function DetailedReviewScreen({ navigation, route }: DetailedProps) {
  const item = getMediaById(route.params.id);
  const labels = item.kind === 'livro'
    ? ['História', 'Personagens', 'Escrita', 'Emoção', 'Originalidade']
    : item.kind === 'filme'
      ? ['Roteiro', 'Atuação', 'Trilha sonora', 'Fotografia', 'Originalidade']
      : ['Roteiro', 'Elenco', 'Ritmo', 'Fotografia', 'Originalidade'];
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');

  return (
    <ScreenShell title="Avaliação detalhada" subtitle={item.title} onBack={() => navigation.goBack()}>
      <View style={styles.panel}>
        {labels.map((label) => (
          <View key={label} style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>{label}</Text>
            <View style={styles.scoreChoices}>{[1, 2, 3, 4, 5].map((score) => (
              <Pressable key={score} onPress={() => setScores((old) => ({ ...old, [label]: score }))} style={[styles.score, scores[label] === score && styles.scoreActive]}>
                <Text style={styles.scoreText}>{score}</Text>
              </Pressable>
            ))}</View>
          </View>
        ))}
        <Text style={styles.commentLabel}>Escreva um comentário</Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          multiline
          placeholder="O que mais te marcou nessa obra?"
          placeholderTextColor="#8584A5"
          style={styles.comment}
        />
        <AppButton label="Publicar avaliação" variant="secondary" onPress={() => navigation.navigate('Details', { id: item.id })} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  panel: { backgroundColor: 'rgba(52,51,153,.24)', borderRadius: 24, padding: 20, marginTop: 12, borderWidth: 1, borderColor: 'rgba(237,231,219,.1)' },
  question: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 21, textAlign: 'center', marginTop: 8, marginBottom: 14 },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: 7, marginBottom: 30 },
  star: { color: 'rgba(237,231,219,.25)', fontSize: 40 },
  starActive: { color: colors.yellow },
  choices: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  choice: { flex: 1, minHeight: 42, borderRadius: 22, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  choiceActive: { backgroundColor: colors.green, borderWidth: 1, borderColor: colors.cream },
  choiceText: { color: colors.cream, fontFamily: 'Poppins_600SemiBold', fontSize: 11, textAlign: 'center' },
  save: { marginTop: 28 },
  scoreRow: { marginBottom: 18 },
  scoreLabel: { color: colors.cream, fontFamily: 'Poppins_600SemiBold', fontSize: 14, marginBottom: 8 },
  scoreChoices: { flexDirection: 'row', gap: 8 },
  score: { flex: 1, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,.08)', alignItems: 'center', justifyContent: 'center' },
  scoreActive: { backgroundColor: colors.green },
  scoreText: { color: colors.cream, fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  commentLabel: { color: colors.cream, fontFamily: 'Poppins_600SemiBold', fontSize: 14, marginBottom: 8 },
  comment: { minHeight: 120, borderRadius: 16, backgroundColor: 'rgba(255,255,255,.07)', color: colors.cream, padding: 14, fontFamily: 'Poppins_400Regular', textAlignVertical: 'top', marginBottom: 22 },
});
