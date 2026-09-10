import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { MediaKind, RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'AddWork'>;

const typeLabels: Record<MediaKind, string> = { livro: 'Livro', filme: 'Filme', serie: 'Série' };

export function AddWorkScreen({ navigation }: Props) {
  const [kind, setKind] = useState<MediaKind | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [creator, setCreator] = useState('');
  const [publisher, setPublisher] = useState('');
  const [genre, setGenre] = useState('');
  const [synopsis, setSynopsis] = useState('');

  const creatorLabel = kind === 'livro' ? 'Autor' : kind === 'filme' ? 'Diretor' : 'Criador';
  const nameLabel = kind === 'livro' ? 'Nome do livro' : kind === 'filme' ? 'Nome do filme' : 'Nome da série';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></Pressable>
          <Text style={styles.brand}>MONTENEGRO</Text>
          <Pressable onPress={() => navigation.navigate('Profile')}><Text style={styles.profile}>●</Text></Pressable>
        </View>

        <Text style={styles.pageTitle}>CADASTRAR NOVA OBRA</Text>

        {!kind ? (
          <View style={styles.selectArea}>
            <Text style={styles.illustration}>🎬 🪑 🇧🇷</Text>
            <Text style={styles.selectPrompt}>Qual tipo de obra você quer cadastrar?</Text>
            <View style={styles.typeButtons}>
              {(['livro', 'filme', 'serie'] as MediaKind[]).map((value) => (
                <Pressable key={value} onPress={() => setKind(value)} style={({ pressed }) => [styles.typeButton, pressed && styles.pressed]}>
                  <Text style={styles.typeText}>{typeLabels[value]}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.formWrap}>
            <Pressable onPress={() => setKind(null)} style={styles.changeType}><Text style={styles.changeTypeText}>← trocar tipo ({typeLabels[kind]})</Text></Pressable>

            <View style={styles.photoBox}><Text style={styles.camera}>📷+</Text><Text style={styles.photoText}>Adicionar capa</Text></View>

            <Text style={styles.label}>{nameLabel}:</Text>
            <TextInput value={title} onChangeText={setTitle} placeholder={nameLabel} placeholderTextColor="#747474" style={styles.input} />

            <Text style={styles.label}>Data de publicação:</Text>
            <TextInput value={date} onChangeText={setDate} placeholder="Data de publicação" placeholderTextColor="#747474" style={styles.input} />

            <Text style={styles.label}>{creatorLabel}:</Text>
            <TextInput value={creator} onChangeText={setCreator} placeholder={creatorLabel} placeholderTextColor="#747474" style={styles.input} />

            {kind === 'livro' ? <><Text style={styles.label}>Editora:</Text><TextInput value={publisher} onChangeText={setPublisher} placeholder="Editora" placeholderTextColor="#747474" style={styles.input} /></> : null}

            <Text style={styles.label}>Gênero:</Text>
            <TextInput value={genre} onChangeText={setGenre} placeholder="Escolha o gênero" placeholderTextColor="#747474" style={styles.input} />

            <Text style={styles.label}>Sinopse:</Text>
            <TextInput value={synopsis} onChangeText={setSynopsis} multiline placeholder="Sinopse..." placeholderTextColor="#747474" style={styles.textarea} />

            <Pressable onPress={() => navigation.navigate('Explore')} style={styles.submitButton}><Text style={styles.submitText}>Cadastrar {typeLabels[kind].toLowerCase()}</Text></Pressable>
          </View>
        )}

        <View style={styles.footer}><Text style={styles.footerBrand}>🎬🎟️🇧🇷{`\n`}MONTENEGRO</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  page: { flexGrow: 1, paddingBottom: 0 },
  header: { marginHorizontal: 18, marginTop: 8, height: 54, backgroundColor: colors.purple, borderRadius: 999, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { color: '#fff', fontSize: 34, lineHeight: 36 },
  brand: { color: '#fff', fontFamily: 'Cinzel_700Bold', fontSize: 18 },
  profile: { color: '#fff', fontSize: 15 },
  pageTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 28, lineHeight: 35, textAlign: 'center', paddingHorizontal: 20, marginTop: 32 },
  selectArea: { flex: 1, minHeight: 570, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  illustration: { fontSize: 54, textAlign: 'center', marginBottom: 45 },
  selectPrompt: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 15, textAlign: 'center', marginBottom: 22 },
  typeButtons: { width: '100%', gap: 14 },
  typeButton: { height: 50, borderWidth: 1.5, borderColor: '#001A38', borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  typeText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 16 },
  pressed: { opacity: .65 },
  formWrap: { paddingHorizontal: 22, paddingTop: 28, paddingBottom: 48, width: '100%', maxWidth: 520, alignSelf: 'center' },
  changeType: { alignSelf: 'flex-start', marginBottom: 20 },
  changeTypeText: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
  photoBox: { width: 180, height: 230, borderRadius: 10, backgroundColor: '#D9D9D9', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  camera: { fontSize: 36 },
  photoText: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 11, marginTop: 8 },
  label: { color: '#161616', fontFamily: 'Poppins_400Regular', fontSize: 15, marginBottom: 7, marginTop: 15 },
  input: { height: 50, borderWidth: 1, borderColor: '#001A38', borderRadius: 9, paddingHorizontal: 14, color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 13 },
  textarea: { minHeight: 165, borderWidth: 1, borderColor: '#001A38', borderRadius: 9, padding: 14, color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 13, textAlignVertical: 'top' },
  submitButton: { alignSelf: 'center', borderWidth: 1.5, borderColor: '#001A38', borderRadius: 999, paddingHorizontal: 22, paddingVertical: 9, marginTop: 28 },
  submitText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  footer: { backgroundColor: colors.purple, paddingVertical: 36, paddingHorizontal: 20 },
  footerBrand: { color: '#FFDD56', fontFamily: 'Cinzel_700Bold', fontSize: 23, lineHeight: 30, textAlign: 'center' },
});