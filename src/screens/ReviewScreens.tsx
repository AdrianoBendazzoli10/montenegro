import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList, MediaKind } from '../navigation/types';
import { getMediaById } from '../data/media';
import { colors } from '../theme/colors';
import { api, resolveBackendWorkId, type ApiWork } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

type QuickProps = NativeStackScreenProps<
  RootStackParamList,
  'QuickReview'
>;

type DetailedProps = NativeStackScreenProps<
  RootStackParamList,
  'DetailedReview'
>;

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

  const fallback = useMemo<WorkView>(
    () => ({
      id: local.id,
      backendId: Number.isFinite(backendId) ? backendId : null,
      title: local.title,
      kind: local.kind,
      image: local.image,
    }),
    [backendId, local],
  );

  const [work, setWork] = useState<WorkView>(fallback);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;

    if (!Number.isFinite(backendId)) {
      return () => {
        active = false;
      };
    }

    api
      .getWork(backendId)
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

        setLoadError(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar a obra.',
        );
      });

    return () => {
      active = false;
    };
  }, [backendId, fallback]);

  return { work, loadError };
}

function nounAndAction(kind: MediaKind) {
  if (kind === 'livro') {
    return {
      noun: 'livro',
      action: 'ler',
    };
  }

  if (kind === 'filme') {
    return {
      noun: 'filme',
      action: 'assistir',
    };
  }

  return {
    noun: 'série',
    action: 'assistir',
  };
}

/* estrelas */

function RatingStars({
  value,
  onChange,
  large = false,
}: {
  value: number;
  onChange: (value: number) => void;
  large?: boolean;
}) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => onChange(star)}
          hitSlop={6}
        >
          <Text
            style={[
              styles.star,
              large && styles.starLarge,
              star <= value && styles.starActive,
            ]}
          >
            ★
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/* opções de valeu a pena */

function WorthChoices({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string) => void;
}) {
  const choices = [
    ['☝', 'Sim'],
    ['☟', 'Não'],
    ['☝☟', 'Mais ou menos'],
  ];

  return (
    <View style={styles.worthChoices}>
      {choices.map(([icon, label]) => {
        const selected = value === label;

        return (
          <Pressable
            key={label}
            onPress={() => onChange(label)}
            style={[
              styles.worthChoice,
              selected && styles.worthChoiceSelected,
            ]}
          >
            <View
              style={[
                styles.worthIconCircle,
                selected && styles.worthIconCircleSelected,
              ]}
            >
              <Text
                style={[
                  styles.worthIcon,
                  selected && styles.worthIconSelected,
                ]}
              >
                {icon}
              </Text>
            </View>

            <Text
              style={[
                styles.worthText,
                selected && styles.worthTextSelected,
              ]}
            >
              {label}
            </Text>

            {selected && (
              <View style={styles.choiceCheck}>
                <Text style={styles.choiceCheckText}>
                  ✓
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

/* cabeçalho */

function PageHeading({
  detailed,
}: {
  detailed?: boolean;
}) {
  return (
    <View style={styles.headingWrap}>
      <Text style={styles.eyebrow}>
        MONTENEGRO
      </Text>

      <Text style={styles.pageTitle}>
        AVALIAÇÕES
      </Text>

      <View style={styles.headingDecoration}>
        <View style={styles.headingLine} />
        <View style={styles.headingDot} />
        <View style={styles.headingLine} />
      </View>

      <View style={styles.modePill}>
        <View style={styles.modeDot} />

        <Text style={styles.mode}>
          {detailed ? 'MODO DETALHADO' : 'MODO RÁPIDO'}
        </Text>
      </View>
    </View>
  );
}

/* etapas */

function Steps({
  current,
}: {
  current: 1 | 2 | 3;
}) {
  const descriptions = [
    'Impressão geral',
    'Critérios',
    'Finalização',
  ];

  return (
    <View style={styles.stepsContainer}>
      <View style={styles.steps}>
        {[1, 2, 3].map((step, index) => (
          <View
            key={step}
            style={styles.stepGroup}
          >
            {index > 0 && (
              <View
                style={[
                  styles.stepLine,
                  current >= step && styles.stepLineActive,
                ]}
              />
            )}

            <View style={styles.stepItem}>
              <View
                style={[
                  styles.step,
                  current === step && styles.stepActive,
                  current > step && styles.stepCompleted,
                ]}
              >
                {current > step ? (
                  <Text style={styles.stepCheck}>
                    ✓
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.stepText,
                      current === step &&
                        styles.stepActiveText,
                    ]}
                  >
                    {step}
                  </Text>
                )}
              </View>

              <Text
                style={[
                  styles.stepDescription,
                  current === step &&
                    styles.stepDescriptionActive,
                ]}
              >
                {descriptions[index]}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

/* cartão de pergunta */

function QuestionCard({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.questionCard}>
      <View style={styles.questionNumber}>
        <Text style={styles.questionNumberText}>
          {number}
        </Text>
      </View>

      <View style={styles.questionCardContent}>
        {children}
      </View>
    </View>
  );
}

/* quick review */

export function QuickReviewScreen({
  navigation,
  route,
}: QuickProps) {
  const { width } = useWindowDimensions();

  const wide = width >= 760;

  const { work, loadError } = useReviewWork(
    route.params.id,
  );

  const [rating, setRating] = useState(0);
  const [worthIt, setWorthIt] = useState<string | null>(
    null,
  );
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const { noun, action } = nounAndAction(work.kind);

  async function publish() {
    if (!rating || !worthIt) {
      setStatus(
        'Escolha uma nota e responda se valeu a pena.',
      );
      return;
    }

    if (!work.backendId) {
      setStatus(
        'Essa obra ainda está apenas no catálogo demonstrativo. Cadastre-a no banco primeiro.',
      );
      return;
    }

    try {
      setLoading(true);
      setStatus('');

      await api.saveReview(work.backendId, {
        mode: 'rapida',
        rating,
        worth_it: worthIt,
        comment,
      });

      navigation.navigate('Details', {
        id: String(work.backendId),
      });
    } catch (err) {
      setStatus(
        err instanceof Error
          ? err.message
          : 'Não foi possível publicar a avaliação.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={styles.page}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AppHeader navigation={navigation} />

        <PageHeading />

        {/* obra */}

        <View
          style={[
            styles.quickHero,
            wide && styles.quickHeroWide,
          ]}
        >
          <View style={styles.coverColumn}>
            <View style={styles.coverShadow}>
              {work.image ? (
                <Image
                  source={{ uri: work.image }}
                  style={[
                    styles.cover,
                    wide && styles.coverWide,
                  ]}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.cover,
                    styles.coverPlaceholder,
                    wide && styles.coverWide,
                  ]}
                >
                  <Text style={styles.placeholderHeart}>
                    ♡
                  </Text>

                  <Text style={styles.placeholderText}>
                    Sem capa
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.kindBadge}>
              <Text style={styles.kindBadgeText}>
                {work.kind === 'livro'
                  ? 'LIVRO'
                  : work.kind === 'filme'
                    ? 'FILME'
                    : 'SÉRIE'}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.questions,
              wide && styles.questionsWide,
            ]}
          >
            <Text
              style={[
                styles.workTitle,
                wide && styles.workTitleWide,
              ]}
            >
              {work.title}
            </Text>

            <View style={styles.titleSmallLine} />

            <QuestionCard number="01">
              <Text
                style={[
                  styles.question,
                  wide && styles.questionWide,
                ]}
              >
                Quantas estrelas esse {noun} merece?
              </Text>

              <RatingStars
                value={rating}
                onChange={setRating}
                large={wide}
              />

              {rating > 0 && (
                <Text style={styles.ratingFeedback}>
                  {rating === 5
                    ? 'Uma obra inesquecível ✦'
                    : rating === 4
                      ? 'Você gostou bastante!'
                      : rating === 3
                        ? 'Uma experiência mediana.'
                        : rating === 2
                          ? 'Não foi exatamente o que esperava.'
                          : 'Não funcionou para você.'}
                </Text>
              )}
            </QuestionCard>

            <QuestionCard number="02">
              <Text
                style={[
                  styles.question,
                  wide && styles.questionWide,
                ]}
              >
                Valeu a pena {action} esse {noun}?
              </Text>

              <WorthChoices
                value={worthIt}
                onChange={setWorthIt}
              />
            </QuestionCard>
          </View>
        </View>

        {loadError ? (
          <Text style={styles.status}>
            {loadError}
          </Text>
        ) : null}

        {/* comentário */}

        <View style={styles.commentSection}>
          <View style={styles.commentHeadingRow}>
            <View>
              <Text style={styles.sectionEyebrow}>
                SUA EXPERIÊNCIA
              </Text>

              <Text
                style={[
                  styles.commentHeading,
                  wide && styles.commentHeadingWide,
                ]}
              >
                Conte o que achou
              </Text>
            </View>

            <Text style={styles.commentIcon}>
              “
            </Text>
          </View>

          <TextInput
            value={comment}
            onChangeText={setComment}
            multiline
            placeholder="Escreva algumas palavras sobre essa obra..."
            placeholderTextColor="#9993A0"
            style={[
              styles.commentBox,
              wide && styles.commentBoxWide,
            ]}
          />
        </View>

        {status ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorIcon}>
              !
            </Text>

            <Text style={styles.errorText}>
              {status}
            </Text>
          </View>
        ) : null}

        <Pressable
          disabled={loading}
          onPress={publish}
          style={({ pressed }) => [
            styles.publishButton,
            wide && styles.publishButtonWide,
            (pressed || loading) && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.publishText,
              wide && styles.publishTextWide,
            ]}
          >
            {loading
              ? 'Publicando...'
              : 'Publicar avaliação'}
          </Text>

          {!loading && (
            <Text style={styles.publishArrow}>
              →
            </Text>
          )}
        </Pressable>

        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

/* avaliação detalhada */

export function DetailedReviewScreen({
  navigation,
  route,
}: DetailedProps) {
  const { width } = useWindowDimensions();

  const wide = width >= 760;

  const { work, loadError } = useReviewWork(
    route.params.id,
  );

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [rating, setRating] = useState(0);
  const [worthIt, setWorthIt] = useState<string | null>(
    null,
  );
  const [scores, setScores] = useState<
    Record<string, number>
  >({});
  const [emotion, setEmotion] = useState('');
  const [verdict, setVerdict] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const { noun, action } = nounAndAction(work.kind);

  const labels =
    work.kind === 'livro'
      ? [
          'Enredo',
          'Personagens',
          'Fluidez da leitura',
          'Ambientação',
          'Originalidade',
        ]
      : work.kind === 'filme'
        ? [
            'Roteiro',
            'Atuação',
            'Trilha sonora',
            'Fotografia',
            'Originalidade',
          ]
        : [
            'Roteiro',
            'Elenco',
            'Ritmo',
            'Fotografia',
            'Originalidade',
          ];

  function nextStep() {
    setStatus('');

    if (step === 1 && (!rating || !worthIt)) {
      setStatus(
        'Escolha a nota e responda se valeu a pena.',
      );
      return;
    }

    if (
      step === 2 &&
      labels.some((label) => !scores[label])
    ) {
      setStatus(
        'Avalie todos os critérios para continuar.',
      );
      return;
    }

    setStep((old) =>
      old < 3
        ? ((old + 1) as 1 | 2 | 3)
        : old,
    );
  }

  async function publish() {
    if (!work.backendId) {
      setStatus(
        'Essa obra ainda está apenas no catálogo demonstrativo. Cadastre-a no banco primeiro.',
      );
      return;
    }

    try {
      setLoading(true);
      setStatus('');

      await api.saveReview(work.backendId, {
        mode: 'detalhada',
        rating,
        worth_it: worthIt,
        comment,
        scores,
        emotion,
        verdict,
      });

      navigation.navigate('Details', {
        id: String(work.backendId),
      });
    } catch (err) {
      setStatus(
        err instanceof Error
          ? err.message
          : 'Não foi possível publicar a avaliação.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={styles.page}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AppHeader navigation={navigation} />

        <PageHeading detailed />

        <Steps current={step} />

        <View
          style={[
            styles.detailedCore,
            wide && styles.detailedCoreWide,
          ]}
        >
          {/* etapa 1 */}

          {step === 1 ? (
            <View style={styles.detailedStep}>
              <View style={styles.stepIntro}>
                <Text style={styles.stepIntroNumber}>
                  01
                </Text>

                <View>
                  <Text style={styles.sectionEyebrow}>
                    PRIMEIRA IMPRESSÃO
                  </Text>

                  <Text style={styles.stepIntroTitle}>
                    O que você achou da obra?
                  </Text>
                </View>
              </View>

              <QuestionCard number="01">
                <Text
                  style={[
                    styles.question,
                    wide && styles.questionWide,
                  ]}
                >
                  Quantas estrelas esse {noun} merece?
                </Text>

                <RatingStars
                  value={rating}
                  onChange={setRating}
                  large={wide}
                />
              </QuestionCard>

              <QuestionCard number="02">
                <Text
                  style={[
                    styles.question,
                    wide && styles.questionWide,
                  ]}
                >
                  Valeu a pena {action} esse {noun}?
                </Text>

                <WorthChoices
                  value={worthIt}
                  onChange={setWorthIt}
                />
              </QuestionCard>
            </View>
          ) : null}

          {/* etapa 2 */}

          {step === 2 ? (
            <View
              style={[
                styles.criteriaPanel,
                wide && styles.criteriaPanelWide,
              ]}
            >
              <View style={styles.criteriaHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>
                    ETAPA 02
                  </Text>

                  <Text style={styles.criteriaTitle}>
                    Avalie cada detalhe
                  </Text>

                  <Text style={styles.criteriaSubtitle}>
                    Dê uma nota de 1 a 5 para cada critério.
                  </Text>
                </View>

                <View style={styles.criteriaIcon}>
                  <Text>✦</Text>
                </View>
              </View>

              <View style={styles.criteriaDivider} />

              {labels.map((label, index) => (
                <View
                  key={label}
                  style={styles.scoreRow}
                >
                  <View style={styles.scoreLabelWrap}>
                    <View style={styles.scoreNumber}>
                      <Text style={styles.scoreNumberText}>
                        {String(index + 1).padStart(2, '0')}
                      </Text>
                    </View>

                    <Text style={styles.scoreLabel}>
                      {label}
                    </Text>
                  </View>

                  <View style={styles.scoreChoices}>
                    {[1, 2, 3, 4, 5].map((score) => {
                      const selected =
                        scores[label] === score;

                      return (
                        <Pressable
                          key={score}
                          onPress={() =>
                            setScores((old) => ({
                              ...old,
                              [label]: score,
                            }))
                          }
                          style={[
                            styles.scoreCircle,
                            selected &&
                              styles.scoreCircleActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.scoreText,
                              selected &&
                                styles.scoreTextActive,
                            ]}
                          >
                            {score}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {/* etapa 3 */}

          {step === 3 ? (
            <View style={styles.finalFields}>
              <View style={styles.stepIntro}>
                <Text style={styles.stepIntroNumber}>
                  03
                </Text>

                <View>
                  <Text style={styles.sectionEyebrow}>
                    ÚLTIMA ETAPA
                  </Text>

                  <Text style={styles.stepIntroTitle}>
                    Coloque sua personalidade na avaliação
                  </Text>
                </View>
              </View>

              <View style={styles.finalFieldCard}>
                <Text style={styles.finalLabel}>
                  Qual emoção essa obra te causou?
                </Text>

                <TextInput
                  value={emotion}
                  onChangeText={setEmotion}
                  placeholder="Ex.: Me adotou emocionalmente"
                  placeholderTextColor="#9993A0"
                  style={styles.singleInput}
                />
              </View>

              <View style={styles.finalFieldCard}>
                <Text style={styles.finalLabel}>
                  Seu veredito final
                </Text>

                <TextInput
                  value={verdict}
                  onChangeText={setVerdict}
                  placeholder="Ex.: Culpada de ser incrível"
                  placeholderTextColor="#9993A0"
                  style={styles.singleInput}
                />
              </View>

              <View style={styles.finalFieldCard}>
                <Text style={styles.finalLabel}>
                  Escreva um comentário
                </Text>

                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  placeholder="Conte mais sobre sua experiência..."
                  placeholderTextColor="#9993A0"
                  style={[
                    styles.commentBox,
                    styles.finalComment,
                    wide && styles.commentBoxWide,
                  ]}
                />
              </View>
            </View>
          ) : null}
        </View>

        {loadError ? (
          <Text style={styles.status}>
            {loadError}
          </Text>
        ) : null}

        {status ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorIcon}>
              !
            </Text>

            <Text style={styles.errorText}>
              {status}
            </Text>
          </View>
        ) : null}

        {step < 3 ? (
          <Pressable
            onPress={nextStep}
            style={({ pressed }) => [
              styles.publishButton,
              wide && styles.publishButtonWide,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.publishText,
                wide && styles.publishTextWide,
              ]}
            >
              Próximo
            </Text>

            <Text style={styles.publishArrow}>
              →
            </Text>
          </Pressable>
        ) : (
          <Pressable
            disabled={loading}
            onPress={publish}
            style={({ pressed }) => [
              styles.publishButton,
              wide && styles.publishButtonWide,
              (pressed || loading) &&
                styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.publishText,
                wide && styles.publishTextWide,
              ]}
            >
              {loading
                ? 'Publicando...'
                : 'Publicar avaliação'}
            </Text>

            {!loading && (
              <Text style={styles.publishArrow}>
                →
              </Text>
            )}
          </Pressable>
        )}

        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  page: {
    paddingBottom: 0,
    backgroundColor: '#FFFFFF',
  },

  /* cabeçalho */

  headingWrap: {
    alignItems: 'center',
    marginTop: 34,
    paddingHorizontal: 20,
  },

  eyebrow: {
    color: colors.green,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    letterSpacing: 2.5,
    marginBottom: 5,
  },

  pageTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 34,
    letterSpacing: 1,
    textAlign: 'center',
  },

  headingDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },

  headingLine: {
    width: 34,
    height: 2,
    backgroundColor: colors.green,
  },

  headingDot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: colors.yellow,
    marginHorizontal: 7,
  },

  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEF8',
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 6,
  },

  modeDot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: colors.green,
    marginRight: 7,
  },

  mode: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.8,
  },

  /* quick */

  quickHero: {
    marginTop: 34,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  quickHeroWide: {
    width: '88%',
    maxWidth: 1250,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 65,
    marginTop: 45,
  },

  coverColumn: {
    alignItems: 'center',
  },

  coverShadow: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 6,
    elevation: 8,
    shadowColor: '#35203F',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 9,
    },
  },

  cover: {
    width: 220,
    height: 310,
    borderRadius: 13,
    backgroundColor: '#EEEAF1',
  },

  coverWide: {
    width: 350,
    height: 500,
    borderRadius: 17,
  },

  coverPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderHeart: {
    color: colors.purple,
    fontSize: 55,
    marginBottom: 8,
  },

  placeholderText: {
    color: '#8D8792',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },

  kindBadge: {
    backgroundColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 15,
  },

  kindBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
    letterSpacing: 1,
  },

  questions: {
    width: '100%',
    maxWidth: 520,
    marginTop: 28,
  },

  questionsWide: {
    maxWidth: 620,
    marginTop: 15,
  },

  workTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 25,
    lineHeight: 34,
    marginBottom: 7,
  },

  workTitleWide: {
    fontSize: 37,
    lineHeight: 49,
  },

  titleSmallLine: {
    width: 45,
    height: 3,
    borderRadius: 5,
    backgroundColor: colors.yellow,
    marginBottom: 20,
  },

  /* cartões de pergunta */

  questionCard: {
    backgroundColor: '#FAF8FC',
    borderWidth: 1,
    borderColor: '#E9E2EF',
    borderRadius: 20,
    padding: 17,
    marginBottom: 15,
    flexDirection: 'row',
  },

  questionNumber: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#EEE6F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  questionNumberText: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
  },

  questionCardContent: {
    flex: 1,
  },

  question: {
    color: '#172438',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    lineHeight: 23,
  },

  questionWide: {
    fontSize: 21,
    lineHeight: 31,
  },

  /* estrelas */

  stars: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 10,
    marginBottom: 3,
  },

  star: {
    color: '#DCD6E1',
    fontSize: 31,
  },

  starLarge: {
    fontSize: 44,
  },

  starActive: {
    color: '#EECB3F',
  },

  ratingFeedback: {
    color: '#81788A',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    marginTop: 3,
  },

  /* vale a pena */

  worthChoices: {
    marginTop: 12,
    gap: 7,
  },

  worthChoice: {
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  worthChoiceSelected: {
    backgroundColor: '#EAF7F3',
    borderColor: '#CBE9DF',
  },

  worthIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#EFEAF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  worthIconCircleSelected: {
    backgroundColor: colors.green,
  },

  worthIcon: {
    color: '#283244',
    fontSize: 17,
  },

  worthIconSelected: {
    color: '#FFFFFF',
  },

  worthText: {
    color: '#283244',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },

  worthTextSelected: {
    color: '#007A62',
    fontFamily: 'Poppins_600SemiBold',
  },

  choiceCheck: {
    marginLeft: 'auto',
    width: 21,
    height: 21,
    borderRadius: 20,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },

  choiceCheckText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  /* comentário */

  commentSection: {
    width: '100%',
    marginTop: 42,
    paddingHorizontal: 20,
  },

  commentHeadingRow: {
    width: '100%',
    maxWidth: 1246,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  sectionEyebrow: {
    color: colors.green,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
    letterSpacing: 1.7,
    marginBottom: 3,
  },

  commentHeading: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 23,
  },

  commentHeadingWide: {
    fontSize: 31,
  },

  commentIcon: {
    color: '#E5DDF0',
    fontFamily: 'Georgia',
    fontSize: 62,
    lineHeight: 45,
  },

  commentBox: {
    minHeight: 175,
    borderWidth: 1.5,
    borderColor: '#DCD4E5',
    backgroundColor: '#FCFBFD',
    borderRadius: 18,
    padding: 17,
    textAlignVertical: 'top',
    color: '#172438',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },

  commentBoxWide: {
    width: '100%',
    maxWidth: 1246,
    minHeight: 270,
    alignSelf: 'center',
    borderRadius: 20,
    padding: 28,
    fontSize: 16,
  },

  /* mensagens */

  status: {
    color: '#B00020',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 16,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: 650,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFF0F2',
    borderWidth: 1,
    borderColor: '#FFD4DA',
  },

  errorIcon: {
    width: 25,
    height: 25,
    borderRadius: 9,
    backgroundColor: '#E64C61',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 25,
    fontWeight: '900',
    marginRight: 10,
  },

  errorText: {
    flex: 1,
    color: '#9A2638',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    lineHeight: 17,
  },

  /* botão */

  publishButton: {
    alignSelf: 'center',
    minWidth: 220,
    borderRadius: 999,
    paddingHorizontal: 25,
    paddingVertical: 13,
    marginTop: 27,
    marginBottom: 55,
    backgroundColor: colors.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 4,
    shadowColor: '#382049',
    shadowOpacity: 0.14,
    shadowRadius: 9,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  publishButtonWide: {
    width: 330,
    minHeight: 58,
    marginTop: 50,
    marginBottom: 74,
  },

  publishText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    textAlign: 'center',
  },

  publishTextWide: {
    fontSize: 17,
  },

  publishArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.65,
    transform: [{ scale: 0.98 }],
  },

  /* etapas */

  stepsContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },

  steps: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  stepGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  stepItem: {
    alignItems: 'center',
  },

  step: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: '#C8C1CE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  stepActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },

  stepCompleted: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },

  stepText: {
    color: '#706978',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },

  stepActiveText: {
    color: '#FFFFFF',
  },

  stepCheck: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  stepLine: {
    width: 65,
    height: 2,
    backgroundColor: '#D9D3DC',
    marginTop: 20,
  },

  stepLineActive: {
    backgroundColor: colors.green,
  },

  stepDescription: {
    color: '#918A96',
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 70,
  },

  stepDescriptionActive: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
  },

  /* conteúdo detalhado */

  detailedCore: {
    marginTop: 42,
    paddingHorizontal: 20,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 650,
  },

  detailedCoreWide: {
    maxWidth: 760,
    marginTop: 55,
  },

  detailedStep: {
    width: '100%',
  },

  stepIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  stepIntroNumber: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    marginRight: 13,
  },

  stepIntroTitle: {
    color: '#252031',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 19,
    lineHeight: 26,
    maxWidth: 450,
  },

  /* critérios */

  criteriaPanel: {
    backgroundColor: '#FAF8FC',
    borderWidth: 1,
    borderColor: '#E5DEE9',
    borderRadius: 24,
    padding: 20,
  },

  criteriaPanelWide: {
    padding: 32,
    borderRadius: 26,
  },

  criteriaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  criteriaTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
  },

  criteriaSubtitle: {
    color: '#837C89',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    marginTop: 3,
  },

  criteriaIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EEE6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  criteriaIconText: {
    color: colors.purple,
    fontSize: 20,
  },

  criteriaDivider: {
    height: 1,
    backgroundColor: '#E6DFEA',
    marginVertical: 22,
  },

  scoreRow: {
    marginBottom: 22,
  },

  scoreLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  scoreNumber: {
    width: 29,
    height: 29,
    borderRadius: 10,
    backgroundColor: '#EEE7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  scoreNumberText: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8,
  },

  scoreLabel: {
    flex: 1,
    color: '#172438',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },

  scoreChoices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 39,
  },

  scoreCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#CFC7D5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  scoreCircleActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },

  scoreText: {
    color: '#5E5667',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
  },

  scoreTextActive: {
    color: '#FFFFFF',
  },

  /* etapa final */

  finalFields: {
    gap: 15,
  },

  finalFieldCard: {
    backgroundColor: '#FAF8FC',
    borderWidth: 1,
    borderColor: '#E7E0EB',
    borderRadius: 18,
    padding: 17,
  },

  finalLabel: {
    color: '#252031',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginBottom: 10,
  },

  singleInput: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#D9D2DF',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#172438',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },

  finalComment: {
    marginHorizontal: 0,
    width: '100%',
    minHeight: 160,
  },
});