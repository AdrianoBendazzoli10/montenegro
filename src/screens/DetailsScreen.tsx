import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList, MediaKind } from '../navigation/types';
import { getMediaById } from '../data/media';
import { colors } from '../theme/colors';
import { api, resolveBackendWorkId, type ApiReview, type ApiWork } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

type DisplayWork = {
  id: string;
  title: string;
  kind: MediaKind;
  year: string;
  creator: string;
  description: string;
  image: string;
  rating: number;
  genre?: string | null;
  publisher?: string | null;
};

const demoQuick: ApiReview[] = [
  { id: -1, user_id: -1, work_id: -1, mode: 'rapida', rating: 5, worth_it: 'sim', comment: 'É uma obra simples e encantadora, mas cheia de significados profundos.', user_name: 'Byanca Lourenço' },
  { id: -2, user_id: -2, work_id: -1, mode: 'rapida', rating: 4, worth_it: 'mais_ou_menos', comment: 'A narrativa é leve, porém convida o leitor a refletir.', user_name: 'Ana Clara Rivas' },
];

const demoDetailed: ApiReview[] = [
  { id: -3, user_id: -3, work_id: -1, mode: 'detalhada', rating: 5, worth_it: 'sim', comment: 'Uma leitura que prende e surpreende.', emotion: 'Me adotou emocionalmente', verdict: 'Culpada de ser incrível', scores: { Enredo: 9, Personagens: 8, 'Fluidez da leitura': 10, Ambientação: 9, Originalidade: 7 }, user_name: 'Gabriely Santos' },
  { id: -4, user_id: -4, work_id: -1, mode: 'detalhada', rating: 3, worth_it: 'nao', comment: 'A proposta é boa, mas não funcionou tanto para mim.', emotion: 'Tentei, mas dormi', verdict: 'Condenada por perda de tempo', scores: { Enredo: 4, Personagens: 6, 'Fluidez da leitura': 2, Ambientação: 8, Originalidade: 5 }, user_name: 'Beatriz Krisan' },
];

function starText(value: number) {
  const rounded = Math.max(0, Math.min(5, Math.round(value)));
  return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)}`;
}

function worthLabel(value: ApiReview['worth_it']) {
  if (value === 'sim') return 'Sim';
  if (value === 'nao') return 'Não';
  return 'Mais ou menos';
}

function fromApi(work: ApiWork, fallback: DisplayWork): DisplayWork {
  return {
    id: String(work.id),
    title: work.title,
    kind: work.kind,
    year: work.year ? String(work.year) : fallback.year,
    creator: work.creator,
    description: work.synopsis || fallback.description,
    image: work.image_url || fallback.image,
    rating: Number(work.rating || fallback.rating || 0),
    genre: work.genre,
    publisher: work.publisher,
  };
}

export function DetailsScreen({ navigation, route }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const local = getMediaById(route.params.id);
  const fallback = useMemo<DisplayWork>(() => ({
    id: local.id,
    title: local.title,
    kind: local.kind,
    year: local.year,
    creator: local.creator,
    description: local.description,
    image: local.image,
    rating: local.rating,
  }), [local]);

  const [item, setItem] = useState<DisplayWork>(fallback);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [apiNote, setApiNote] = useState('');

  useEffect(() => {
    let active = true;
    const backendId = resolveBackendWorkId(route.params.id);
    if (!Number.isFinite(backendId)) return () => { active = false; };

    api.getWork(backendId)
      .then((response) => {
        if (!active) return;
        setItem(fromApi(response.work, fallback));
        setReviews(response.reviews);
        setApiNote('');
      })
      .catch((error) => {
        if (!active) return;
        setItem(fallback);
        setReviews([]);
        setApiNote(error instanceof Error ? error.message : 'Não foi possível carregar os dados da API.');
      });

    return () => { active = false; };
  }, [route.params.id, fallback]);

  const quickReviews = reviews.filter((review) => review.mode === 'rapida');
  const detailedReviews = reviews.filter((review) => review.mode === 'detalhada');
  const visibleQuick = quickReviews.length ? quickReviews : demoQuick;
  const visibleDetailed = detailedReviews.length ? detailedReviews : demoDetailed;
  const noun = item.kind === 'livro' ? 'livro' : item.kind === 'filme' ? 'filme' : 'série';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <AppHeader navigation={navigation} />

        <View style={[styles.heroCard, wide && styles.heroCardWide]}>
          {item.image ? <Image source={{ uri: item.image }} style={[styles.cover, wide && styles.coverWide]} resizeMode="cover" /> : <View style={[styles.cover, styles.imagePlaceholder]} />}
          <View style={[styles.heroInfo, wide && styles.heroInfoWide]}>
            <Text style={[styles.title, wide && styles.titleWide]}>{item.title}</Text>
            <Text style={[styles.stars, wide && styles.starsWide]}>{starText(item.rating)}  <Text style={styles.score}>{item.rating.toFixed(1)}</Text></Text>
            <Text style={[styles.meta, wide && styles.metaWide]}>{item.kind === 'livro' ? 'Autor' : 'Criador'}: {item.creator}</Text>
            {item.genre ? <Text style={[styles.meta, wide && styles.metaWide]}>Gênero: {item.genre}</Text> : null}
            {item.publisher ? <Text style={[styles.meta, wide && styles.metaWide]}>Editora: {item.publisher}</Text> : null}
            <Text style={[styles.meta, wide && styles.metaWide]}>Ano: {item.year}</Text>
            <Pressable onPress={() => navigation.navigate('QuickReview', { id: item.id })} style={[styles.heroButton, wide && styles.heroButtonWide]}>
              <Text style={[styles.heroButtonText, wide && styles.heroButtonTextWide]}>Quero avaliar esse {noun}!  ◉</Text>
            </Pressable>
          </View>
        </View>

        {apiNote ? <Text style={styles.apiNote}>{apiNote}</Text> : null}

        <Text style={[styles.sectionTitle, wide && styles.sectionTitleWide]}>Sinopse</Text>
        <View style={[styles.synopsisBox, wide && styles.synopsisBoxWide]}><Text style={[styles.synopsis, wide && styles.synopsisWide]}>{item.description}</Text></View>

        <Text style={[styles.sectionTitle, wide && styles.sectionTitleWide]}>Avaliações rápidas</Text>
        <View style={[styles.quickGrid, wide && styles.quickGridWide]}>
          {visibleQuick.slice(0, 2).map((review) => (
            <View key={review.id} style={[styles.quickCard, wide && styles.quickCardWide]}>
              <View style={styles.userRow}><View style={styles.avatar} /><View><Text style={styles.userName}>{review.user_name || 'Usuário Montenegro'}</Text><Text style={styles.date}>Avaliação rápida</Text></View></View>
              <Text style={styles.smallStars}>{starText(review.rating)}</Text>
              <Text style={[styles.reviewText, wide && styles.reviewTextWide]}>“{review.comment || 'Sem comentário.'}”</Text>
              <Text style={styles.worth}>Valeu a pena?   {worthLabel(review.worth_it)}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, wide && styles.sectionTitleWide]}>Avaliações detalhadas</Text>
        <View style={[styles.detailedList, wide && styles.detailedListWide]}>
          {visibleDetailed.slice(0, 2).map((review) => (
            <View key={review.id} style={[styles.detailedCard, wide && styles.detailedCardWide]}>
              <View style={[styles.detailedLeft, wide && styles.detailedLeftWide]}>
                <View style={styles.userRow}><View style={styles.avatar} /><View><Text style={styles.userName}>{review.user_name || 'Usuário Montenegro'}</Text><Text style={styles.date}>Avaliação detalhada</Text></View></View>
                <Text style={styles.smallStars}>{starText(review.rating)}</Text>
                <Text style={[styles.reviewText, wide && styles.reviewTextWide]}>“{review.comment || 'Sem comentário.'}”</Text>
                <Text style={styles.worth}>Valeu a pena?   {worthLabel(review.worth_it)}</Text>
              </View>

              <View style={[styles.criteriaBlock, wide && styles.criteriaBlockWide]}>
                {review.emotion ? <Text style={styles.detailLabel}>Emoção: <Text style={styles.detailValue}>“{review.emotion}”</Text></Text> : null}
                <Text style={styles.detailLabel}>Critérios:</Text>
                {review.scores && Object.keys(review.scores).length ? Object.entries(review.scores).map(([label, score]) => (
                  <View key={label} style={styles.criteriaRow}><Text style={styles.criteriaLabel}>{label}</Text><Text style={styles.criteriaScore}>{String(score)}</Text></View>
                )) : <Text style={styles.criteriaEmpty}>Sem critérios preenchidos.</Text>}
              </View>

              <View style={[styles.verdictBox, wide && styles.verdictBoxWide]}>
                <Text style={styles.verdictTitle}>Veredito final</Text>
                <Text style={styles.gavel}>⚒</Text>
                <Text style={styles.verdictText}>{review.verdict || 'Avaliação publicada'}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable onPress={() => navigation.navigate('DetailedReview', { id: item.id })}><Text style={styles.more}>Mostrar mais</Text></Pressable>
        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  page: { paddingBottom: 0, backgroundColor: '#FFFFFF' },
  heroCard: { marginHorizontal: 18, marginTop: 30, backgroundColor: '#1B836D', borderRadius: 18, padding: 18, gap: 18 },
  heroCardWide: { width: '86%', maxWidth: 1243, alignSelf: 'center', minHeight: 611, marginTop: 104, borderRadius: 20, paddingHorizontal: 70, paddingVertical: 46, flexDirection: 'row', alignItems: 'center', gap: 84 },
  cover: { width: 170, height: 245, borderRadius: 12, backgroundColor: '#EEEEEE', alignSelf: 'center' },
  coverWide: { width: 418, height: 571, borderRadius: 25 },
  imagePlaceholder: { backgroundColor: '#ECECEC' },
  heroInfo: { flex: 1, justifyContent: 'center' },
  heroInfoWide: { paddingRight: 36 },
  title: { color: '#FFFFFF', fontFamily: 'Poppins_600SemiBold', fontSize: 23, lineHeight: 29, marginTop: 4 },
  titleWide: { fontSize: 35, lineHeight: 48 },
  stars: { color: '#FFD326', fontSize: 18, marginTop: 10 },
  starsWide: { fontSize: 25, marginTop: 15 },
  score: { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontSize: 12 },
  meta: { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 19, marginTop: 3 },
  metaWide: { fontSize: 18, lineHeight: 28, marginTop: 6 },
  heroButton: { borderWidth: 1.2, borderColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, marginTop: 18, alignSelf: 'flex-start' },
  heroButtonWide: { paddingHorizontal: 28, paddingVertical: 12, marginTop: 44 },
  heroButtonText: { color: '#FFFFFF', fontFamily: 'Poppins_600SemiBold', fontSize: 10 },
  heroButtonTextWide: { fontSize: 16 },
  apiNote: { color: '#7A5C00', fontFamily: 'Poppins_400Regular', fontSize: 11, textAlign: 'center', marginHorizontal: 24, marginTop: 16 },
  sectionTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 23, textAlign: 'center', marginTop: 36, marginBottom: 22 },
  sectionTitleWide: { fontSize: 35, marginTop: 75, marginBottom: 36 },
  synopsisBox: { marginHorizontal: 28, borderLeftWidth: 1, borderLeftColor: '#001A38', paddingLeft: 16, minHeight: 120, justifyContent: 'center' },
  synopsisBoxWide: { width: '82%', maxWidth: 1170, alignSelf: 'center', minHeight: 240, paddingLeft: 42 },
  synopsis: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 13, lineHeight: 21 },
  synopsisWide: { fontSize: 17, lineHeight: 27, maxWidth: 920 },
  quickGrid: { gap: 14, paddingHorizontal: 18 },
  quickGridWide: { width: '81%', maxWidth: 1167, alignSelf: 'center', flexDirection: 'row', gap: 40 },
  quickCard: { flex: 1, backgroundColor: 'rgba(238,203,63,.83)', borderRadius: 14, padding: 16, minHeight: 220 },
  quickCardWide: { minHeight: 398, borderRadius: 20, padding: 46 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#001A38' },
  userName: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
  date: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 8 },
  smallStars: { color: colors.green, fontSize: 14, letterSpacing: 1, marginTop: 10 },
  reviewText: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 10, lineHeight: 15, marginTop: 12 },
  reviewTextWide: { fontSize: 13, lineHeight: 21 },
  worth: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 10, marginTop: 18 },
  detailedList: { gap: 16, paddingHorizontal: 18 },
  detailedListWide: { width: '81%', maxWidth: 1167, alignSelf: 'center', gap: 38 },
  detailedCard: { backgroundColor: 'rgba(238,203,63,.83)', borderRadius: 14, padding: 16, gap: 15 },
  detailedCardWide: { minHeight: 398, borderRadius: 20, padding: 40, flexDirection: 'row', alignItems: 'stretch', gap: 34 },
  detailedLeft: { flex: 1 },
  detailedLeftWide: { flex: 1.25 },
  criteriaBlock: { flex: 1 },
  criteriaBlockWide: { justifyContent: 'center' },
  detailLabel: { color: '#26364E', fontFamily: 'Poppins_600SemiBold', fontSize: 11, marginTop: 8, marginBottom: 7 },
  detailValue: { fontFamily: 'Poppins_400Regular' },
  criteriaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 15, marginTop: 3 },
  criteriaLabel: { flex: 1, color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 10 },
  criteriaScore: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 10 },
  criteriaEmpty: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 10 },
  verdictBox: { backgroundColor: colors.purple, borderRadius: 12, padding: 14, alignItems: 'center', justifyContent: 'center' },
  verdictBoxWide: { width: 185, borderRadius: 20, padding: 18 },
  verdictTitle: { color: '#ECE7DB', fontFamily: 'Poppins_600SemiBold', fontSize: 11, textAlign: 'center' },
  gavel: { color: '#FFFFFF', fontSize: 25, marginVertical: 10 },
  verdictText: { color: '#ECE7DB', fontFamily: 'Poppins_600SemiBold', fontSize: 10, textAlign: 'center' },
  more: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 11, textAlign: 'center', textDecorationLine: 'underline', marginVertical: 34 },
});
