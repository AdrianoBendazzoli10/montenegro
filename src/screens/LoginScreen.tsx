import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { api, setAuthToken } from '../services/api';

const popcorn = 'https://www.figma.com/api/mcp/asset/685d810f-c7da-4b82-b412-33526501a05f.png';
const googleLogo = 'https://www.figma.com/api/mcp/asset/31be114a-36c3-476c-ab0c-7504dfe1b156.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 820;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    if (!email.trim() || !password) {
      setError('Preencha seu e-mail e sua senha.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.login({ email, password });
      setAuthToken(response.token);
      navigation.replace('Explore');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.content, wide && styles.contentWide]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.formSection, wide && styles.formSectionWide]}>
            <Text style={[styles.title, !wide && styles.titlePhone]}>Faça seu login</Text>

            <Text style={styles.label}><Text style={styles.labelIcon}>♙</Text>  Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Seu email"
              placeholderTextColor="#747474"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
            />

            <Text style={styles.label}><Text style={styles.labelIcon}>⁕⁕⁕</Text>  Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Sua senha"
              placeholderTextColor="#747474"
              secureTextEntry
              autoComplete="password"
              style={styles.input}
            />

            <Pressable onPress={() => setRemember((value) => !value)} style={styles.rememberRow} hitSlop={8}>
              <View style={[styles.checkbox, remember && styles.checkboxChecked]}>{remember ? <Text style={styles.check}>✓</Text> : null}</View>
              <Text style={styles.rememberText}>Lembrar senha</Text>
            </Pressable>

            <Pressable style={styles.forgotWrap}>
              <Text style={styles.forgot}>Esqueceu a senha?</Text>
            </Pressable>

            <Pressable style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}>
              <Image source={{ uri: googleLogo }} style={styles.googleLogo} />
              <Text style={styles.googleText}>Entrar com o Google</Text>
            </Pressable>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable disabled={loading} onPress={handleLogin} style={({ pressed }) => [styles.primaryButton, (pressed || loading) && styles.pressed]}>
              <Text style={styles.primaryText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
            </Pressable>
          </View>

          <View style={[styles.accountPanel, wide && styles.accountPanelWide]}>
            <View style={styles.panelInner}>
              <Text style={[styles.panelTitle, !wide && styles.panelTitlePhone]}>Ainda não tem{`\n`}uma conta?</Text>
              <Text style={styles.panelCopy}>Crie uma conta e faça{`\n`}suas avaliações!</Text>
              <Pressable onPress={() => navigation.navigate('Register')} style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}>
                <Text style={styles.outlineText}>Criar conta</Text>
              </Pressable>
              <Image source={{ uri: popcorn }} style={[styles.popcorn, !wide && styles.popcornPhone]} resizeMode="contain" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: '#E8E7E2' },
  content: { flexGrow: 1, width: '100%', alignSelf: 'center' },
  contentWide: { maxWidth: 1440, minHeight: 720, flexDirection: 'row', alignItems: 'stretch' },
  formSection: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 28, paddingTop: 42, paddingBottom: 38 },
  formSectionWide: { flex: 1, maxWidth: 'none', alignSelf: 'stretch', paddingHorizontal: 50, paddingTop: 104, paddingBottom: 84, justifyContent: 'center' },
  title: { color: colors.green, fontFamily: 'Poppins_600SemiBold', fontSize: 48, lineHeight: 58, marginBottom: 30 },
  titlePhone: { fontSize: 34, lineHeight: 42, marginBottom: 26 },
  label: { color: '#151515', fontFamily: 'Poppins_400Regular', fontSize: 20, lineHeight: 30, marginBottom: 10, marginTop: 12 },
  labelIcon: { color: colors.green },
  input: { height: 60, borderWidth: 1, borderColor: '#001A38', borderRadius: 10, paddingHorizontal: 18, fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#001A38', backgroundColor: 'transparent' },
  rememberRow: { flexDirection: 'row', alignItems: 'center', marginTop: 26, alignSelf: 'flex-start' },
  checkbox: { width: 22, height: 22, borderWidth: 1, borderColor: '#001A38', borderRadius: 5, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.green, borderColor: colors.green },
  check: { color: '#fff', fontSize: 14, lineHeight: 16 },
  rememberText: { color: '#2A2A2A', fontFamily: 'Poppins_400Regular', fontSize: 13 },
  forgotWrap: { alignSelf: 'center', marginTop: 30, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: colors.green },
  forgot: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 14 },
  googleButton: { alignSelf: 'center', minWidth: 235, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EBEBEB', borderRadius: 10, marginTop: 54, gap: 12, paddingHorizontal: 18 },
  googleLogo: { width: 20, height: 20 },
  googleText: { color: '#252525', fontFamily: 'Poppins_400Regular', fontSize: 13 },
  error: { color: '#B00020', fontFamily: 'Poppins_400Regular', fontSize: 12, textAlign: 'center', marginTop: 18 },
  primaryButton: { width: '64%', minWidth: 240, maxWidth: 337, height: 52, backgroundColor: colors.green, borderRadius: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 46 },
  primaryText: { color: '#E8E7E2', fontFamily: 'Poppins_600SemiBold', fontSize: 15 },
  accountPanel: { width: '100%', maxWidth: 560, alignSelf: 'center', backgroundColor: colors.green, borderTopLeftRadius: 54, borderBottomLeftRadius: 54, minHeight: 430, paddingHorizontal: 36, paddingTop: 38, paddingBottom: 24 },
  accountPanelWide: { flex: 1.08, maxWidth: 'none', alignSelf: 'stretch', borderTopLeftRadius: 72, borderBottomLeftRadius: 72, minHeight: 720, justifyContent: 'center', paddingHorizontal: 70, paddingVertical: 70 },
  panelInner: { width: '100%', maxWidth: 520, alignSelf: 'center' },
  panelTitle: { color: '#EBEBEB', fontFamily: 'Poppins_600SemiBold', fontSize: 48, lineHeight: 62 },
  panelTitlePhone: { fontSize: 32, lineHeight: 40 },
  panelCopy: { color: '#EBEBEB', fontFamily: 'Poppins_400Regular', fontSize: 18, lineHeight: 26, marginTop: 28 },
  outlineButton: { height: 54, borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 42 },
  outlineText: { color: '#EBEBEB', fontFamily: 'Poppins_400Regular', fontSize: 16 },
  popcorn: { alignSelf: 'center', width: 280, height: 260, marginTop: 22 },
  popcornPhone: { width: 190, height: 180, marginTop: 12 },
  pressed: { opacity: .72 },
});