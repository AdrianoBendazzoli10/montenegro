import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

const popcorn = 'https://www.figma.com/api/mcp/asset/fb81cede-49e2-44ef-ab35-5c287b83600a.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.formSection}>
            <Text style={styles.title}>Faça seu login</Text>

            <Text style={styles.label}>♙  Email</Text>
            <TextInput placeholder="Seu email" placeholderTextColor="#747474" keyboardType="email-address" autoCapitalize="none" style={styles.input} />

            <Text style={styles.label}>⁕⁕⁕  Senha</Text>
            <TextInput placeholder="Sua senha" placeholderTextColor="#747474" secureTextEntry style={styles.input} />

            <View style={styles.rememberRow}>
              <View style={styles.checkbox} />
              <Text style={styles.rememberText}>Lembrar senha</Text>
            </View>

            <Pressable style={styles.forgotWrap}>
              <Text style={styles.forgot}>Esqueceu a senha?</Text>
            </Pressable>

            <Pressable style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}>
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.googleText}>Entrar com o Google</Text>
            </Pressable>

            <Pressable onPress={() => navigation.replace('Explore')} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Text style={styles.primaryText}>Entrar</Text>
            </Pressable>
          </View>

          <View style={styles.accountPanel}>
            <Text style={styles.panelTitle}>Ainda não tem{`\n`}uma conta?</Text>
            <Text style={styles.panelCopy}>Crie uma conta e faça{`\n`}suas avaliações!</Text>
            <Pressable onPress={() => navigation.navigate('Register')} style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}>
              <Text style={styles.outlineText}>Criar conta</Text>
            </Pressable>
            <Image source={{ uri: popcorn }} style={styles.popcorn} resizeMode="contain" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: '#E8E7E2' },
  content: { flexGrow: 1, paddingBottom: 24 },
  formSection: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 30, width: '100%', maxWidth: 480, alignSelf: 'center' },
  title: { color: colors.green, fontFamily: 'Poppins_600SemiBold', fontSize: 34, lineHeight: 42, marginBottom: 28 },
  label: { color: '#151515', fontFamily: 'Poppins_400Regular', fontSize: 17, marginBottom: 8, marginTop: 8 },
  input: { height: 52, borderWidth: 1, borderColor: '#001A38', borderRadius: 9, paddingHorizontal: 14, fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#001A38', backgroundColor: 'transparent' },
  rememberRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#001A38', borderRadius: 4, marginRight: 9 },
  rememberText: { color: '#2A2A2A', fontFamily: 'Poppins_400Regular', fontSize: 13 },
  forgotWrap: { alignSelf: 'center', marginTop: 24, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: colors.green },
  forgot: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 13 },
  googleButton: { alignSelf: 'center', minWidth: 235, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFEFEF', borderRadius: 8, marginTop: 40, gap: 12 },
  googleG: { fontFamily: 'Poppins_600SemiBold', color: '#4285F4', fontSize: 17 },
  googleText: { color: '#333', fontFamily: 'Poppins_400Regular', fontSize: 13 },
  primaryButton: { height: 48, backgroundColor: colors.green, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 42 },
  primaryText: { color: '#E8E7E2', fontFamily: 'Poppins_600SemiBold', fontSize: 15 },
  accountPanel: { width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: colors.green, borderTopLeftRadius: 54, borderBottomLeftRadius: 54, paddingHorizontal: 36, paddingTop: 36, paddingBottom: 22, minHeight: 385 },
  panelTitle: { color: '#EBEBEB', fontFamily: 'Poppins_600SemiBold', fontSize: 32, lineHeight: 39 },
  panelCopy: { color: '#EBEBEB', fontFamily: 'Poppins_400Regular', fontSize: 17, lineHeight: 23, marginTop: 24 },
  outlineButton: { height: 46, borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 30 },
  outlineText: { color: '#EBEBEB', fontFamily: 'Poppins_400Regular', fontSize: 15 },
  popcorn: { alignSelf: 'center', width: 170, height: 150, marginTop: 18 },
  pressed: { opacity: .72 },
});