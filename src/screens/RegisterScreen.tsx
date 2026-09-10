import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

const tickets = 'https://www.figma.com/api/mcp/asset/73231595-3eec-4311-9129-0088e6b375ed.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.loginPanel}>
            <Text style={styles.panelTitle}>Já possui uma{`\n`}conta?</Text>
            <Text style={styles.panelCopy}>Clique no botão e realize{`\n`}seu login!</Text>
            <Pressable onPress={() => navigation.navigate('Login')} style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}>
              <Text style={styles.outlineText}>Fazer login</Text>
            </Pressable>
            <Image source={{ uri: tickets }} style={styles.tickets} resizeMode="contain" />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.title}>Crie sua conta</Text>

            <Text style={styles.label}>♙  Nome completo</Text>
            <TextInput placeholder="Seu nome completo" placeholderTextColor="#747474" style={styles.input} />

            <Text style={styles.label}>♙  Email</Text>
            <TextInput placeholder="Seu email" placeholderTextColor="#747474" keyboardType="email-address" autoCapitalize="none" style={styles.input} />

            <Text style={styles.label}>⁕⁕⁕  Senha</Text>
            <TextInput placeholder="Sua senha" placeholderTextColor="#747474" secureTextEntry style={styles.input} />

            <View style={styles.roleRow}>
              <Pressable style={styles.roleOutline}><Text style={styles.roleOutlineText}>Administrador</Text></Pressable>
              <Pressable style={styles.roleFilled}><Text style={styles.roleFilledText}>Avaliador</Text></Pressable>
            </View>

            <Pressable style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}>
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.googleText}>Entrar com o Google</Text>
            </Pressable>

            <Pressable onPress={() => navigation.replace('Explore')} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Text style={styles.primaryText}>Criar conta</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flexGrow: 1, paddingBottom: 24 },
  loginPanel: { width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: '#3A36A6', borderBottomRightRadius: 54, paddingHorizontal: 30, paddingTop: 34, paddingBottom: 20, minHeight: 320 },
  panelTitle: { color: '#FFFFFF', fontFamily: 'Poppins_600SemiBold', fontSize: 31, lineHeight: 38 },
  panelCopy: { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontSize: 17, lineHeight: 23, marginTop: 22 },
  outlineButton: { height: 46, borderWidth: 1, borderColor: '#FFFFFF', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 26 },
  outlineText: { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontSize: 15 },
  tickets: { width: 175, height: 115, alignSelf: 'center', marginTop: 12 },
  formSection: { paddingHorizontal: 24, paddingTop: 30, paddingBottom: 30, width: '100%', maxWidth: 480, alignSelf: 'center' },
  title: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 34, lineHeight: 42, marginBottom: 24 },
  label: { color: '#151515', fontFamily: 'Poppins_400Regular', fontSize: 17, marginBottom: 8, marginTop: 8 },
  input: { height: 52, borderWidth: 1, borderColor: '#001A38', borderRadius: 9, paddingHorizontal: 14, fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#001A38' },
  roleRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  roleOutline: { flex: 1, height: 46, borderWidth: 1, borderColor: colors.purple, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  roleOutlineText: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  roleFilled: { flex: 1, height: 46, backgroundColor: colors.purple, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  roleFilledText: { color: '#fff', fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  googleButton: { alignSelf: 'center', minWidth: 235, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFEFEF', borderRadius: 8, marginTop: 30, gap: 12 },
  googleG: { fontFamily: 'Poppins_600SemiBold', color: '#4285F4', fontSize: 17 },
  googleText: { color: '#333', fontFamily: 'Poppins_400Regular', fontSize: 13 },
  primaryButton: { height: 48, backgroundColor: colors.purple, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 28 },
  primaryText: { color: '#fff', fontFamily: 'Poppins_600SemiBold', fontSize: 15 },
  pressed: { opacity: .72 },
});