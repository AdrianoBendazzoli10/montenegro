import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { api, setAuthToken } from '../services/api';

const googleLogo = 'https://www.figma.com/api/mcp/asset/21325afe-aeb8-4616-a6f4-ff119e1f48b6.png';
const popcorn = 'https://www.figma.com/api/mcp/asset/14eae57f-a289-427f-b08a-db5e7a70bd16.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
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
      const response = await api.login({ email: email.trim(), password });
      setAuthToken(response.token);
      navigation.replace('Explore');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={wide ? [] : ['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.content, wide && styles.contentWide]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.formSide, wide && styles.formSideWide]}>
            <View style={[styles.formInner, wide && styles.formInnerWide]}>
              <Text style={[styles.title, wide && styles.titleWide]}>Faça seu login</Text>

              <Text style={styles.label}><Text style={styles.labelIcon}>♙</Text>  Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Seu email"
                placeholderTextColor="#747474"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />

              <Text style={styles.label}><Text style={styles.labelIcon}>⁕⁕⁕</Text>  Senha</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Sua senha"
                placeholderTextColor="#747474"
                secureTextEntry
                style={styles.input}
              />

              <Pressable onPress={() => setRemember((value) => !value)} style={styles.rememberRow}>
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
          </View>

          <View style={[styles.accountPanel, wide && styles.accountPanelWide]}>
            <View style={[styles.panelInner, wide && styles.panelInnerWide]}>
              <Text style={[styles.panelTitle, wide && styles.panelTitleWide]}>Ainda não tem{`\n`}uma conta?</Text>
              <Text style={[styles.panelCopy, wide && styles.panelCopyWide]}>Crie uma conta e faça{`\n`}suas avaliações!</Text>
              <Pressable onPress={() => navigation.navigate('Register')} style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}>
                <Text style={styles.outlineText}>Criar conta</Text>
              </Pressable>
              <Image source={{ uri: popcorn }} style={[styles.popcorn, wide && styles.popcornWide]} resizeMode="contain" />
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
  content: { flexGrow: 1, backgroundColor: '#E8E7E2' },
  contentWide: { flexDirection: 'row', minHeight: 720 },
  formSide: { width: '100%', paddingVertical: 30 },
  formSideWide: { width: '49%', minHeight: 720, justifyContent: 'center' },
  formInner: { width: '100%', maxWidth: 575, alignSelf: 'center', paddingHorizontal: 26 },
  formInnerWide: { paddingHorizontal: 0, maxWidth: 575 },
  title: { color: colors.green, fontFamily: 'Poppins_600SemiBold', fontSize: 34, lineHeight: 42, marginBottom: 28 },
  titleWide: { fontSize: 48, lineHeight: 60, marginBottom: 28 },
  label: { color: '#111111', fontFamily: 'Roboto_300Light', fontSize: 21, marginBottom: 12, marginTop: 12 },
  labelIcon: { color: colors.green },
  input: { height: 60, borderWidth: 1, borderColor: '#001A38', borderRadius: 10, paddingHorizontal: 18, fontFamily: 'Poppins_400Regular', fontSize: 15, color: '#001A38', backgroundColor: 'transparent' },
  rememberRow: { flexDirection: 'row', alignItems: 'center', marginTop: 26, alignSelf: 'flex-start' },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#001A38', borderRadius: 4, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.green, borderColor: colors.green },
  check: { color: '#FFFFFF', fontSize: 13, lineHeight: 16 },
  rememberText: { color: '#222222', fontFamily: 'Roboto_300Light', fontSize: 14 },
  forgotWrap: { alignSelf: 'center', marginTop: 31, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: colors.green },
  forgot: { color: '#001A38', fontFamily: 'Roboto_300Light', fontSize: 14 },
  googleButton: { alignSelf: 'center', width: 291, maxWidth: '100%', height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EBEBEB', borderRadius: 10, marginTop: 50, gap: 12 },
  googleLogo: { width: 20, height: 20, resizeMode: 'contain' },
  googleText: { color: '#111111', fontFamily: 'Roboto_300Light', fontSize: 14 },
  error: { color: '#B00020', fontFamily: 'Poppins_400Regular', fontSize: 12, textAlign: 'center', marginTop: 18 },
  primaryButton: { width: 337, maxWidth: '100%', height: 48, alignSelf: 'center', backgroundColor: colors.green, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 48 },
  primaryText: { color: '#E8E7E2', fontFamily: 'Roboto_500Medium', fontSize: 15 },
  accountPanel: { width: '100%', backgroundColor: colors.green, borderTopLeftRadius: 56, borderTopRightRadius: 56, paddingHorizontal: 30, paddingVertical: 38, minHeight: 430 },
  accountPanelWide: { width: '51%', minHeight: 720, borderTopRightRadius: 0, borderBottomLeftRadius: 78, borderTopLeftRadius: 78, justifyContent: 'center' },
  panelInner: { width: '100%', maxWidth: 520, alignSelf: 'center' },
  panelInnerWide: { maxWidth: 486 },
  panelTitle: { color: '#EBEBEB', fontFamily: 'Poppins_600SemiBold', fontSize: 34, lineHeight: 42 },
  panelTitleWide: { fontSize: 44, lineHeight: 54 },
  panelCopy: { color: '#EBEBEB', fontFamily: 'Roboto_300Light', fontSize: 19, lineHeight: 25, marginTop: 26 },
  panelCopyWide: { fontSize: 21, lineHeight: 26 },
  outlineButton: { height: 46, borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 42 },
  outlineText: { color: '#EBEBEB', fontFamily: 'Roboto_400Regular', fontSize: 17 },
  popcorn: { alignSelf: 'center', width: 185, height: 185, marginTop: 26 },
  popcornWide: { width: 260, height: 235, marginTop: 28 },
  pressed: { opacity: 0.72 },
});
