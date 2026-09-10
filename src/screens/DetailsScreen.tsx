import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { getMediaById } from '../data/media';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({ navigation, route }: Props) {
  const item = getMediaById(route.params.id);
  const noun = item.kind === 'livro' ? 'livro' : item.kind === 'filme' ? 'filme' : 'série';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></Pressable>
          <Text style={styles.brand}>MONTENEGRO</Text>
          <Pressable onPress={() => navigation.navigate('Profile')}><Text style={styles.profileDot}>●</Text></Pressable>
        </View>

        <View style={styles.heroCard}>
          <Image source={{ uri: item.image }} style={styles.cover} resizeMode="cover" />
          <View style={styles.heroInfo}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.stars}>★★★★★  <Text style={styles.score}>{item.rating.toFixed(1)}</Text></Text>
            <Text style={styles.meta}>{item.kind === 'livro' ? 'Autor' : 'Criador'}: {item.creator}</Text>
            <Text style={styles.meta}>Ano: {item.year}</Text>
            <Pressable onPress={() => navigation.navigate('QuickReview', { id: item.id })} style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Quero avaliar esse {noun}!  ◉</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Sinopse</Text>
        <View style={styles.synopsisBox}><Text style={styles.synopsis}>{item.description}</Text></View>

        <Text style={styles.sectionTitle}>Avaliações rápidas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
          {['Byanca Lourenço', 'Ana Clara Rivas'].map((name, index) => (
            <View key={name} style={styles.quickCard}>
              <View style={styles.userRow}><View style={styles.avatar} /><View><Text style={styles.userName}>{name}</Text><Text style={styles.date}>{index ? '21/09/25' : '12/10/25'}</Text></View></View>
              <Text style={styles.smallStars}>★★★★★</Text>
              <Text style={styles.reviewText}>“Lorem Ipsum is simply dummy text of the printing and typesetting industry.”</Text>
              <Text style={styles.worth}>Valeu a pena?   {index ? '☟ Mais ou menos' : '☝ Sim'}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Avaliações detalhadas</Text>
        {[['Gabriely Santos', 'Me adotou emocionalmente', 'Culpada de ser incrível'], ['Beatriz Krisan', 'Tentei, mas dormi', 'Condenada por perda de tempo']].map(([name, emotion, verdict], index) => (
          <View key={name} style={styles.detailedCard}>
            <View style={styles.userRow}><View style={styles.avatar} /><View><Text style={styles.userName}>{name}</Text><Text style={styles.date}>{index ? '22/09/25' : '03/09/25'}</Text></View></View>
            <Text style={styles.smallStars}>{index ? '★★★☆☆' : '★★★★★'}</Text>
            <Text style={styles.reviewText}>“Lorem Ipsum is simply dummy text of the printing and typesetting industry.”</Text>
            <Text style={styles.detailLabel}>Emoção: <Text style={styles.detailValue}>“{emotion}”</Text></Text>
            <Text style={styles.detailLabel}>Critérios:</Text>
            <Text style={styles.criteria}>Enredo                 {index ? 4 : 9}{`\n`}Personagens          {index ? 6 : 8}{`\n`}Fluidez da leitura   {index ? 2 : 10}{`\n`}Ambientação         {index ? 8 : 9}{`\n`}Originalidade       {index ? 5 : 7}</Text>
            <View style={styles.verdictBox}><Text style={styles.verdictTitle}>Veredito final</Text><Text style={styles.gavel}>⚒</Text><Text style={styles.verdictText}>{verdict}</Text></View>
            <Text style={styles.worth}>Valeu a pena?   {index ? '☟ Não' : '☝ Sim'}</Text>
          </View>
        ))}

        <Pressable onPress={() => navigation.navigate('DetailedReview', { id: item.id })}><Text style={styles.more}>Mostrar mais</Text></Pressable>
        <View style={styles.footer}><Text style={styles.footerBrand}>MONTENEGRO</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  page: { paddingBottom: 0 },
  header: { marginHorizontal: 18, marginTop: 8, height: 54, backgroundColor: colors.purple, borderRadius: 999, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { color: '#fff', fontSize: 34, lineHeight: 36 },
  brand: { color: '#fff', fontFamily: 'Cinzel_700Bold', fontSize: 19 },
  profileDot: { color: '#fff', fontSize: 16 },
  heroCard: { marginHorizontal: 18, marginTop: 30, backgroundColor: '#1B836D', borderRadius: 18, padding: 18, flexDirection: 'row', gap: 16 },
  cover: { width: 118, height: 170, borderRadius: 12, backgroundColor: '#eee' },
  heroInfo: { flex: 1, justifyContent: 'center' },
  title: { color: '#fff', fontFamily: 'Poppins_600SemiBold', fontSize: 20, lineHeight: 26 },
  stars: { color: '#FFD326', fontSize: 15, marginTop: 7 },
  score: { color: '#fff', fontFamily: 'Poppins_400Regular', fontSize: 11 },
  meta: { color: '#fff', fontFamily: 'Poppins_400Regular', fontSize: 11, lineHeight: 17, marginTop: 2 },
  heroButton: { borderWidth: 1.2, borderColor: '#fff', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, marginTop: 14, alignSelf: 'flex-start' },
  heroButtonText: { color: '#fff', fontFamily: 'Poppins_600SemiBold', fontSize: 9.5 },
  sectionTitle: { color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 23, textAlign: 'center', marginTop: 34, marginBottom: 20 },
  synopsisBox: { marginHorizontal: 28, borderLeftWidth: 1, borderLeftColor: '#001A38', paddingLeft: 16, minHeight: 110, justifyContent: 'center' },
  synopsis: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 13, lineHeight: 21 },
  quickRow: { paddingHorizontal: 18, gap: 12 },
  quickCard: { width: 270, backgroundColor: 'rgba(238,203,63,.83)', borderRadius: 14, padding: 15 },
  detailedCard: { marginHorizontal: 18, marginBottom: 16, backgroundColor: 'rgba(238,203,63,.83)', borderRadius: 14, padding: 16 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#001A38' },
  userName: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
  date: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 8 },
  smallStars: { color: colors.green, fontSize: 13, letterSpacing: 1, marginTop: 8 },
  reviewText: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 10, lineHeight: 15, marginTop: 10 },
  worth: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 9.5, marginTop: 16 },
  detailLabel: { color: '#26364E', fontFamily: 'Poppins_600SemiBold', fontSize: 11, marginTop: 10 },
  detailValue: { fontFamily: 'Poppins_400Regular' },
  criteria: { color: '#001A38', fontFamily: 'Poppins_400Regular', fontSize: 10, lineHeight: 15, marginTop: 6 },
  verdictBox: { marginTop: 14, backgroundColor: colors.purple, borderRadius: 12, padding: 12, alignItems: 'center' },
  verdictTitle: { color: '#ECE7DB', fontFamily: 'Poppins_600SemiBold', fontSize: 11 },
  gavel: { color: '#fff', fontSize: 22, marginVertical: 6 },
  verdictText: { color: '#ECE7DB', fontFamily: 'Poppins_600SemiBold', fontSize: 10, textAlign: 'center' },
  more: { color: '#001A38', fontFamily: 'Poppins_600SemiBold', fontSize: 11, textAlign: 'center', textDecorationLine: 'underline', marginVertical: 30 },
  footer: { backgroundColor: colors.purple, paddingVertical: 34 },
  footerBrand: { color: '#FFDD56', fontFamily: 'Cinzel_700Bold', fontSize: 24, textAlign: 'center' },
});