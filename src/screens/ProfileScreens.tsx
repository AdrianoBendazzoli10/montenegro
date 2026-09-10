import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

const profileImage = 'https://www.figma.com/api/mcp/asset/c7b9e6eb-979a-4652-bbe6-2aa3364a9977.png';

type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;
type EditProps = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

function MobileHeader({ navigation }: { navigation: ProfileProps['navigation'] | EditProps['navigation'] }) {
  return (
    <View style={styles.header}>
      <Text style={styles.brand}>MONTENEGRO</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navRow}>
        <Pressable onPress={() => navigation.navigate('Catalog', { kind: 'livro' })}><Text style={styles.navText}>Obras</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('Shelves')}><Text style={styles.navText}>Estantes</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('QuickReview', { id: 'jantar-secreto' })}><Text style={styles.navText}>Avaliações</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('AddWork')}><Text style={styles.navText}>Cadastrar obras</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('Profile')}><Text style={styles.navText}>Perfil</Text></Pressable>
      </ScrollView>
    </View>
  );
}

const reviews = Array.from({ length: 6 }, (_, index) => ({ id: String(index + 1) }));

export function ProfileScreen({ navigation }: ProfileProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <MobileHeader navigation={navigation} />
        <Text style={styles.pageTitle}>PERFIL</Text>

        <View style={styles.identity}>
          <Image source={{ uri: profileImage }} style={styles.avatarImage} resizeMode="cover" />
          <View style={styles.identityInfo}>
            <Text style={styles.name}>Gabriely Santos</Text>
            <Text style={styles.count}>13 avaliações</Text>
          </View>
        </View>
        <Text style={styles.joined}>Entrou em 20/10/2025</Text>
        <Pressable onPress={() => navigation.navigate('EditProfile')} style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </Pressable>

        <View style={styles.reviewList}>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.smallAvatar} />
                <View style={styles.reviewUserText}>
                  <Text style={styles.reviewName}>Vitória Souza</Text>
                  <Text style={styles.reviewWork}>Livro: Fazendo meu filme</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <Text style={styles.stars}>★★★★★</Text>
              <Text style={styles.reviewCopy}>É uma obra simples e encantadora, mas cheia de significados profundos. A narrativa é leve, porém convida o leitor a refletir sobre temas como amizade, amor e a essência das pessoas.</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Desenvolvedores:{`\n`}Ana Clara Rivas{`\n`}Beatriz Krisan{`\n`}Byanca Lourenço{`\n`}Gabriely Santos</Text>
          <Text style={styles.footerText}>Filme{`\n`}Série{`\n`}Livro{`\n`}Destaques{`\n`}Cadastrar obras</Text>
          <Text style={styles.footerBrand}>🎬🎟️🇧🇷{`\n`}MONTENEGRO</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function EditProfileScreen({ navigation }: EditProps) {
  const [name, setName] = useState('Gabriely Santos');
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.editPage} keyboardShouldPersistTaps="handled">
        <MobileHeader navigation={navigation} />
        <Text style={styles.pageTitle}>PERFIL</Text>

        <Image source={{ uri: profileImage }} style={styles.editAvatar} resizeMode="cover" />
        <Pressable><Text style={styles.changePhoto}>Alterar foto</Text></Pressable>

        <TextInput value={name} onChangeText={setName} style={styles.nameInput} placeholder="Seu nome" placeholderTextColor="#6E7480" />
        <Pressable onPress={() => navigation.goBack()} style={styles.saveButton}>
          <Text style={styles.saveText}>Salvar alterações</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  page: { paddingBottom: 0 },
  editPage: { flexGrow: 1, paddingBottom: 50 },
  header: { marginHorizontal: 18, marginTop: 8, backgroundColor: colors.purple, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 11 },
  brand: { color: '#fff', fontFamily: 'Cinzel_700Bold', fontSize: 20, textAlign: 'center' },
  navRow: { gap: 22, alignItems: 'center', paddingTop: 9, paddingHorizontal: 2 },
  navText: { color: '#fff', fontFamily: 'Poppins_400Regular', fontSize: 12 },
  pageTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 31, textAlign: 'center', marginTop: 30 },
  identity: { marginTop: 34, paddingHorizontal: 26, flexDirection: 'row', alignItems: 'center' },
  avatarImage: { width: 94, height: 94, borderRadius: 47, backgroundColor: '#D5D6DA' },
  identityInfo: { flex: 1, marginLeft: 18 },
  name: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 25, lineHeight: 31 },
  count: { color: '#111', fontFamily: 'Poppins_400Regular', fontSize: 14, marginTop: 2 },
  joined: { color: '#111', fontFamily: 'Poppins_400Regular', fontSize: 14, marginHorizontal: 27, marginTop: 24 },
  editButton: { alignSelf: 'flex-end', marginHorizontal: 26, marginTop: 20, borderWidth: 1.5, borderColor: colors.purple, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 8 },
  editButtonText: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  reviewList: { paddingHorizontal: 18, marginTop: 38, gap: 14 },
  reviewCard: { backgroundColor: 'rgba(238,203,63,.83)', borderRadius: 14, padding: 15 },
  reviewTop: { flexDirection: 'row', alignItems: 'center' },
  smallAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#001A38' },
  reviewUserText: { marginLeft: 9, flex: 1 },
  reviewName: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 13 },
  reviewWork: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 9 },
  divider: { height: 1, backgroundColor: colors.green, marginTop: 8 },
  stars: { color: colors.green, fontSize: 15, letterSpacing: 1, marginTop: 7 },
  reviewCopy: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 10, lineHeight: 15, marginTop: 4 },
  footer: { marginTop: 48, backgroundColor: colors.purple, paddingHorizontal: 22, paddingTop: 30, paddingBottom: 38, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 18 },
  footerText: { color: '#fff', fontFamily: 'Poppins_400Regular', fontSize: 11, lineHeight: 17 },
  footerBrand: { width: '100%', color: '#FFDD56', fontFamily: 'Cinzel_700Bold', fontSize: 22, textAlign: 'center', marginTop: 10 },
  editAvatar: { width: 116, height: 116, borderRadius: 58, alignSelf: 'center', marginTop: 30, backgroundColor: '#D5D6DA' },
  changePhoto: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 15, textAlign: 'center', marginTop: 12 },
  nameInput: { marginHorizontal: 28, height: 52, borderWidth: 1.5, borderColor: '#001A38', borderRadius: 999, marginTop: 34, paddingHorizontal: 16, color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 15 },
  saveButton: { alignSelf: 'center', borderWidth: 1.5, borderColor: '#001A38', borderRadius: 999, paddingHorizontal: 18, paddingVertical: 9, marginTop: 24 },
  saveText: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
});