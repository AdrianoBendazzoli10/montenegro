import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { api, setAuthToken } from '../services/api';

const googleLogo = 'https://www.figma.com/api/mcp/asset/92520425-56e5-41bc-ac23-5f7064c3bab9.png';
const tickets = 'https://www.figma.com/api/mcp/asset/5eb97a2c-7f18-4b92-aeb0-1c61a39fea4d.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
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
      const response = await api.register({ name: name.trim(), email: email.trim(), password, role });
      setAuthToken(response.token);
      navigation.replace('Explore');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar sua conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={wide ? [] : ['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[styles.content, wide && styles.contentWide]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[styles.loginPanel, wide && styles.loginPanelWide]}>
            <View style={styles.panelInner}>
              <Text style={[styles.panelTitle, wide && styles.panelTitleWide]}>Já possui uma{`\n`}conta?</Text>
              <Text style={styles.panelCopy}>Clique no botão e realize{`\n`}seu login!</Text>
              <Pressable onPress={() => navigation.navigate('Login')} style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}>
                <Text style={styles.outlineText}>Fazer login</Text>
              </Pressable>
              <Image source={{ uri: tickets }} style={[styles.tickets, wide && styles.ticketsWide]} resizeMode="contain" />
            </View>
          </View>

          <View style={[styles.formSide, wide && styles.formSideWide]}>
            <View style={styles.formInner}>
              <Text style={[styles.title, wide && styles.titleWide]}>Crie sua conta</Text>

              <Text style={styles.label}><Text style={styles.labelIcon}>♙</Text>  Nome completo</Text>
              <TextInput value={name} onChangeText={setName} placeholder="Seu nome completo" placeholderTextColor="#747474" style={styles.input} />

              <Text style={styles.label}><Text style={styles.labelIcon}>♙</Text>  Email</Text>
              <TextInput value={email} onChangeText={setEmail} placeholder="Seu email" placeholderTextColor="#747474" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} />

              <Text style={styles.label}><Text style={styles.labelIcon}>⁕⁕⁕</Text>  Senha</Text>
              <TextInput value={password} onChangeText={setPassword} placeholder="Sua senha" placeholderTextColor="#747474" secureTextEntry style={styles.input} />

              <View style={styles.roleRow}>
                <Pressable onPress={() => setRole('admin')} style={role === 'admin' ? styles.roleFilled : styles.roleOutline}>
                  <Text style={role === 'admin' ? styles.roleFilledText : styles.roleOutlineText}>Administrador</Text>
                </Pressable>
                <Pressable onPress={() => setRole('avaliador')} style={role === 'avaliador' ? styles.roleFilled : styles.roleOutline}>
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flexGrow: 1, backgroundColor: '#FFFFFF' },
  contentWide: { flexDirection: 'row', minHeight: 720 },
  loginPanel: { width: '100%', backgroundColor: colors.purple, borderBottomRightRadius: 58, borderBottomLeftRadius: 58, paddingHorizontal: 30, paddingVertical: 36, minHeight: 385 },
  loginPanelWide: { width: '45%', minHeight: 720, borderBottomLeftRadius: 0, borderTopRightRadius: 78, borderBottomRightRadius: 78, justifyContent: 'center' },
  panelInner: { width: '100%', maxWidth: 486, alignSelf: 'center' },
  panelTitle: { color: '#FFFFFF', fontFamily: 'Poppins_600SemiBold', fontSize: 34, lineHeight: 43 },
  panelTitleWide: { fontSize: 44, lineHeight: 56 },
  panelCopy: { color: '#FFFFFF', fontFamily: 'Roboto_300Light', fontSize: 19, lineHeight: 26, marginTop: 30 },
  outlineButton: { height: 46, borderWidth: 1, borderColor: '#FFFFFF', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 42 },
  outlineText: { color: '#FFFFFF', fontFamily: 'Roboto_400Regular', fontSize: 17 },
  tickets: { width: 190, height: 135, alignSelf: 'center', marginTop: 24 },
  ticketsWide: { width: 310, height: 250, marginTop: 30 },
  formSide: { width: '100%', paddingVertical: 30 },
  formSideWide: { width: '55%', minHeight: 720, justifyContent: 'center' },
  formInner: { width: '100%', maxWidth: 575, alignSelf: 'center', paddingHorizontal: 26 },
  title: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 34, lineHeight: 42, marginBottom: 24 },
  titleWide: { fontSize: 48, lineHeight: 60 },
  label: { color: '#111111', fontFamily: 'Roboto_300Light', fontSize: 21, marginBottom: 12, marginTop: 12 },
  labelIcon: { color: colors.purple },
  input: { height: 60, borderWidth: 1, borderColor: '#001A38', borderRadius: 10, paddingHorizontal: 18, fontFamily: 'Poppins_400Regular', fontSize: 15, color: '#001A38' },
  roleRow: { flexDirection: 'row', gap: 10, marginTop: 34 },
  roleOutline: { flex: 1, height: 53, borderWidth: 1, borderColor: colors.purple, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  roleOutlineText: { color: colors.purple, fontFamily: 'Roboto_500Medium', fontSize: 16 },
  roleFilled: { flex: 1, height: 53, backgroundColor: colors.purple, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  roleFilledText: { color: '#FFFFFF', fontFamily: 'Roboto_500Medium', fontSize: 16 },
  googleButton: { alignSelf: 'center', width: 402, maxWidth: '100%', height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EBEBEB', borderRadius: 10, marginTop: 30, gap: 12 },
  googleLogo: { width: 20, height: 20, resizeMode: 'contain' },
  googleText: { color: '#111111', fontFamily: 'Roboto_300Light', fontSize: 14 },
  error: { color: '#B00020', fontFamily: 'Poppins_400Regular', fontSize: 12, textAlign: 'center', marginTop: 18 },
  primaryButton: { width: 415, maxWidth: '100%', height: 53, alignSelf: 'center', backgroundColor: colors.purple, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 31 },
  primaryText: { color: '#FFFFFF', fontFamily: 'Roboto_500Medium', fontSize: 17 },
  pressed: { opacity: 0.72 },
});
