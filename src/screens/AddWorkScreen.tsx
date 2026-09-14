import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { MediaKind, RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { api } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'AddWork'>;

const typeLabels: Record<MediaKind, string> = { livro: 'Livro', filme: 'Filme', serie: 'Série' };

export function AddWorkScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const [kind, setKind] = useState<MediaKind | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [creator, setCreator] = useState('');
  const [publisher, setPublisher] = useState('');
  const [genre, setGenre] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const creatorLabel = kind === 'livro' ? 'Autor' : kind === 'filme' ? 'Diretor' : 'Criador';
  const nameLabel = kind === 'livro' ? 'Nome do livro' : kind === 'filme' ? 'Nome do filme' : 'Nome da série';

  async function handleSubmit() {
    if (!kind) return;
    setMessage('');
    if (!title.trim() || !creator.trim()) {
      setMessage('Preencha o nome da obra e o autor/diretor.');
      return;
    }

    const yearMatch = date.match(/\b(18|19|20|21)\d{2}\b/);
    const releaseDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;

    try {
      setLoading(true);
      const response = await api.createWork({
        title: title.trim(),
        kind,
        creator: creator.trim(),
        publisher: kind === 'livro' ? publisher.trim() || null : null,
        release_date: releaseDate,
        year: yearMatch ? Number(yearMatch[0]) : null,
        genre: genre.trim() || null,
        synopsis: synopsis.trim() || null,
        image_url: imageUrl.trim() || null,
      });
      navigation.replace('Details', { id: String(response.work.id) });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Não foi possível cadastrar a obra.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <AppHeader navigation={navigation} />
        <Text style={[styles.pageTitle, wide && styles.pageTitleWide]}>CADASTRAR NOVA OBRA</Text>

        {!kind ? <View style={[styles.selectArea, wide && styles.selectAreaWide]}>
          <Text style={[styles.illustration, wide && styles.illustrationWide]}>🎬  🪑  🇧🇷</Text>
          <View style={[styles.typeButtons, wide && styles.typeButtonsWide]}>
            {(['livro', 'filme', 'serie'] as MediaKind[]).map((value) => (
              <Pressable key={value} onPress={() => setKind(value)} style={({ pressed }) => [styles.typeButton, wide && styles.typeButtonWide, pressed && styles.pressed]}><Text style={[styles.typeText, wide && styles.typeTextWide]}>{typeLabels[value]}</Text></Pressable>
            ))}
          </View>
        </View> : <View style={[styles.formWrap, wide && styles.formWrapWide]}>
          <Pressable onPress={() => setKind(null)} style={styles.changeType}><Text style={styles.changeTypeText}>← trocar tipo ({typeLabels[kind]})</Text></Pressable>

          <View style={[styles.topForm, wide && styles.topFormWide]}>
            <View style={[styles.photoColumn, wide && styles.photoColumnWide]}>
              <Text style={[styles.sideLabel, wide && styles.sideLabelWide]}>{nameLabel}:</Text>
              <TextInput value={title} onChangeText={setTitle} placeholder={nameLabel} placeholderTextColor="#747474" style={[styles.input, wide && styles.inputWide]} />
              <View style={[styles.photoBox, wide && styles.photoBoxWide]}><Text style={[styles.camera, wide && styles.cameraWide]}>📷+</Text></View>
              <TextInput value={imageUrl} onChangeText={setImageUrl} placeholder="URL da capa (opcional)" placeholderTextColor="#747474" style={[styles.input, styles.coverUrl, wide && styles.inputWide]} autoCapitalize="none" />
            </View>

            <View style={[styles.fieldsColumn, wide && styles.fieldsColumnWide]}>
              <Text style={[styles.label, wide && styles.labelWide]}>Data de publicação:</Text>
              <TextInput value={date} onChangeText={setDate} placeholder="Data de publicação" placeholderTextColor="#747474" style={[styles.input, wide && styles.inputWide]} />
              <Text style={[styles.label, wide && styles.labelWide]}>{creatorLabel}:</Text>
              <TextInput value={creator} onChangeText={setCreator} placeholder={creatorLabel} placeholderTextColor="#747474" style={[styles.input, wide && styles.inputWide]} />
              {kind === 'livro' ? <><Text style={[styles.label, wide && styles.labelWide]}>Editora:</Text><TextInput value={publisher} onChangeText={setPublisher} placeholder="Editora" placeholderTextColor="#747474" style={[styles.input, wide && styles.inputWide]} /></> : null}
              <Text style={[styles.label, wide && styles.labelWide]}>Gênero:</Text>
              <TextInput value={genre} onChangeText={setGenre} placeholder="Escolha o gênero" placeholderTextColor="#747474" style={[styles.input, wide && styles.inputWide]} />
            </View>
          </View>

          <Text style={[styles.synopsisLabel, wide && styles.synopsisLabelWide]}>Sinopse:</Text>
          <TextInput value={synopsis} onChangeText={setSynopsis} multiline placeholder="Sinopse..." placeholderTextColor="#747474" style={[styles.textarea, wide && styles.textareaWide]} />
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <Pressable disabled={loading} onPress={handleSubmit} style={({ pressed }) => [styles.submitButton, wide && styles.submitButtonWide, (pressed || loading) && styles.pressed]}><Text style={[styles.submitText, wide && styles.submitTextWide]}>{loading ? 'Cadastrando...' : `Cadastrar ${typeLabels[kind].toLowerCase()}`}</Text></Pressable>
        </View>}
        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  page: { flexGrow: 1, paddingBottom: 0, backgroundColor: '#FFFFFF' },
  pageTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 28, lineHeight: 35, textAlign: 'center', paddingHorizontal: 20, marginTop: 32 },
  pageTitleWide: { fontSize: 44, lineHeight: 58, marginTop: 46 },
  selectArea: { minHeight: 610, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  selectAreaWide: { minHeight: 1040, justifyContent: 'space-around', paddingTop: 100, paddingBottom: 150 },
  illustration: { fontSize: 54, textAlign: 'center', marginBottom: 45 },
  illustrationWide: { fontSize: 90, alignSelf: 'flex-start', marginLeft: '12%', marginBottom: 0 },
  typeButtons: { width: '100%', gap: 14 },
  typeButtonsWide: { width: '76%', flexDirection: 'row', justifyContent: 'space-between', gap: 70 },
  typeButton: { height: 50, borderWidth: 1.5, borderColor: '#001A38', borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  typeButtonWide: { width: 159, height: 67 },
  typeText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 16 },
  typeTextWide: { fontSize: 22 },
  pressed: { opacity: 0.65 },
  formWrap: { paddingHorizontal: 22, paddingTop: 28, paddingBottom: 48, width: '100%', maxWidth: 520, alignSelf: 'center' },
  formWrapWide: { maxWidth: 1240, paddingTop: 65, paddingBottom: 90 },
  changeType: { alignSelf: 'flex-start', marginBottom: 24 },
  changeTypeText: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
  topForm: { gap: 8 },
  topFormWide: { flexDirection: 'row', alignItems: 'flex-start', gap: 70 },
  photoColumn: { width: '100%' },
  photoColumnWide: { width: 442 },
  fieldsColumn: { flex: 1 },
  fieldsColumnWide: { paddingTop: 100 },
  sideLabel: { color: '#161616', fontFamily: 'Roboto_300Light', fontSize: 15, marginBottom: 7 },
  sideLabelWide: { fontSize: 24, marginBottom: 12 },
  photoBox: { width: 180, height: 230, borderRadius: 10, backgroundColor: '#D9D9D9', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 12 },
  photoBoxWide: { width: 442, height: 623, marginTop: 65, marginBottom: 14 },
  camera: { fontSize: 36, color: '#001A38' },
  cameraWide: { fontSize: 70 },
  coverUrl: { marginTop: 4 },
  label: { color: '#161616', fontFamily: 'Roboto_300Light', fontSize: 15, marginBottom: 7, marginTop: 15 },
  labelWide: { fontSize: 24, marginTop: 22, marginBottom: 12 },
  input: { height: 50, borderWidth: 1, borderColor: '#001A38', borderRadius: 9, paddingHorizontal: 14, color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 13 },
  inputWide: { height: 60, borderRadius: 10, fontSize: 17, paddingHorizontal: 18 },
  synopsisLabel: { color: '#161616', fontFamily: 'Roboto_300Light', fontSize: 15, marginTop: 24, marginBottom: 8 },
  synopsisLabelWide: { fontSize: 24, textAlign: 'center', marginTop: 54, marginBottom: 22 },
  textarea: { minHeight: 165, borderWidth: 1, borderColor: '#001A38', borderRadius: 9, padding: 14, color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 13, textAlignVertical: 'top' },
  textareaWide: { width: 1051, minHeight: 272, alignSelf: 'center', borderRadius: 10, padding: 20, fontSize: 17 },
  message: { color: colors.green, fontFamily: 'Poppins_600SemiBold', fontSize: 12, textAlign: 'center', marginTop: 18 },
  submitButton: { alignSelf: 'center', borderWidth: 1.5, borderColor: '#001A38', borderRadius: 999, paddingHorizontal: 22, paddingVertical: 9, marginTop: 18 },
  submitButtonWide: { minWidth: 217, minHeight: 57, justifyContent: 'center', marginTop: 60 },
  submitText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  submitTextWide: { fontSize: 16, textAlign: 'center' },
});
