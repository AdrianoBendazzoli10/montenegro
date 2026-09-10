import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export function LoginScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.brand}>MONTENEGRO</Text>
        <Text style={styles.title}>ENTRAR</Text>
        <Text style={styles.subtitle}>Acesse sua conta para continuar explorando histórias brasileiras.</Text>

        <View style={styles.form}>
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="rgba(237,231,219,0.55)"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="rgba(237,231,219,0.55)"
            secureTextEntry
            style={styles.input}
          />
          <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.75 }]}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>
        </View>

        <Text style={styles.helper}>Ainda não tem conta? Cadastro será conectado nas próximas telas do Figma.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.navy },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  brand: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 24, textAlign: 'center' },
  title: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 38, textAlign: 'center', marginTop: 10 },
  subtitle: { color: 'rgba(237,231,219,0.8)', fontFamily: 'Poppins_400Regular', fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 14 },
  form: { gap: 14, marginTop: 34 },
  input: { borderWidth: 1, borderColor: 'rgba(237,231,219,0.4)', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, color: colors.cream, fontFamily: 'Poppins_400Regular' },
  button: { backgroundColor: colors.green, borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  buttonText: { color: colors.white, fontFamily: 'Poppins_600SemiBold', fontSize: 17 },
  helper: { color: 'rgba(237,231,219,0.6)', fontFamily: 'Poppins_400Regular', fontSize: 12, textAlign: 'center', marginTop: 18 },
});
