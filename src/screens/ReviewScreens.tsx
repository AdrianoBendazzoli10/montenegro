import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList, MediaKind } from '../navigation/types';
import { getMediaById } from '../data/media';
import { colors } from '../theme/colors';
import { api, resolveBackendWorkId, type ApiWork } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

type QuickProps = NativeStackScreenProps<RootStackParamList, 'QuickReview'>;
type DetailedProps = NativeStackScreenProps<RootStackParamList, 'DetailedReview'>;

type WorkView = {
  id: string;
  backendId: number | null;
  title: string;
  kind: MediaKind;
  image: string;
};

function useReviewWork(id: string) {
  const local = getMediaById(id);
  const backendId = resolveBackendWorkId(id);
  const fallback = useMemo<WorkView>(() => ({
    id: local.id,
    backendId: Number.isFinite(backendId) ? backendId : null,
    title: local.title,
    kind: local.kind,
    image: local.image,
  }), [backendId, local]);
  const [work, setWork] = useState<WorkView>(fallback);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    if (!Number.isFinite(backendId)) return () => { active = false; };
    api.getWork(backendId)
      .then(({ work: apiWork }: { work: ApiWork }) => {
        if (!active) return;
        setWork({
          id: String(apiWork.id),
          backendId: apiWork.id,
          title: apiWork.title,
          kind: apiWork.kind,
          image: apiWork.image_url || fallback.image,
        });
        setLoadError('');
      })
      .catch((error) => {
        if (!active) return;
        setWork(fallback);
        setLoadError(error instanceof Error ? error.message : 'Não foi possível carregar a obra.');
      });
    return () => { active = false; };
  }, [backendId, fallback]);

  return { work, loadError };
}

function nounAndAction(kind: MediaKind) {
  if (kind === 'livro') return { noun: 'livro', action: 'ler' };
  if (kind === 'filme') return { noun: 'filme', action: 'assistir' };
  return { noun: 'série', action: 'assistir' };
}

function RatingStars({ value, onChange, large = false }: { value: number; onChange: (value: number) => void; large?: boolean }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onChange(star)} hitSlop={6}>
          <Text style={[styles.star, large && styles.starLarge, star <= value && styles.starActive]}>★</Text>
        </Pressable>
      ))}
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

function PageHeading({ detailed }: { detailed?: boolean }) {
  return (
    <View style={styles.headingWrap}>
      <Text style={styles.pageTitle}>AVALIAÇÕES</Text>
      <Text style={styles.mode}>{detailed ? 'Modo detalhado' : 'Modo rápido'}</Text>
    </View>
  );
}

function Steps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <View style={styles.steps}>
      {[1, 2, 3].map((step, index) => (
        <View key={step} style={styles.stepGroup}>
          {index > 0 ? <View style={styles.stepLine} /> : null}
          <View style={[styles.step, current === step && styles.stepActive]}><Text style={[styles.stepText, current === step && styles.stepActiveText]}>{step}</Text></View>
        </View>
      ))}
    </View>
  );
}

export function QuickReviewScreen({ navigation, route }: QuickProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const { work, loadError } = useReviewWork(route.params.id);
  const [rating, setRating] = useState(0);
  const [worthIt, setWorthIt] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { noun, action } = nounAndAction(work.kind);

  async function publish() {
    if (!rating || !worthIt) {
      setStatus('Escolha uma nota e responda se valeu a pena.');
      return;
    }
    if (!work.backendId) {
      setStatus('Essa obra ainda está apenas no catálogo demonstrativo. Cadastre-a no banco primeiro.');
      return;
    }
    try {
      setLoading(true);
      setStatus('');
      await api.saveReview(work.backendId, { mode: 'rapida', rating, worth_it: worthIt, comment });
      navigation.navigate('Details', { id: String(work.backendId) });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Não foi possível publicar a avaliação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <AppHeader navigation={navigation} />
        <PageHeading />

        <View style={[styles.quickHero, wide && styles.quickHeroWide]}>
          {work.image ? <Image source={{ uri: work.image }} style={[styles.cover, wide && styles.coverWide]} resizeMode="cover" /> : <View style={[styles.cover, styles.coverPlaceholder]} />}
          <View style={[styles.questions, wide && styles.questionsWide]}>
            <Text style={[styles.workTitle, wide && styles.workTitleWide]}>{work.title}</Text>
            <Text style={[styles.question, wide && styles.questionWide]}>Quantas estrelas esse {noun} merece?</Text>
            <RatingStars value={rating} onChange={setRating} large={wide} />
            <Text style={[styles.question, wide && styles.questionWide]}>Valeu a pena {action} esse {noun}?</Text>
            <WorthChoices value={worthIt} onChange={setWorthIt} />
          </View>
        </View>

        {loadError ? <Text style={styles.status}>{loadError}</Text> : null}
        <Text style={[styles.commentHeading, wide && styles.commentHeadingWide]}>Escreva um comentário:</Text>
        <TextInput value={comment} onChangeText={setComment} multiline placeholder="Digite aqui..." placeholderTextColor="#596170" style={[styles.commentBox, wide && styles.commentBoxWide]} />
        {status ? <Text style={styles.status}>{status}</Text> : null}
        <Pressable disabled={loading} onPress={publish} style={({ pressed }) => [styles.publishButton, wide && styles.publishButtonWide, (pressed || loading) && styles.pressed]}><Text style={[styles.publishText, wide && styles.publishTextWide]}>{loading ? 'Publicando...' : 'Publicar avaliação'}</Text></Pressable>
        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

export function DetailedReviewScreen({ navigation, route }: DetailedProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const { work, loadError } = useReviewWork(route.params.id);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [rating, setRating] = useState(0);
  const [worthIt, setWorthIt] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [emotion, setEmotion] = useState('');
  const [verdict, setVerdict] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { noun, action } = nounAndAction(work.kind);
  const labels = work.kind === 'livro' ? ['Enredo', 'Personagens', 'Fluidez da leitura', 'Ambientação', 'Originalidade'] : work.kind === 'filme' ? ['Roteiro', 'Atuação', 'Trilha sonora', 'Fotografia', 'Originalidade'] : ['Roteiro', 'Elenco', 'Ritmo', 'Fotografia', 'Originalidade'];

  function nextStep() {
    setStatus('');
    if (step === 1 && (!rating || !worthIt)) {
      setStatus('Escolha a nota e responda se valeu a pena.');
      return;
    }
    if (step === 2 && labels.some((label) => !scores[label])) {
      setStatus('Avalie todos os critérios para continuar.');
      return;
    }
    setStep((old) => (old < 3 ? (old + 1) as 1 | 2 | 3 : old));
  }

  async function publish() {
    if (!work.backendId) {
      setStatus('Essa obra ainda está apenas no catálogo demonstrativo. Cadastre-a no banco primeiro.');
      return;
    }
    try {
      setLoading(true);
      setStatus('');
      await api.saveReview(work.backendId, { mode: 'detalhada', rating, worth_it: worthIt, comment, scores, emotion, verdict });
      navigation.navigate('Details', { id: String(work.backendId) });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Não foi possível publicar a avaliação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <AppHeader navigation={navigation} />
        <PageHeading detailed />
        <Steps current={step} />

        <View style={[styles.detailedCore, wide && styles.detailedCoreWide]}>
          {step === 1 ? <>
            <Text style={[styles.question, wide && styles.questionWide]}>Quantas estrelas esse {noun} merece?</Text>
            <RatingStars value={rating} onChange={setRating} large={wide} />
            <Text style={[styles.question, wide && styles.questionWide]}>Valeu a pena {action} esse {noun}?</Text>
            <WorthChoices value={worthIt} onChange={setWorthIt} />
          </> : null}

          {step === 2 ? <View style={[styles.criteriaPanel, wide && styles.criteriaPanelWide]}>
            <Text style={styles.criteriaTitle}>Critérios</Text>
            {labels.map((label) => (
              <View key={label} style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>{label}</Text>
                <View style={styles.scoreChoices}>{[1, 2, 3, 4, 5].map((score) => (
                  <Pressable key={score} onPress={() => setScores((old) => ({ ...old, [label]: score }))} style={[styles.scoreCircle, scores[label] === score && styles.scoreCircleActive]}><Text style={[styles.scoreText, scores[label] === score && styles.scoreTextActive]}>{score}</Text></Pressable>
                ))}</View>
              </View>
            ))}
          </View> : null}

          {step === 3 ? <View style={styles.finalFields}>
            <Text style={styles.finalLabel}>Qual emoção essa obra te causou?</Text>
            <TextInput value={emotion} onChangeText={setEmotion} placeholder="Ex.: Me adotou emocionalmente" placeholderTextColor="#7D838B" style={styles.singleInput} />
            <Text style={styles.finalLabel}>Seu veredito final</Text>
            <TextInput value={verdict} onChangeText={setVerdict} placeholder="Ex.: Culpada de ser incrível" placeholderTextColor="#7D838B" style={styles.singleInput} />
            <Text style={styles.finalLabel}>Escreva um comentário:</Text>
            <TextInput value={comment} onChangeText={setComment} multiline placeholder="Digite aqui..." placeholderTextColor="#596170" style={[styles.commentBox, styles.finalComment, wide && styles.commentBoxWide]} />
          </View> : null}
        </View>

        {loadError ? <Text style={styles.status}>{loadError}</Text> : null}
        {status ? <Text style={styles.status}>{status}</Text> : null}

        {step < 3 ? <Pressable onPress={nextStep} style={[styles.publishButton, wide && styles.publishButtonWide]}><Text style={[styles.publishText, wide && styles.publishTextWide]}>Próximo  →</Text></Pressable> : <Pressable disabled={loading} onPress={publish} style={({ pressed }) => [styles.publishButton, wide && styles.publishButtonWide, (pressed || loading) && styles.pressed]}><Text style={[styles.publishText, wide && styles.publishTextWide]}>{loading ? 'Publicando...' : 'Publicar avaliação'}</Text></Pressable>}
        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  page: { paddingBottom: 0, backgroundColor: '#FFFFFF' },
  headingWrap: { alignItems: 'center', marginTop: 28 },
  pageTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 31, textAlign: 'center' },
  mode: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 15, textAlign: 'center', marginTop: 2 },
  quickHero: { marginTop: 30, paddingHorizontal: 20, alignItems: 'center' },
  quickHeroWide: { width: '81%', maxWidth: 1200, alignSelf: 'center', flexDirection: 'row', justifyContent: 'center', gap: 70, marginTop: 22 },
  cover: { width: 170, height: 245, borderRadius: 12, backgroundColor: '#EEEEEE' },
  coverWide: { width: 418, height: 571, borderRadius: 25 },
  coverPlaceholder: { backgroundColor: '#ECECEC' },
  questions: { width: '100%', maxWidth: 460, marginTop: 25 },
  questionsWide: { maxWidth: 620, marginTop: 0 },
  workTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 22, marginBottom: 10 },
  workTitleWide: { fontSize: 36, lineHeight: 48 },
  question: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 17, lineHeight: 24, marginTop: 13 },
  questionWide: { fontSize: 25, lineHeight: 36, marginTop: 22 },
  stars: { flexDirection: 'row', gap: 5, marginTop: 9, marginBottom: 10 },
  star: { color: '#DDD5B4', fontSize: 34 },
  starLarge: { fontSize: 47 },
  starActive: { color: '#EECB3F' },
  worthChoices: { marginTop: 10, gap: 5 },
  worthChoice: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 6, borderRadius: 8 },
  worthChoiceSelected: { backgroundColor: 'rgba(0,145,114,.11)' },
  worthIcon: { color: '#001A38', width: 35, fontSize: 19 },
  worthText: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 16 },
  commentHeading: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 21, textAlign: 'center', marginTop: 42, marginBottom: 16 },
  commentHeadingWide: { fontSize: 34, marginTop: 90, marginBottom: 28 },
  commentBox: { marginHorizontal: 20, minHeight: 180, borderWidth: 1, borderColor: '#001A38', borderRadius: 12, padding: 16, textAlignVertical: 'top', color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 13 },
  commentBoxWide: { width: '86%', maxWidth: 1246, minHeight: 396, alignSelf: 'center', borderRadius: 20, padding: 46, fontSize: 18 },
  status: { color: '#B00020', fontFamily: 'Poppins_400Regular', fontSize: 12, textAlign: 'center', marginHorizontal: 20, marginTop: 16 },
  publishButton: { alignSelf: 'center', minWidth: 210, borderWidth: 1.5, borderColor: colors.purple, borderRadius: 999, paddingHorizontal: 24, paddingVertical: 10, marginTop: 28, marginBottom: 48 },
  publishButtonWide: { width: 413, minHeight: 57, justifyContent: 'center', marginTop: 66, marginBottom: 74 },
  publishText: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 13, textAlign: 'center' },
  publishTextWide: { fontSize: 20 },
  steps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 44, paddingHorizontal: 30 },
  stepGroup: { flexDirection: 'row', alignItems: 'center' },
  step: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#001A38', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  stepActive: { backgroundColor: '#001A38' },
  stepText: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 18 },
  stepActiveText: { color: '#FFFFFF' },
  stepLine: { width: 84, height: 1, backgroundColor: '#7D838B' },
  detailedCore: { marginTop: 52, paddingHorizontal: 24, alignSelf: 'center', width: '100%', maxWidth: 470, minHeight: 390 },
  detailedCoreWide: { maxWidth: 640, minHeight: 640, justifyContent: 'center', marginTop: 40 },
  criteriaPanel: { borderWidth: 1, borderColor: '#001A38', borderRadius: 14, padding: 16 },
  criteriaPanelWide: { padding: 30, borderRadius: 20 },
  criteriaTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 22, marginBottom: 18 },
  scoreRow: { marginBottom: 18 },
  scoreLabel: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 13, marginBottom: 8 },
  scoreChoices: { flexDirection: 'row', justifyContent: 'space-between' },
  scoreCircle: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#001A38', alignItems: 'center', justifyContent: 'center' },
  scoreCircleActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  scoreText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
  scoreTextActive: { color: '#FFFFFF' },
  finalFields: { gap: 14 },
  finalLabel: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginTop: 8 },
  singleInput: { minHeight: 54, borderWidth: 1, borderColor: '#001A38', borderRadius: 10, paddingHorizontal: 16, color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 14 },
  finalComment: { marginHorizontal: 0, width: '100%', minHeight: 170 },
  pressed: { opacity: 0.65 },
});
