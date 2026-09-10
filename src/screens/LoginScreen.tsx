import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable>
        <Text style={styles.brand}>MONTENEGRO</Text>
        <Text style={styles.title}>ENTRAR</Text>
        <Text style={styles.subtitle}>Acesse sua conta para continuar explorando histórias brasileiras.</Text>

        <View style={styles.form}>
          <TextInput value={email} onChangeText={setEmail} placeholder="E-mail" placeholderTextColor="rgba(237,231,219,0.55)" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
          <TextInput value={password} onChangeText={setPassword} placeholder="Senha" placeholderTextColor="rgba(237,231,219,0.55)" secureTextEntry style={styles.input} />
          <Pressable onPress={() => navigation.replace('Explore')} style={({ pressed }) => [styles.button, pressed && { opacity: 0.75 }]}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate('Register')}><Text style={styles.helper}>Ainda não tem conta? <Text style={styles.link}>Cadastre-se</Text></Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.navy },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, width: '100%', maxWidth: 620, alignSelf: 'center' },
  back: { position: 'absolute', top: 16, left: 22, width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: 'rgba(237,231,219,.3)', alignItems: 'center', justifyContent: 'center' },
  backText: { color: colors.cream, fontSize: 34, lineHeight: 36, marginTop: -4 },
  brand: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 24, textAlign: 'center' },
  title: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 38, textAlign: 'center', marginTop: 10 },
  subtitle: { color: 'rgba(237,231,219,0.8)', fontFamily: 'Poppins_400Regular', fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 14 },
  form: { gap: 14, marginTop: 34 },
  input: { borderWidth: 1, borderColor: 'rgba(237,231,219,0.4)', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, color: colors.cream, fontFamily: 'Poppins_400Regular' },
  button: { backgroundColor: colors.green, borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  buttonText: { color: colors.white, fontFamily: 'Poppins_600SemiBold', fontSize: 17 },
  helper: { color: 'rgba(237,231,219,0.68)', fontFamily: 'Poppins_400Regular', fontSize: 12, textAlign: 'center', marginTop: 18 },
  link: { color: colors.yellow, fontFamily: 'Poppins_600SemiBold' },
});
