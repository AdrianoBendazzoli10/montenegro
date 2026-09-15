import { useEffect, useState } from 'react';
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

import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import {
  api,
  setAuthToken,
  type ApiReview,
  type ApiUser,
} from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

const fallbackAvatar =
  'https://www.figma.com/api/mcp/asset/a8da2ab3-025d-4721-91cd-627875402a46.png';

type ProfileProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>;

type EditProps = NativeStackScreenProps<
  RootStackParamList,
  'EditProfile'
>;

function formatJoined(value?: string) {
  if (!value) {
    return '20/10/2025';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '20/10/2025';
  }

  return date.toLocaleDateString('pt-BR');
}

function getKindLabel(
  kind?: 'livro' | 'filme' | 'serie',
) {
  if (kind === 'filme') {
    return 'Filme';
  }

  if (kind === 'serie') {
    return 'Série';
  }

  return 'Livro';
}

function getWorthItLabel(
  worthIt: ApiReview['worth_it'],
) {
  if (worthIt === 'sim') {
    return 'Vale a pena';
  }

  if (worthIt === 'mais_ou_menos') {
    return 'Mais ou menos';
  }

  return 'Não vale a pena';
}

export function ProfileScreen({
  navigation,
}: ProfileProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;

  const [user, setUser] =
    useState<ApiUser | null>(null);

  const [reviews, setReviews] =
    useState<ApiReview[]>([]);

  const [status, setStatus] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([
      api.me(),
      api.listMyReviews(),
    ])
      .then(([meResponse, reviewsResponse]) => {
        if (!active) {
          return;
        }

        setUser(meResponse.user);
        setReviews(reviewsResponse.reviews);
        setStatus('');
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setStatus(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o perfil.',
        );
      });

    return () => {
      active = false;
    };
  }, []);

  const avatar =
    user?.avatar_url || fallbackAvatar;

  const displayName =
    user?.name || 'Seu nome';

  const reviewCount = reviews.length;

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
      >
        <AppHeader navigation={navigation} />

        {/* cabeçalho */}
        <View
          style={[
            styles.titleArea,
            wide && styles.titleAreaWide,
          ]}
        >
          <Text style={styles.eyebrow}>
            MINHA CONTA
          </Text>

          <Text
            style={[
              styles.pageTitle,
              wide && styles.pageTitleWide,
            ]}
          >
            Meu perfil
          </Text>

          <Text
            style={[
              styles.pageSubtitle,
              wide && styles.pageSubtitleWide,
            ]}
          >
            Um espaço para guardar suas opiniões,
            descobertas e histórias favoritas.
          </Text>
        </View>

        {/* cartão principal */}
        <View
          style={[
            styles.profileCard,
            wide && styles.profileCardWide,
          ]}
        >
          <View style={styles.profileTop} />

          <View
            style={[
              styles.profileContent,
              wide && styles.profileContentWide,
            ]}
          >
            <View style={styles.identity}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: avatar }}
                  style={[
                    styles.avatar,
                    wide && styles.avatarWide,
                  ]}
                  resizeMode="cover"
                />

                <View style={styles.onlineDot} />
              </View>

              <View style={styles.identityText}>
                <Text
                  style={[
                    styles.name,
                    wide && styles.nameWide,
                  ]}
                >
                  {displayName}
                </Text>

                <Text
                  style={[
                    styles.email,
                    wide && styles.emailWide,
                  ]}
                >
                  {user?.email || 'Seu perfil Montenegro'}
                </Text>

                <Text
                  style={[
                    styles.joined,
                    wide && styles.joinedWide,
                  ]}
                >
                  No Montenegro desde{' '}
                  {formatJoined(user?.created_at)}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.profileActions,
                wide && styles.profileActionsWide,
              ]}
            >
              <View style={styles.stats}>
                <Text style={styles.statsNumber}>
                  {reviewCount}
                </Text>

                <Text style={styles.statsLabel}>
                  avaliações
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  navigation.navigate('EditProfile')
                }
                style={({ pressed }) => [
                  styles.editButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.editButtonText}>
                  Editar perfil
                </Text>

                <Text style={styles.editArrow}>
                  →
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {status ? (
          <Text style={styles.status}>
            {status}
          </Text>
        ) : null}

        {/* avaliações */}
        <View
          style={[
            styles.reviewsSection,
            wide && styles.reviewsSectionWide,
          ]}
        >
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.eyebrow}>
                O QUE VOCÊ ACHOU
              </Text>

              <Text
                style={[
                  styles.sectionTitle,
                  wide && styles.sectionTitleWide,
                ]}
              >
                Suas avaliações
              </Text>
            </View>

            <View style={styles.reviewBadge}>
              <Text style={styles.reviewBadgeNumber}>
                {reviewCount}
              </Text>

              <Text style={styles.reviewBadgeText}>
                opiniões
              </Text>
            </View>
          </View>

          {reviews.length === 0 ? (
            <View style={styles.emptyReviews}>
              <Text style={styles.emptyIcon}>
                ✦
              </Text>

              <Text style={styles.emptyTitle}>
                Você ainda não avaliou nenhuma obra.
              </Text>

              <Text style={styles.emptyText}>
                Quando fizer uma avaliação, ela
                aparecerá aqui.
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.reviewList,
                wide && styles.reviewListWide,
              ]}
            >
              {reviews.map((review, index) => (
                <View
                  key={review.id}
                  style={[
                    styles.reviewCard,
                    wide && styles.reviewCardWide,
                  ]}
                >
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Text
                        style={styles.reviewAvatarText}
                      >
                        {displayName
                          .charAt(0)
                          .toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewUser}>
                        {displayName}
                      </Text>

                      <Text style={styles.reviewWork}>
                        {getKindLabel(review.kind)}
                        {' · '}
                        {review.title ||
                          'Obra avaliada'}
                      </Text>
                    </View>

                    <Text style={styles.reviewNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.ratingRow}>
                    <Text style={styles.stars}>
                      {'★'.repeat(
                        Math.max(
                          0,
                          Math.min(
                            5,
                            review.rating || 0,
                          ),
                        ),
                      )}
                    </Text>

                    <Text style={styles.ratingText}>
                      {review.rating}/5
                    </Text>
                  </View>

                  <Text style={styles.worthIt}>
                    {getWorthItLabel(
                      review.worth_it,
                    )}
                  </Text>

                  {review.comment ? (
                    <Text
                      style={[
                        styles.reviewComment,
                        wide &&
                          styles.reviewCommentWide,
                      ]}
                    >
                      {review.comment}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.reviewComment,
                        styles.reviewCommentMuted,
                      ]}
                    >
                      Nenhum comentário foi
                      adicionado.
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* frase final */}
        <View
          style={[
            styles.quoteSection,
            wide && styles.quoteSectionWide,
          ]}
        >
          <View style={styles.quoteLine} />

          <Text style={styles.quoteMark}>
            “
          </Text>

          <Text
            style={[
              styles.quoteText,
              wide && styles.quoteTextWide,
            ]}
          >
            Toda opinião conta uma história.
          </Text>

          <Text style={styles.quoteSubtext}>
            Continue descobrindo novas histórias
            no Montenegro.
          </Text>

          <View style={styles.quoteLine} />
        </View>

        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

export function EditProfileScreen({
  navigation,
}: EditProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;

  const [name, setName] =
    useState('');

  const [bio, setBio] =
    useState('');

  const [status, setStatus] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    api
      .me()
      .then(({ user }) => {
        setName(user.name);
        setBio(user.bio || '');
      })
      .catch((error) => {
        setStatus(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o perfil.',
        );
      });
  }, []);

  async function save() {
    if (!name.trim()) {
      setStatus('Informe seu nome.');
      return;
    }

    try {
      setLoading(true);
      setStatus('');

      await api.updateProfile({
        name: name.trim(),
        bio: bio.trim() || null,
      });

      navigation.replace('Profile');
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar o perfil.',
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setAuthToken(null);
    navigation.replace('Home');
  }

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.editPage}
        keyboardShouldPersistTaps="handled"
      >
        <AppHeader navigation={navigation} />

        {/* cabeçalho */}
        <View
          style={[
            styles.editHeader,
            wide && styles.editHeaderWide,
          ]}
        >
          <Text style={styles.eyebrow}>
            CONFIGURAÇÕES
          </Text>

          <Text
            style={[
              styles.pageTitle,
              wide && styles.pageTitleWide,
            ]}
          >
            Editar perfil
          </Text>

          <Text
            style={[
              styles.pageSubtitle,
              wide && styles.pageSubtitleWide,
            ]}
          >
            Personalize as informações que
            aparecem no seu perfil.
          </Text>
        </View>

        {/* avatar */}
        <View
          style={[
            styles.editAvatarArea,
            wide && styles.editAvatarAreaWide,
          ]}
        >
          <View style={styles.editAvatarWrapper}>
            <Image
              source={{
                uri: fallbackAvatar,
              }}
              style={[
                styles.editAvatar,
                wide && styles.editAvatarWide,
              ]}
              resizeMode="cover"
            />

            <View style={styles.cameraBadge}>
              <Text style={styles.cameraText}>
                ✦
              </Text>
            </View>
          </View>

          <Text style={styles.avatarHint}>
            Sua foto de perfil
          </Text>
        </View>

        {/* formulário */}
        <View
          style={[
            styles.formCard,
            wide && styles.formCardWide,
          ]}
        >
          <Text style={styles.formTitle}>
            Suas informações
          </Text>

          <Text style={styles.formDescription}>
            Mantenha seus dados atualizados
            para deixar seu perfil com a
            sua cara.
          </Text>

          <Text style={styles.label}>
            Nome
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            style={[
              styles.input,
              wide && styles.inputWide,
            ]}
            placeholder="Seu nome"
            placeholderTextColor="#8B838F"
          />

          <Text style={styles.label}>
            Bio
          </Text>

          <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            style={[
              styles.bioInput,
              wide && styles.bioInputWide,
            ]}
            placeholder="Conte um pouco sobre você..."
            placeholderTextColor="#8B838F"
            textAlignVertical="top"
          />

          {status ? (
            <Text style={styles.status}>
              {status}
            </Text>
          ) : null}

          <Pressable
            disabled={loading}
            onPress={save}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.pressed,
              loading && styles.loadingButton,
            ]}
          >
            <Text style={styles.saveText}>
              {loading
                ? 'Salvando...'
                : 'Salvar alterações'}
            </Text>

            {!loading ? (
              <Text style={styles.saveArrow}>
                →
              </Text>
            ) : null}
          </Pressable>

          <View style={styles.logoutDivider} />

          <Pressable
            onPress={logout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.logoutIcon}>
              ↪
            </Text>

            <Text style={styles.logoutText}>
              Sair da conta
            </Text>
          </Pressable>
        </View>

        <View style={styles.footerSpace} />

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

  editPage: {
    flexGrow: 1,
    paddingBottom: 0,
    backgroundColor: '#FFFFFF',
  },

  /* cabeçalho */

  titleArea: {
    paddingHorizontal: 24,
    marginTop: 35,
  },

  titleAreaWide: {
    width: '84%',
    maxWidth: 1200,
    alignSelf: 'center',
    marginTop: 55,
  },

  editHeader: {
    paddingHorizontal: 24,
    marginTop: 35,
  },

  editHeaderWide: {
    width: '84%',
    maxWidth: 900,
    alignSelf: 'center',
    marginTop: 55,
  },

  eyebrow: {
    color: colors.green,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7.5,
    letterSpacing: 1.8,
  },

  pageTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 34,
    marginTop: 2,
  },

  pageTitleWide: {
    fontSize: 50,
  },

  pageSubtitle: {
    color: '#817985',
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
    maxWidth: 500,
  },

  pageSubtitleWide: {
    fontSize: 12,
    lineHeight: 20,
  },

  /* perfil */

  profileCard: {
    marginHorizontal: 20,
    marginTop: 28,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F4F0F6',
    borderWidth: 1,
    borderColor: '#E8E0EB',
  },

  profileCardWide: {
    width: '84%',
    maxWidth: 1200,
    alignSelf: 'center',
    marginTop: 42,
    borderRadius: 32,
  },

  profileTop: {
    height: 7,
    backgroundColor: colors.green,
  },

  profileContent: {
    padding: 20,
    gap: 22,
  },

  profileContentWide: {
    padding: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatarWrapper: {
    position: 'relative',
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#D5D6DA',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },

  avatarWide: {
    width: 135,
    height: 135,
    borderRadius: 68,
  },

  onlineDot: {
    position: 'absolute',
    right: 1,
    bottom: 7,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: colors.green,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  identityText: {
    marginLeft: 17,
    flex: 1,
  },

  name: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
  },

  nameWide: {
    fontSize: 38,
  },

  email: {
    color: '#625967',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    marginTop: 2,
  },

  emailWide: {
    fontSize: 12,
  },

  joined: {
    color: '#8B838F',
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
    marginTop: 6,
  },

  joinedWide: {
    fontSize: 10,
  },

  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  profileActionsWide: {
    gap: 25,
    justifyContent: 'flex-end',
  },

  stats: {
    alignItems: 'center',
    marginRight: 18,
  },

  statsNumber: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
  },

  statsLabel: {
    color: '#817985',
    fontFamily: 'Poppins_400Regular',
    fontSize: 7,
  },

  editButton: {
    borderWidth: 1.3,
    borderColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 17,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  editButtonText: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
  },

  editArrow: {
    color: colors.purple,
    fontSize: 14,
  },

  status: {
    color: '#B00020',
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    textAlign: 'center',
    marginHorizontal: 22,
    marginTop: 18,
  },

  /* avaliações */

  reviewsSection: {
    paddingHorizontal: 20,
    marginTop: 42,
  },

  reviewsSectionWide: {
    width: '84%',
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 0,
    marginTop: 65,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  sectionTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 25,
    marginTop: 2,
  },

  sectionTitleWide: {
    fontSize: 35,
  },

  reviewBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    backgroundColor: '#F2EAF5',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  reviewBadgeNumber: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
  },

  reviewBadgeText: {
    color: '#817985',
    fontFamily: 'Poppins_400Regular',
    fontSize: 7,
  },

  reviewList: {
    gap: 14,
  },

  reviewListWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 22,
  },

  reviewCard: {
    backgroundColor: '#FFF8DC',
    borderRadius: 19,
    padding: 17,
    borderWidth: 1,
    borderColor: '#F1E4A8',
  },

  reviewCardWide: {
    width: '31.8%',
    minHeight: 245,
    borderRadius: 24,
    padding: 23,
  },

  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  reviewAvatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  reviewAvatarText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
  },

  reviewInfo: {
    flex: 1,
    marginLeft: 10,
  },

  reviewUser: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
  },

  reviewWork: {
    color: '#756C79',
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
    marginTop: 1,
  },

  reviewNumber: {
    color: '#B5A8B8',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#E6DFAF',
    marginTop: 13,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
  },

  stars: {
    color: '#D5A900',
    fontSize: 14,
    letterSpacing: 1.5,
  },

  ratingText: {
    color: '#8C7C25',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8,
  },

  worthIt: {
    alignSelf: 'flex-start',
    color: colors.purple,
    backgroundColor: '#F2EAF5',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7,
    marginTop: 8,
  },

  reviewComment: {
    color: '#3E3942',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 9,
  },

  reviewCommentWide: {
    fontSize: 11,
    lineHeight: 18,
  },

  reviewCommentMuted: {
    color: '#978E9B',
  },

  emptyReviews: {
    alignItems: 'center',
    backgroundColor: '#F7F4F8',
    borderWidth: 1,
    borderColor: '#E8E0EB',
    borderRadius: 22,
    paddingHorizontal: 25,
    paddingVertical: 35,
  },

  emptyIcon: {
    color: colors.green,
    fontSize: 26,
  },

  emptyTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 7,
  },

  emptyText: {
    color: '#817985',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 4,
  },

  /* frase */

  quoteSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 55,
    paddingBottom: 60,
  },

  quoteSectionWide: {
    paddingTop: 85,
    paddingBottom: 90,
  },

  quoteLine: {
    width: 35,
    height: 2,
    backgroundColor: colors.green,
    borderRadius: 2,
    marginVertical: 9,
  },

  quoteMark: {
    color: '#D8CDE0',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 29,
    lineHeight: 32,
  },

  quoteText: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: -4,
  },

  quoteTextWide: {
    fontSize: 27,
  },

  quoteSubtext: {
    color: '#938A99',
    fontFamily: 'Poppins_400Regular',
    fontSize: 8.5,
    marginTop: 5,
    textAlign: 'center',
  },

  /* editar perfil */

  editAvatarArea: {
    alignItems: 'center',
    marginTop: 30,
  },

  editAvatarAreaWide: {
    marginTop: 45,
  },

  editAvatarWrapper: {
    position: 'relative',
  },

  editAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D5D6DA',
    borderWidth: 5,
    borderColor: '#F1EBF3',
  },

  editAvatarWide: {
    width: 165,
    height: 165,
    borderRadius: 83,
  },

  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 3,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.purple,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraText: {
    color: '#FFFFFF',
    fontSize: 15,
  },

  avatarHint: {
    color: '#8B838F',
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
    marginTop: 8,
  },

  formCard: {
    width: '90%',
    maxWidth: 650,
    alignSelf: 'center',
    backgroundColor: '#F7F4F8',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E8E0EB',
    padding: 20,
    marginTop: 30,
  },

  formCardWide: {
    width: '84%',
    maxWidth: 850,
    borderRadius: 30,
    padding: 32,
    marginTop: 45,
  },

  formTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 19,
  },

  formDescription: {
    color: '#817985',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
    marginBottom: 12,
  },

  label: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    marginTop: 17,
    marginBottom: 7,
  },

  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#DDD4E1',
    borderRadius: 11,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    color: '#332B37',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },

  inputWide: {
    height: 58,
    fontSize: 13,
    borderRadius: 13,
  },

  bioInput: {
    width: '100%',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#DDD4E1',
    borderRadius: 11,
    padding: 14,
    backgroundColor: '#FFFFFF',
    color: '#332B37',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    textAlignVertical: 'top',
  },

  bioInputWide: {
    minHeight: 160,
    fontSize: 13,
    borderRadius: 13,
  },

  saveButton: {
    alignSelf: 'center',
    backgroundColor: colors.purple,
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 11,
    marginTop: 27,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  saveText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
  },

  saveArrow: {
    color: '#FFFFFF',
    fontSize: 14,
  },

  loadingButton: {
    opacity: 0.65,
  },

  logoutDivider: {
    height: 1,
    backgroundColor: '#E3DCE6',
    marginTop: 28,
    marginBottom: 18,
  },

  logoutButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D7C7DA',
    backgroundColor: '#FFFFFF',
  },

  logoutIcon: {
    color: '#8B4B76',
    fontSize: 15,
  },

  logoutText: {
    color: '#8B4B76',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
  },

  footerSpace: {
    height: 30,
  },

  pressed: {
    opacity: 0.72,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },
});