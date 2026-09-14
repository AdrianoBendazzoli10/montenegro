import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { api, type ApiReview, type ApiUser } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

const fallbackAvatar = 'https://www.figma.com/api/mcp/asset/a8da2ab3-025d-4721-91cd-627875402a46.png';

type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;
type EditProps = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const demoReviews: ApiReview[] = Array.from({ length: 6 }, (_, index) => ({
  id: -(index + 1), user_id: -1, work_id: -1, mode: 'rapida', rating: 5, worth_it: 'sim',
  title: 'Fazendo meu filme', kind: 'livro', comment: 'É uma obra simples e encantadora, mas cheia de significados profundos. A narrativa é leve, porém convida o leitor a refletir sobre temas como amizade, amor e a essência das pessoas.',
}));

function formatJoined(value?: string) {
  if (!value) return '20/10/2025';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '20/10/2025' : date.toLocaleDateString('pt-BR');
}

export function ProfileScreen({ navigation }: ProfileProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const [user, setUser] = useState<ApiUser | null>(null);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([api.me(), api.listMyReviews()])
      .then(([meResponse, reviewsResponse]) => {
        if (!active) return;
        setUser(meResponse.user);
        setReviews(reviewsResponse.reviews);
        setStatus('');
      })
      .catch((error) => {
        if (!active) return;
        setStatus(error instanceof Error ? error.message : 'Não foi possível carregar o perfil.');
      });
    return () => { active = false; };
  }, []);

  const visibleReviews = reviews.length ? reviews : demoReviews;
  const avatar = user?.avatar_url || fallbackAvatar;
  const displayName = user?.name || 'Gabriely Santos';
  const createdAt = (user as (ApiUser & { created_at?: string }) | null)?.created_at;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <AppHeader navigation={navigation} />
        <Text style={[styles.pageTitle, wide && styles.pageTitleWide]}>PERFIL</Text>

        <View style={[styles.profileTop, wide && styles.profileTopWide]}>
          <View style={[styles.identity, wide && styles.identityWide]}>
            <Image source={{ uri: avatar }} style={[styles.avatarImage, wide && styles.avatarImageWide]} resizeMode="cover" />
            <View style={styles.identityInfo}>
              <Text style={[styles.name, wide && styles.nameWide]}>{displayName}</Text>
              <Text style={[styles.count, wide && styles.countWide]}>{reviews.length || 13} avaliações</Text>
            </View>
          </View>
          <Pressable onPress={() => navigation.navigate('EditProfile')} style={[styles.editButton, wide && styles.editButtonWide]}><Text style={[styles.editButtonText, wide && styles.editButtonTextWide]}>Editar perfil</Text></Pressable>
        </View>
        <Text style={[styles.joined, wide && styles.joinedWide]}>Entrou em {formatJoined(createdAt)}</Text>
        {status ? <Text style={styles.status}>{status}</Text> : null}

        <View style={[styles.reviewList, wide && styles.reviewListWide]}>
          {visibleReviews.slice(0, 6).map((review) => (
            <View key={review.id} style={[styles.reviewCard, wide && styles.reviewCardWide]}>
              <View style={styles.reviewTop}><View style={styles.smallAvatar} /><View style={styles.reviewUserText}><Text style={styles.reviewName}>{displayName}</Text><Text style={styles.reviewWork}>{review.kind === 'filme' ? 'Filme' : review.kind === 'serie' ? 'Série' : 'Livro'}: {review.title || 'Obra avaliada'}</Text></View></View>
              <View style={styles.divider} />
              <Text style={styles.stars}>{'★'.repeat(Math.max(1, Math.min(5, review.rating || 5)))}</Text>
              <Text style={[styles.reviewCopy, wide && styles.reviewCopyWide]}>{review.comment || 'Avaliação publicada no Montenegro.'}</Text>
            </View>
          ))}
        </View>
        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

export function EditProfileScreen({ navigation }: EditProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.me().then(({ user }) => {
      setName(user.name);
      setBio(user.bio || '');
      setAvatarUrl(user.avatar_url || '');
    }).catch((error) => setStatus(error instanceof Error ? error.message : 'Não foi possível carregar o perfil.'));
  }, []);

  async function save() {
    if (!name.trim()) {
      setStatus('Informe seu nome.');
      return;
    }
    try {
      setLoading(true);
      setStatus('');
      await api.updateProfile({ name: name.trim(), bio: bio.trim() || null, avatar_url: avatarUrl.trim() || null });
      navigation.replace('Profile');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível salvar o perfil.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.editPage} keyboardShouldPersistTaps="handled">
        <AppHeader navigation={navigation} />
        <Text style={[styles.pageTitle, wide && styles.pageTitleWide]}>PERFIL</Text>
        <Image source={{ uri: avatarUrl || fallbackAvatar }} style={[styles.editAvatar, wide && styles.editAvatarWide]} resizeMode="cover" />
        <Text style={styles.editLabel}>Nome</Text>
        <TextInput value={name} onChangeText={setName} style={[styles.input, wide && styles.inputWide]} placeholder="Seu nome" placeholderTextColor="#6E7480" />
        <Text style={styles.editLabel}>Foto (URL)</Text>
        <TextInput value={avatarUrl} onChangeText={setAvatarUrl} style={[styles.input, wide && styles.inputWide]} placeholder="https://..." placeholderTextColor="#6E7480" autoCapitalize="none" />
        <Text style={styles.editLabel}>Bio</Text>
        <TextInput value={bio} onChangeText={setBio} multiline style={[styles.bioInput, wide && styles.bioInputWide]} placeholder="Conte um pouco sobre você" placeholderTextColor="#6E7480" />
        {status ? <Text style={styles.status}>{status}</Text> : null}
        <Pressable disabled={loading} onPress={save} style={({ pressed }) => [styles.saveButton, (pressed || loading) && styles.pressed]}><Text style={styles.saveText}>{loading ? 'Salvando...' : 'Salvar alterações'}</Text></Pressable>
        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  page: { paddingBottom: 0, backgroundColor: '#FFFFFF' },
  editPage: { flexGrow: 1, paddingBottom: 0, backgroundColor: '#FFFFFF' },
  pageTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 31, textAlign: 'center', marginTop: 30 },
  pageTitleWide: { fontSize: 48, marginTop: 38 },
  profileTop: { marginTop: 34, paddingHorizontal: 26, gap: 20 },
  profileTopWide: { width: '84%', maxWidth: 1200, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 64 },
  identity: { flexDirection: 'row', alignItems: 'center' },
  identityWide: { flex: 1 },
  avatarImage: { width: 94, height: 94, borderRadius: 47, backgroundColor: '#D5D6DA' },
  avatarImageWide: { width: 149, height: 149, borderRadius: 75 },
  identityInfo: { flex: 1, marginLeft: 18 },
  name: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 25, lineHeight: 31 },
  nameWide: { fontSize: 43, lineHeight: 54 },
  count: { color: '#111111', fontFamily: 'Poppins_400Regular', fontSize: 14, marginTop: 2 },
  countWide: { fontSize: 22 },
  joined: { color: '#111111', fontFamily: 'Poppins_400Regular', fontSize: 14, marginHorizontal: 27, marginTop: 24 },
  joinedWide: { width: '84%', maxWidth: 1200, alignSelf: 'center', marginTop: 24, marginHorizontal: 0, fontSize: 20 },
  editButton: { alignSelf: 'flex-end', borderWidth: 1.5, borderColor: colors.purple, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 8 },
  editButtonWide: { paddingHorizontal: 30, paddingVertical: 11 },
  editButtonText: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  editButtonTextWide: { fontSize: 19 },
  status: { color: '#B00020', fontFamily: 'Poppins_400Regular', fontSize: 11, textAlign: 'center', marginHorizontal: 22, marginTop: 18 },
  reviewList: { paddingHorizontal: 18, marginTop: 38, gap: 14 },
  reviewListWide: { width: '84%', maxWidth: 1200, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 24, marginTop: 66, paddingHorizontal: 0 },
  reviewCard: { backgroundColor: 'rgba(238,203,63,.83)', borderRadius: 14, padding: 15 },
  reviewCardWide: { width: '31.8%', minHeight: 233, borderRadius: 20, padding: 22 },
  reviewTop: { flexDirection: 'row', alignItems: 'center' },
  smallAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#001A38' },
  reviewUserText: { marginLeft: 9, flex: 1 },
  reviewName: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  reviewWork: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 9 },
  divider: { height: 1, backgroundColor: colors.green, marginTop: 8 },
  stars: { color: colors.green, fontSize: 15, letterSpacing: 1, marginTop: 7 },
  reviewCopy: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 10, lineHeight: 15, marginTop: 4 },
  reviewCopyWide: { fontSize: 12, lineHeight: 18 },
  editAvatar: { width: 116, height: 116, borderRadius: 58, alignSelf: 'center', marginTop: 30, backgroundColor: '#D5D6DA' },
  editAvatarWide: { width: 160, height: 160, borderRadius: 80, marginTop: 55 },
  editLabel: { width: '88%', maxWidth: 650, alignSelf: 'center', color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 14, marginTop: 20, marginBottom: 7 },
  input: { width: '88%', maxWidth: 650, alignSelf: 'center', height: 52, borderWidth: 1, borderColor: '#001A38', borderRadius: 10, paddingHorizontal: 16, color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 14 },
  inputWide: { height: 60, fontSize: 16 },
  bioInput: { width: '88%', maxWidth: 650, alignSelf: 'center', minHeight: 130, borderWidth: 1, borderColor: '#001A38', borderRadius: 10, padding: 16, color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 14, textAlignVertical: 'top' },
  bioInputWide: { minHeight: 170, fontSize: 16 },
  saveButton: { alignSelf: 'center', borderWidth: 1.5, borderColor: colors.purple, borderRadius: 999, paddingHorizontal: 24, paddingVertical: 10, marginTop: 28, marginBottom: 54 },
  saveText: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
  pressed: { opacity: 0.65 },
});
