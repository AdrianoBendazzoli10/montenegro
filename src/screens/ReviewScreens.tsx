import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { getMediaById } from '../data/media';
import { colors } from '../theme/colors';

type QuickProps = NativeStackScreenProps<RootStackParamList, 'QuickReview'>;
type DetailedProps = NativeStackScreenProps<RootStackParamList, 'DetailedReview'>;

function Header({ navigation }: { navigation: QuickProps['navigation'] | DetailedProps['navigation'] }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></Pressable>
      <Text style={styles.brand}>MONTENEGRO</Text>
      <Pressable onPress={() => navigation.navigate('Profile')}><Text style={styles.profile}>●</Text></Pressable>
    </View>
  );
}

function WorthChoices({ value, onChange }: { value: string | null; onChange: (value: string) => void }) {
  return (
    <View style={styles.worthChoices}>
      {[['☝', 'Sim'], ['☟', 'Não'], ['☝☟', 'Mais ou menos']].map(([icon, label]) => (
        <Pressable key={label} onPress={() => onChange(label)} style={[styles.worthChoice, value === label && styles.worthChoiceSelected]}>
          <Text style={styles.worthIcon}>{icon}</Text><Text style={styles.worthText}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function QuickReviewScreen({ navigation, route }: QuickProps) {
  const item = getMediaById(route.params.id);
  const [rating, setRating] = useState(0);
  const [worthIt, setWorthIt] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const noun = item.kind === 'livro' ? 'livro' : item.kind === 'filme' ? 'filme' : 'série';
  const action = item.kind === 'livro' ? 'ler' : 'assistir';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Header navigation={navigation} />
        <Text style={styles.pageTitle}>AVALIAÇÕES</Text>
        <Text style={styles.mode}>Modo rápido</Text>

        <View style={styles.quickHero}>
          <Image source={{ uri: item.image }} style={styles.cover} resizeMode="cover" />
          <View style={styles.questions}>
            <Text style={styles.workTitle}>{item.title}</Text>
            <Text style={styles.question}>Quantas estrelas esse {noun} merece?</Text>
            <View style={styles.stars}>{[1,2,3,4,5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)} hitSlop={5}><Text style={[styles.star, star <= rating && styles.starActive]}>★</Text></Pressable>
            ))}</View>
            <Text style={styles.question}>Valeu a pena {action} esse {noun}?</Text>
            <WorthChoices value={worthIt} onChange={setWorthIt} />
          </View>
        </View>

        <Text style={styles.commentHeading}>Escreva um comentário:</Text>
        <TextInput value={comment} onChangeText={setComment} multiline placeholder="Digite aqui..." placeholderTextColor="#596170" style={styles.commentBox} />
        <Pressable onPress={() => navigation.navigate('Details', { id: item.id })} style={styles.publishButton}><Text style={styles.publishText}>Publicar avaliação</Text></Pressable>
        <View style={styles.footer}><Text style={styles.footerBrand}>MONTENEGRO</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function DetailedReviewScreen({ navigation, route }: DetailedProps) {
  const item = getMediaById(route.params.id);
  const [rating, setRating] = useState(0);
  const [worthIt, setWorthIt] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const noun = item.kind === 'livro' ? 'livro' : item.kind === 'filme' ? 'filme' : 'série';
  const action = item.kind === 'livro' ? 'ler' : 'assistir';
  const labels = item.kind === 'livro' ? ['Enredo', 'Personagens', 'Fluidez da leitura', 'Ambientação', 'Originalidade'] : item.kind === 'filme' ? ['Roteiro', 'Atuação', 'Trilha sonora', 'Fotografia', 'Originalidade'] : ['Roteiro', 'Elenco', 'Ritmo', 'Fotografia', 'Originalidade'];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Header navigation={navigation} />
        <Text style={styles.pageTitle}>AVALIAÇÕES</Text>
        <Text style={styles.mode}>Modo detalhado</Text>
        <View style={styles.steps}><View style={[styles.step, styles.stepActive]}><Text style={styles.stepActiveText}>1</Text></View><View style={styles.stepLine}/><View style={styles.step}><Text style={styles.stepText}>2</Text></View><View style={styles.stepLine}/><View style={styles.step}><Text style={styles.stepText}>3</Text></View></View>

        <View style={styles.detailedCore}>
          <Text style={styles.question}>Quantas estrelas esse {noun} merece?</Text>
          <View style={styles.stars}>{[1,2,3,4,5].map((star) => <Pressable key={star} onPress={() => setRating(star)}><Text style={[styles.star, star <= rating && styles.starActive]}>★</Text></Pressable>)}</View>
          <Text style={styles.question}>Valeu a pena {action} esse {noun}?</Text>
          <WorthChoices value={worthIt} onChange={setWorthIt} />
        </View>

        <View style={styles.criteriaPanel}>
          <Text style={styles.criteriaTitle}>Critérios</Text>
          {labels.map((label) => (
            <View key={label} style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>{label}</Text>
              <View style={styles.scoreChoices}>{[1,2,3,4,5].map((score) => (
                <Pressable key={score} onPress={() => setScores((old) => ({ ...old, [label]: score }))} style={[styles.scoreCircle, scores[label] === score && styles.scoreCircleActive]}><Text style={[styles.scoreText, scores[label] === score && styles.scoreTextActive]}>{score}</Text></Pressable>
              ))}</View>
            </View>
          ))}
        </View>

        <Text style={styles.commentHeading}>Escreva um comentário:</Text>
        <TextInput value={comment} onChangeText={setComment} multiline placeholder="Digite aqui..." placeholderTextColor="#596170" style={styles.commentBox} />
        <Pressable onPress={() => navigation.navigate('Details', { id: item.id })} style={styles.publishButton}><Text style={styles.publishText}>Publicar avaliação  →</Text></Pressable>
        <View style={styles.footer}><Text style={styles.footerBrand}>MONTENEGRO</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  page: { paddingBottom: 0 },
  header: { marginHorizontal: 18, marginTop: 8, height: 54, backgroundColor: colors.purple, borderRadius: 999, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { color: '#fff', fontSize: 34, lineHeight: 36 },
  brand: { color: '#fff', fontFamily: 'Cinzel_700Bold', fontSize: 18 },
  profile: { color: '#fff', fontSize: 15 },
  pageTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 31, textAlign: 'center', marginTop: 30 },
  mode: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 15, textAlign: 'center' },
  quickHero: { marginTop: 30, paddingHorizontal: 20, flexDirection: 'column', alignItems: 'center' },
  cover: { width: 170, height: 245, borderRadius: 12, backgroundColor: '#eee' },
  questions: { width: '100%', maxWidth: 460, marginTop: 25 },
  workTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 22, marginBottom: 10 },
  question: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 17, lineHeight: 24, marginTop: 13 },
  stars: { flexDirection: 'row', gap: 5, marginTop: 9, marginBottom: 10 },
  star: { color: '#DDD5B4', fontSize: 34 },
  starActive: { color: '#EECB3F' },
  worthChoices: { marginTop: 10, gap: 5 },
  worthChoice: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 6, borderRadius: 8 },
  worthChoiceSelected: { backgroundColor: 'rgba(0,145,114,.11)' },
  worthIcon: { color: '#001A38', width: 29, fontSize: 18 },
  worthText: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 15 },
  commentHeading: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 21, textAlign: 'center', marginTop: 42, marginBottom: 16 },
  commentBox: { marginHorizontal: 20, minHeight: 180, borderWidth: 1, borderColor: '#001A38', borderRadius: 12, padding: 16, textAlignVertical: 'top', color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 13 },
  publishButton: { alignSelf: 'center', minWidth: 210, borderWidth: 1.5, borderColor: colors.purple, borderRadius: 999, paddingHorizontal: 24, paddingVertical: 9, marginTop: 28, marginBottom: 50 },
  publishText: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 13, textAlign: 'center' },
  steps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, paddingHorizontal: 50 },
  step: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#001A38', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  stepActive: { backgroundColor: '#001A38' },
  stepText: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 18 },
  stepActiveText: { color: '#fff', fontFamily: 'Poppins_400Regular', fontSize: 18 },
  stepLine: { flex: 1, maxWidth: 65, height: 1, backgroundColor: '#7D838B' },
  detailedCore: { marginTop: 45, paddingHorizontal: 24, alignSelf: 'center', width: '100%', maxWidth: 470 },
  criteriaPanel: { marginHorizontal: 20, marginTop: 35, borderWidth: 1, borderColor: '#001A38', borderRadius: 14, padding: 16 },
  criteriaTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 20, marginBottom: 12 },
  scoreRow: { marginBottom: 16 },
  scoreLabel: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 13, marginBottom: 8 },
  scoreChoices: { flexDirection: 'row', justifyContent: 'space-between' },
  scoreCircle: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#001A38', alignItems: 'center', justifyContent: 'center' },
  scoreCircleActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  scoreText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
  scoreTextActive: { color: '#fff' },
  footer: { backgroundColor: colors.purple, paddingVertical: 34 },
  footerBrand: { color: '#FFDD56', fontFamily: 'Cinzel_700Bold', fontSize: 24, textAlign: 'center' },
});