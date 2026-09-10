import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { AppButton } from '../components/AppButton';
import { ScreenShell } from '../components/ScreenShell';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScreenShell title="Criar conta" subtitle="Entre para a comunidade Montenegro" onBack={() => navigation.goBack()}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.wrap}>
        <Text style={styles.intro}>Crie seu perfil para avaliar, descobrir e guardar histórias brasileiras.</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Seu nome" placeholderTextColor="#8F8EAC" style={styles.input} />
          <Text style={styles.label}>E-mail</Text>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="voce@email.com" placeholderTextColor="#8F8EAC" style={styles.input} />
          <Text style={styles.label}>Senha</Text>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" placeholderTextColor="#8F8EAC" style={styles.input} />
          <AppButton label="Cadastrar" onPress={() => navigation.replace('Explore')} style={styles.button} />
          <Text onPress={() => navigation.navigate('Login')} style={styles.link}>Já tenho conta</Text>
        </View>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', paddingBottom: 50 },
  intro: { color: colors.cream, fontFamily: 'Poppins_400Regular', fontSize: 16, lineHeight: 25, textAlign: 'center', marginBottom: 28 },
  form: { backgroundColor: 'rgba(52,51,153,.28)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(237,231,219,.12)' },
  label: { color: colors.cream, fontFamily: 'Poppins_600SemiBold', fontSize: 13, marginBottom: 7, marginTop: 10 },
  input: { height: 52, borderRadius: 14, backgroundColor: 'rgba(255,255,255,.08)', borderWidth: 1, borderColor: 'rgba(237,231,219,.22)', color: colors.cream, fontFamily: 'Poppins_400Regular', paddingHorizontal: 15 },
  button: { marginTop: 24 },
  link: { color: colors.yellow, fontFamily: 'Poppins_600SemiBold', textAlign: 'center', marginTop: 18 },
});
