import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { ScreenShell } from '../components/ScreenShell';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';

type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;
type EditProps = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export function ProfileScreen({ navigation }: ProfileProps) {
  return (
    <ScreenShell title="Perfil" onBack={() => navigation.goBack()}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>M</Text></View>
        <Text style={styles.name}>Mariana</Text>
        <Text style={styles.handle}>@mariana.leitora</Text>
        <Text style={styles.bio}>Apaixonada por cinema brasileiro, clássicos da literatura e histórias que ficam na cabeça.</Text>
        <View style={styles.stats}>
          <View style={styles.stat}><Text style={styles.statNumber}>24</Text><Text style={styles.statLabel}>avaliações</Text></View>
          <View style={styles.stat}><Text style={styles.statNumber}>18</Text><Text style={styles.statLabel}>na estante</Text></View>
          <View style={styles.stat}><Text style={styles.statNumber}>7</Text><Text style={styles.statLabel}>favoritos</Text></View>
        </View>
        <AppButton label="Editar perfil" variant="outline" onPress={() => navigation.navigate('EditProfile')} />
      </View>
      <View style={styles.menu}>
        <AppButton label="Minhas estantes" onPress={() => navigation.navigate('Shelves')} />
        <AppButton label="Cadastrar uma obra" variant="secondary" onPress={() => navigation.navigate('AddWork')} />
        <AppButton label="Voltar para explorar" variant="outline" onPress={() => navigation.navigate('Explore')} />
      </View>
    </ScreenShell>
  );
}

export function EditProfileScreen({ navigation }: EditProps) {
  const [name, setName] = useState('Mariana');
  const [user, setUser] = useState('mariana.leitora');
  const [bio, setBio] = useState('Apaixonada por histórias brasileiras.');
  return (
    <ScreenShell title="Editar perfil" onBack={() => navigation.goBack()}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>Usuário</Text>
        <TextInput style={styles.input} autoCapitalize="none" value={user} onChangeText={setUser} />
        <Text style={styles.label}>Bio</Text>
        <TextInput style={[styles.input, styles.bioInput]} multiline value={bio} onChangeText={setBio} />
        <AppButton label="Salvar alterações" onPress={() => navigation.goBack()} style={styles.save} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileCard: { alignItems: 'center', backgroundColor: 'rgba(52,51,153,.23)', borderRadius: 26, padding: 24, marginTop: 8 },
  avatar: { width: 92, height: 92, borderRadius: 46, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  avatarText: { color: colors.navy, fontFamily: 'Cinzel_700Bold', fontSize: 40 },
  name: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 26 },
  handle: { color: colors.yellow, fontFamily: 'Poppins_400Regular', fontSize: 12, marginTop: 3 },
  bio: { color: 'rgba(237,231,219,.75)', fontFamily: 'Poppins_400Regular', fontSize: 13, lineHeight: 21, textAlign: 'center', marginTop: 14 },
  stats: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginVertical: 24 },
  stat: { alignItems: 'center' },
  statNumber: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 22 },
  statLabel: { color: 'rgba(237,231,219,.65)', fontFamily: 'Poppins_400Regular', fontSize: 10, marginTop: 2 },
  menu: { gap: 12, marginTop: 20 },
  form: { backgroundColor: 'rgba(52,51,153,.22)', borderRadius: 24, padding: 20, marginTop: 8 },
  label: { color: colors.cream, fontFamily: 'Poppins_600SemiBold', fontSize: 13, marginBottom: 7, marginTop: 12 },
  input: { minHeight: 50, backgroundColor: 'rgba(255,255,255,.08)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(237,231,219,.2)', paddingHorizontal: 14, color: colors.cream, fontFamily: 'Poppins_400Regular' },
  bioInput: { minHeight: 110, paddingTop: 13, textAlignVertical: 'top' },
  save: { marginTop: 25 },
});
