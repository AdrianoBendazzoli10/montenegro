import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { api, setAuthToken } from '../services/api';

const tickets = 'https://www.figma.com/api/mcp/asset/b69bb425-241c-4850-b62b-680743cc8f44.png';
const googleLogo = 'https://www.figma.com/api/mcp/asset/25fa262b-5476-46f3-a5a8-2e8d44044590.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 820;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'avaliador'>('avaliador');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.register({ name, email, password, role });
      setAuthToken(response.token);
      navigation.replace('Explore');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar sua conta.');
    } finally {
      setLoading(false);
    }
  }

  const form = (
    <View style={[styles.formSection, wide && styles.formSectionWide]}>
      <Text style={[styles.title, !wide && styles.titlePhone]}>Crie sua conta</Text>

      <Text style={styles.label}><Text style={styles.labelIcon}>♙</Text>  Nome completo</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Seu nome completo" placeholderTextColor="#747474" autoComplete="name" style={styles.input} />

      <Text style={styles.label}><Text style={styles.labelIcon}>♙</Text>  Email</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Seu email" placeholderTextColor="#747474" keyboardType="email-address" autoCapitalize="none" autoComplete="email" style={styles.input} />

      <Text style={styles.label}><Text style={styles.labelIcon}>⁕⁕⁕</Text>  Senha</Text>
      <TextInput value={password} onChangeText={setPassword} placeholder="Sua senha" placeholderTextColor="#747474" secureTextEntry autoComplete="password-new" style={styles.input} />

      <View style={styles.roleRow}>
        <Pressable onPress={() => setRole('admin')} style={({ pressed }) => [role === 'admin' ? styles.roleFilled : styles.roleOutline, pressed && styles.pressed]}>
          <Text style={role === 'admin' ? styles.roleFilledText : styles.roleOutlineText}>Administrador</Text>
        </Pressable>
        <Pressable onPress={() => setRole('avaliador')} style={({ pressed }) => [role === 'avaliador' ? styles.roleFilled : styles.roleOutline, pressed && styles.pressed]}>
          <Text style={role === 'avaliador' ? styles.roleFilledText : styles.roleOutlineText}>Avaliador</Text>
        </Pressable>
      </View>

      <Pressable style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}>
        <Image source={{ uri: googleLogo }} style={styles.googleLogo} />
        <Text style={styles.googleText}>Entrar com o Google</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable disabled={loading} onPress={handleRegister} style={({ pressed }) => [styles.primaryButton, (pressed || loading) && styles.pressed]}>
        <Text style={styles.primaryText}>{loading ? 'Criando conta...' : 'Criar conta'}</Text>
      </Pressable>
    </View>
  );

  const loginPanel = (
    <View style={[styles.loginPanel, wide && styles.loginPanelWide]}>
      <View style={styles.panelInner}>
        <Text style={[styles.panelTitle, !wide && styles.panelTitlePhone]}>Já possui uma{`\n`}conta?</Text>
        <Text style={styles.panelCopy}>Clique no botão e realize{`\n`}seu login!</Text>
        <Pressable onPress={() => navigation.navigate('Login')} style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}>
          <Text style={styles.outlineText}>Fazer login</Text>
        </Pressable>
        <Image source={{ uri: tickets }} style={[styles.tickets, !wide && styles.ticketsPhone]} resizeMode="contain" />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[styles.content, wide && styles.contentWide]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {wide ? loginPanel : form}
          {wide ? form : loginPanel}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flexGrow: 1, width: '100%', alignSelf: 'center' },
  contentWide: { maxWidth: 1440, minHeight: 720, flexDirection: 'row', alignItems: 'stretch' },
  loginPanel: { width: '100%', maxWidth: 560, alignSelf: 'center', backgroundColor: colors.purple, borderTopRightRadius: 54, borderBottomRightRadius: 54, minHeight: 430, paddingHorizontal: 34, paddingTop: 38, paddingBottom: 24 },
  loginPanelWide: { flex: .92, maxWidth: 'none', alignSelf: 'stretch', borderTopRightRadius: 72, borderBottomRightRadius: 72, minHeight: 720, justifyContent: 'center', paddingHorizontal: 50, paddingVertical: 70 },
  panelInner: { width: '100%', maxWidth: 520, alignSelf: 'center' },
  panelTitle: { color: '#FFFFFF', fontFamily: 'Poppins_600SemiBold', fontSize: 48, lineHeight: 62 },
  panelTitlePhone: { fontSize: 32, lineHeight: 40 },
  panelCopy: { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontSize: 18, lineHeight: 26, marginTop: 28 },
  outlineButton: { height: 54, borderWidth: 1, borderColor: '#FFFFFF', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 42 },
  outlineText: { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontSize: 16 },
  tickets: { width: 350, height: 240, alignSelf: 'center', marginTop: 28 },
  ticketsPhone: { width: 225, height: 155, marginTop: 14 },
  formSection: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 28, paddingTop: 42, paddingBottom: 38 },
  formSectionWide: { flex: 1.08, maxWidth: 'none', alignSelf: 'stretch', paddingHorizontal: 64, paddingTop: 70, paddingBottom: 58, justifyContent: 'center' },
  title: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 48, lineHeight: 58, marginBottom: 24 },
  titlePhone: { fontSize: 34, lineHeight: 42, marginBottom: 22 },
  label: { color: '#151515', fontFamily: 'Poppins_400Regular', fontSize: 20, lineHeight: 30, marginBottom: 10, marginTop: 10 },
  labelIcon: { color: colors.purple },
  input: { height: 60, borderWidth: 1, borderColor: '#001A38', borderRadius: 10, paddingHorizontal: 18, fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#001A38', backgroundColor: '#fff' },
  roleRow: { flexDirection: 'row', gap: 10, marginTop: 28 },
  roleOutline: { flex: 1, height: 52, borderWidth: 1, borderColor: colors.purple, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  roleOutlineText: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
  roleFilled: { flex: 1, height: 52, backgroundColor: colors.purple, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  roleFilledText: { color: '#fff', fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
  googleButton: { alignSelf: 'center', width: '72%', minWidth: 235, maxWidth: 402, height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EBEBEB', borderRadius: 10, marginTop: 30, gap: 12, paddingHorizontal: 18 },
  googleLogo: { width: 20, height: 20 },
  googleText: { color: '#252525', fontFamily: 'Poppins_400Regular', fontSize: 13 },
  error: { color: '#B00020', fontFamily: 'Poppins_400Regular', fontSize: 12, textAlign: 'center', marginTop: 18 },
  primaryButton: { width: '74%', minWidth: 240, maxWidth: 415, height: 52, backgroundColor: colors.purple, borderRadius: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 28 },
  primaryText: { color: '#fff', fontFamily: 'Poppins_600SemiBold', fontSize: 15 },
  pressed: { opacity: .72 },
});