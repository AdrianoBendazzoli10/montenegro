import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MediaKind, RootStackParamList } from '../navigation/types';
import { ScreenShell } from '../components/ScreenShell';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'AddWork'>;

export function AddWorkScreen({ navigation }: Props) {
  const [kind, setKind] = useState<MediaKind>('livro');
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');

  return (
    <ScreenShell title="Cadastrar obra" subtitle="Ajude o catálogo a crescer" onBack={() => navigation.goBack()}>
      <View style={styles.types}>
        {([['livro', 'Livro'], ['filme', 'Filme'], ['serie', 'Série']] as [MediaKind, string][]).map(([value, label]) => (
          <Pressable key={value} onPress={() => setKind(value)} style={[styles.type, kind === value && styles.typeActive]}>
            <Text style={styles.typeText}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Título</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Nome da obra" placeholderTextColor="#8584A5" />
        <Text style={styles.label}>Autor / diretor / criador</Text>
        <TextInput value={creator} onChangeText={setCreator} style={styles.input} placeholder="Quem criou?" placeholderTextColor="#8584A5" />
        <Text style={styles.label}>Ano</Text>
        <TextInput value={year} onChangeText={setYear} keyboardType="number-pad" style={styles.input} placeholder="2026" placeholderTextColor="#8584A5" />
        <Text style={styles.label}>Descrição</Text>
        <TextInput value={description} onChangeText={setDescription} multiline style={[styles.input, styles.textarea]} placeholder="Conte um pouco sobre a obra" placeholderTextColor="#8584A5" />
        <AppButton label="Enviar obra" variant="secondary" onPress={() => navigation.navigate('Explore')} style={styles.submit} />
        <Text style={styles.note}>Nesta versão, o formulário funciona localmente. A persistência entra quando a API/backend for conectado.</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  types: { flexDirection: 'row', gap: 9, marginTop: 8, marginBottom: 18 },
  type: { flex: 1, minHeight: 46, borderRadius: 23, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  typeActive: { backgroundColor: colors.green, borderWidth: 1, borderColor: colors.cream },
  typeText: { color: colors.cream, fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  form: { backgroundColor: 'rgba(52,51,153,.22)', borderRadius: 24, padding: 20 },
  label: { color: colors.cream, fontFamily: 'Poppins_600SemiBold', fontSize: 13, marginTop: 11, marginBottom: 7 },
  input: { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(237,231,219,.2)', backgroundColor: 'rgba(255,255,255,.07)', color: colors.cream, paddingHorizontal: 14, fontFamily: 'Poppins_400Regular' },
  textarea: { minHeight: 120, paddingTop: 13, textAlignVertical: 'top' },
  submit: { marginTop: 24 },
  note: { color: 'rgba(237,231,219,.55)', fontFamily: 'Poppins_400Regular', fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: 14 },
});
