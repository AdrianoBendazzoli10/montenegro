import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MediaKind, RootStackParamList } from '@/navigation/types';
import { api } from '@/services/api';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'AddWork'>;

const typeLabels: Record<MediaKind, string> = {
  livro: 'Livro',
  filme: 'Filme',
  serie: 'Série',
};

const typeDescriptions: Record<MediaKind, string> = {
  livro: 'Cadastre livros para encontrar, avaliar e guardar nas suas estantes.',
  filme: 'Adicione filmes que você ama e compartilhe suas avaliações.',
  serie: 'Registre suas séries favoritas e acompanhe suas descobertas.',
};

const typeSymbols: Record<MediaKind, string> = {
  livro: '♡',
  filme: '✦',
  serie: '◌',
};

export function AddWorkScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;

  const [kind, setKind] = useState<MediaKind | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [creator, setCreator] = useState('');
  const [publisher, setPublisher] = useState('');
  const [genre, setGenre] = useState('');
  const [synopsis, setSynopsis] = useState('');

  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    name: string;
    mimeType?: string;
    webFile?: any;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const creatorLabel =
    kind === 'livro'
      ? 'Autor'
      : kind === 'filme'
        ? 'Diretor'
        : 'Criador';

  const nameLabel =
    kind === 'livro'
      ? 'Nome do livro'
      : kind === 'filme'
        ? 'Nome do filme'
        : 'Nome da série';

  async function handlePickImage() {
    try {
      setMessage('');

      const result =
        await DocumentPicker.getDocumentAsync({
          type: 'image/*',
          copyToCacheDirectory: true,
          multiple: false,
        });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];

      setSelectedImage({
        uri: file.uri,
        name: file.name || 'capa.jpg',
        mimeType:
          file.mimeType || 'image/jpeg',
        webFile: (file as any).file,
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível selecionar a imagem.',
      );
    }
  }

  async function handleSubmit() {
    if (!kind) return;

    setMessage('');

    if (!title.trim() || !creator.trim()) {
      setMessage('Preencha o nome da obra e o autor/diretor.');
      return;
    }

    // transforma o campo de data em um formato aceito pela API
    let releaseDate: string | null = null;

    const cleanDate = date.trim();

    if (cleanDate) {
      // se a pessoa digitou somente o ano, mantém como ano
      if (/^\d{4}$/.test(cleanDate)) {
        releaseDate = `${cleanDate}-01-01`;
      }

      // se digitou uma data completa, usa somente a parte da data
      else if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
        releaseDate = cleanDate;
      }

      // se veio com horário, remove o horário
      else if (cleanDate.includes('T')) {
        const onlyDate = cleanDate.split('T')[0];

        if (/^\d{4}-\d{2}-\d{2}$/.test(onlyDate)) {
          releaseDate = onlyDate;
        }
      }
    }

    try {
      setLoading(true);

      let imageUrl: string | null = null;

      // envia a capa primeiro
      if (selectedImage) {
        const upload = await api.uploadWorkCover({
          uri: selectedImage.uri,
          name: selectedImage.name,
          mimeType: selectedImage.mimeType,
          webFile: selectedImage.webFile,
        });

        imageUrl = upload.image_url;
      }

      // cria a obra
      const response = await api.createWork({
        title: title.trim(),
        kind,
        creator: creator.trim(),
        publisher: publisher.trim() || null,
        release_date: releaseDate,
        genre: genre.trim() || null,
        synopsis: synopsis.trim() || null,
        image_url: imageUrl,
      });

      navigation.replace('Details', {
        id: String(response.work.id),
      });
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : 'Não foi possível cadastrar a obra.',
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
        keyboardShouldPersistTaps="handled"
      >
        <AppHeader navigation={navigation} />

        {/* título da página */}
        <View style={[styles.header, wide && styles.headerWide]}>
          <View style={styles.decorLine} />

          <Text style={[styles.pageTitle, wide && styles.pageTitleWide]}>
            CADASTRAR NOVA OBRA
          </Text>

          <Text style={[styles.subtitle, wide && styles.subtitleWide]}>
            Compartilhe uma história que merece fazer parte do Montenegro.
          </Text>
        </View>

        {/* escolha do tipo */}
        {!kind ? (
          <View style={[styles.chooseArea, wide && styles.chooseAreaWide]}>
            <View style={styles.chooseIntro}>
              <View style={styles.introCircle}>
                <Text style={styles.introSymbol}>✦</Text>
              </View>

              <View style={styles.introText}>
                <Text style={styles.eyebrow}>COMECE POR AQUI</Text>

                <Text
                  style={[
                    styles.chooseTitle,
                    wide && styles.chooseTitleWide,
                  ]}
                >
                  O que você quer cadastrar?
                </Text>

                <Text
                  style={[
                    styles.chooseDescription,
                    wide && styles.chooseDescriptionWide,
                  ]}
                >
                  Escolha o tipo da obra para começar a preencher os detalhes.
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.typeGrid,
                wide && styles.typeGridWide,
              ]}
            >
              {(['livro', 'filme', 'serie'] as MediaKind[]).map(
                (value, index) => (
                  <Pressable
                    key={value}
                    onPress={() => setKind(value)}
                    style={({ pressed }) => [
                      styles.typeCard,
                      wide && styles.typeCardWide,
                      index === 1 && styles.typeCardYellow,
                      index === 2 && styles.typeCardGreen,
                      pressed && styles.cardPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.typeIcon,
                        index === 1 && styles.typeIconPurple,
                        index === 2 && styles.typeIconGreen,
                      ]}
                    >
                      <Text style={styles.typeIconText}>
                        {typeSymbols[value]}
                      </Text>
                    </View>

                    <View style={styles.typeCardText}>
                      <Text
                        style={[
                          styles.typeName,
                          wide && styles.typeNameWide,
                        ]}
                      >
                        {typeLabels[value]}
                      </Text>

                      <Text
                        style={[
                          styles.typeDescription,
                          wide && styles.typeDescriptionWide,
                        ]}
                      >
                        {typeDescriptions[value]}
                      </Text>
                    </View>

                    <Text style={styles.typeArrow}>→</Text>
                  </Pressable>
                ),
              )}
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.formWrap,
              wide && styles.formWrapWide,
            ]}
          >
            {/* tipo selecionado */}
            <View style={styles.selectedHeader}>
              <Pressable
                onPress={() => setKind(null)}
                style={({ pressed }) => [
                  styles.changeType,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.changeTypeText}>
                  ← trocar tipo
                </Text>
              </Pressable>

              <View style={styles.selectedType}>
                <Text style={styles.selectedSymbol}>
                  {typeSymbols[kind]}
                </Text>

                <Text style={styles.selectedText}>
                  {typeLabels[kind]}
                </Text>
              </View>
            </View>

            {/* introdução */}
            <View style={styles.formIntro}>
              <Text style={styles.formEyebrow}>NOVA OBRA</Text>

              <Text
                style={[
                  styles.formTitle,
                  wide && styles.formTitleWide,
                ]}
              >
                Conte um pouco sobre essa obra.
              </Text>

              <Text
                style={[
                  styles.formDescription,
                  wide && styles.formDescriptionWide,
                ]}
              >
                Preencha as informações abaixo para adicionar sua obra ao
                catálogo.
              </Text>
            </View>

            {/* conteúdo principal */}
            <View
              style={[
                styles.formCard,
                wide && styles.formCardWide,
              ]}
            >
              {/* capa */}
              <View
                style={[
                  styles.coverColumn,
                  wide && styles.coverColumnWide,
                ]}
              >
                <Text style={styles.fieldLabel}>CAPA DA OBRA</Text>

                <Pressable
                  onPress={handlePickImage}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.photoBox,
                    wide && styles.photoBoxWide,
                    pressed && styles.photoBoxPressed,
                  ]}
                >
                  {selectedImage ? (
                    <>
                      <Image
                        source={{ uri: selectedImage.uri }}
                        style={styles.selectedImage}
                        resizeMode="cover"
                      />

                      <View style={styles.changeImageOverlay}>
                        <Text style={styles.changeImageText}>
                          TROCAR CAPA
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.cameraCircle}>
                        <Text style={styles.cameraIcon}>♡</Text>
                      </View>

                      <Text style={styles.photoTitle}>
                        Adicione uma capa
                      </Text>

                      <Text style={styles.photoDescription}>
                        Clique aqui para escolher uma imagem
                      </Text>

                      <Text style={styles.photoHint}>
                        Do seu computador
                      </Text>
                    </>
                  )}
                </Pressable>

                {selectedImage ? (
                  <Text
                    style={styles.selectedFileName}
                    numberOfLines={1}
                  >
                    {selectedImage.name}
                  </Text>
                ) : null}
              </View>

              {/* campos */}
              <View
                style={[
                  styles.fieldsColumn,
                  wide && styles.fieldsColumnWide,
                ]}
              >
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    {nameLabel.toUpperCase()} *
                  </Text>

                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder={nameLabel}
                    placeholderTextColor="#99919E"
                    style={styles.input}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    {creatorLabel.toUpperCase()} *
                  </Text>

                  <TextInput
                    value={creator}
                    onChangeText={setCreator}
                    placeholder={creatorLabel}
                    placeholderTextColor="#99919E"
                    style={styles.input}
                  />
                </View>

                <View
                  style={[
                    styles.doubleFields,
                    wide && styles.doubleFieldsWide,
                  ]}
                >
                  <View style={styles.halfField}>
                    <Text style={styles.fieldLabel}>
                      ANO / DATA
                    </Text>

                    <TextInput
                      value={date}
                      onChangeText={setDate}
                      placeholder="Ex.: 2025"
                      placeholderTextColor="#99919E"
                      style={styles.input}
                    />
                  </View>

                  {kind === 'livro' ? (
                    <View style={styles.halfField}>
                      <Text style={styles.fieldLabel}>
                        EDITORA
                      </Text>

                      <TextInput
                        value={publisher}
                        onChangeText={setPublisher}
                        placeholder="Editora"
                        placeholderTextColor="#99919E"
                        style={styles.input}
                      />
                    </View>
                  ) : (
                    <View style={styles.halfField}>
                      <Text style={styles.fieldLabel}>
                        GÊNERO
                      </Text>

                      <TextInput
                        value={genre}
                        onChangeText={setGenre}
                        placeholder="Ex.: Drama"
                        placeholderTextColor="#99919E"
                        style={styles.input}
                      />
                    </View>
                  )}
                </View>

                {kind === 'livro' ? (
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>
                      GÊNERO
                    </Text>

                    <TextInput
                      value={genre}
                      onChangeText={setGenre}
                      placeholder="Ex.: Romance, fantasia..."
                      placeholderTextColor="#99919E"
                      style={styles.input}
                    />
                  </View>
                ) : null}
              </View>
            </View>

            {/* sinopse */}
            <View style={styles.synopsisSection}>
              <Text style={styles.fieldLabel}>SINOPSE</Text>

              <TextInput
                value={synopsis}
                onChangeText={setSynopsis}
                multiline
                placeholder="Escreva uma breve descrição da obra..."
                placeholderTextColor="#99919E"
                style={[
                  styles.textarea,
                  wide && styles.textareaWide,
                ]}
                textAlignVertical="top"
              />

              <Text style={styles.optional}>
                Uma boa sinopse ajuda outras pessoas a conhecerem a obra.
              </Text>
            </View>

            {message ? (
              <View style={styles.messageBox}>
                <Text style={styles.message}>{message}</Text>
              </View>
            ) : null}

            {/* botão */}
            <Pressable
              disabled={loading}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                wide && styles.submitButtonWide,
                pressed && styles.buttonPressed,
                loading && styles.loadingButton,
              ]}
            >
              <Text
                style={[
                  styles.submitText,
                  wide && styles.submitTextWide,
                ]}
              >
                {loading
                  ? 'CADASTRANDO...'
                  : `CADASTRAR ${typeLabels[kind].toUpperCase()}`}
              </Text>

              {!loading ? (
                <Text style={styles.submitArrow}>→</Text>
              ) : null}
            </Pressable>

            <Text style={styles.required}>
              * campos obrigatórios
            </Text>
          </View>
        )}

        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  page: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 0,
  },

  /* cabeçalho */

  header: {
    alignItems: 'center',
    paddingTop: 34,
    paddingHorizontal: 22,
    paddingBottom: 25,
  },

  headerWide: {
    paddingTop: 55,
    paddingBottom: 42,
  },

  decorLine: {
    width: 45,
    height: 2,
    backgroundColor: colors.green,
    marginBottom: 12,
    borderRadius: 10,
  },

  pageTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    letterSpacing: 1.8,
    textAlign: 'center',
  },

  pageTitleWide: {
    fontSize: 43,
    letterSpacing: 3,
  },

  subtitle: {
    color: '#817986',
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
  },

  subtitleWide: {
    fontSize: 13,
    marginTop: 9,
  },

  /* escolha do tipo */

  chooseArea: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 45,
  },

  chooseAreaWide: {
    width: '88%',
    maxWidth: 1150,
    alignSelf: 'center',
    paddingTop: 35,
    paddingBottom: 100,
  },

  chooseIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 14,
  },

  introCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFDD56',
    alignItems: 'center',
    justifyContent: 'center',
  },

  introSymbol: {
    color: colors.green,
    fontSize: 23,
  },

  introText: {
    flex: 1,
  },

  eyebrow: {
    color: '#99919E',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7,
    letterSpacing: 1.8,
  },

  chooseTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 21,
    marginTop: 1,
  },

  chooseTitleWide: {
    fontSize: 30,
  },

  chooseDescription: {
    color: '#77707D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  chooseDescriptionWide: {
    fontSize: 12,
    lineHeight: 19,
  },

  typeGrid: {
    gap: 13,
  },

  typeGridWide: {
    flexDirection: 'row',
    gap: 20,
  },

  typeCard: {
    minHeight: 105,
    borderWidth: 1,
    borderColor: '#E4DFE7',
    borderRadius: 17,
    backgroundColor: '#F8F6FA',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },

  typeCardWide: {
    flex: 1,
    minHeight: 230,
    borderRadius: 23,
    padding: 25,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  typeCardYellow: {
    backgroundColor: '#FFF9DE',
    borderColor: '#F2D96B',
  },

  typeCardGreen: {
    backgroundColor: '#EFF8F1',
    borderColor: '#B9D9C0',
  },

  typeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  typeIconPurple: {
    backgroundColor: '#5D4673',
  },

  typeIconGreen: {
    backgroundColor: colors.green,
  },

  typeIconText: {
    color: '#FFFFFF',
    fontSize: 23,
  },

  typeCardText: {
    flex: 1,
  },

  typeName: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
  },

  typeNameWide: {
    fontSize: 25,
  },

  typeDescription: {
    color: '#77707D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 8.5,
    lineHeight: 13,
    marginTop: 2,
  },

  typeDescriptionWide: {
    fontSize: 11,
    lineHeight: 17,
  },

  typeArrow: {
    color: colors.purple,
    fontSize: 20,
  },

  /* formulário */

  formWrap: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 60,
  },

  formWrapWide: {
    maxWidth: 1180,
    paddingTop: 20,
    paddingBottom: 100,
  },

  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  changeType: {
    paddingVertical: 7,
    paddingRight: 10,
  },

  changeTypeText: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
  },

  selectedType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#F1EDF4',
  },

  selectedSymbol: {
    color: colors.green,
    fontSize: 15,
  },

  selectedText: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
  },

  formIntro: {
    marginBottom: 25,
  },

  formEyebrow: {
    color: colors.green,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7,
    letterSpacing: 1.8,
  },

  formTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 23,
    marginTop: 2,
  },

  formTitleWide: {
    fontSize: 34,
  },

  formDescription: {
    color: '#77707D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  formDescriptionWide: {
    fontSize: 12,
    lineHeight: 19,
  },

  formCard: {
    backgroundColor: '#F8F6FA',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E8E2EB',
    padding: 17,
    gap: 25,
  },

  formCardWide: {
    flexDirection: 'row',
    padding: 28,
    gap: 45,
    borderRadius: 24,
  },

  coverColumn: {
    width: '100%',
  },

  coverColumnWide: {
    width: 365,
  },

  fieldLabel: {
    color: '#77707D',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 7,
    letterSpacing: 1.4,
    marginBottom: 7,
  },

  /* área da imagem */

  photoBox: {
    height: 245,
    borderRadius: 13,
    backgroundColor: '#EAE6EC',
    borderWidth: 1,
    borderColor: '#D9D2DE',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  photoBoxWide: {
    height: 470,
  },

  photoBoxPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  cameraCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  cameraIcon: {
    color: colors.purple,
    fontSize: 27,
  },

  photoTitle: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
  },

  photoDescription: {
    color: '#938A99',
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
    marginTop: 2,
  },

  photoHint: {
    color: '#938A99',
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
    marginTop: 5,
  },

  selectedImage: {
    width: '100%',
    height: '100%',
  },

  changeImageOverlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: 'rgba(44, 25, 62, 0.88)',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },

  changeImageText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
    letterSpacing: 0.8,
  },

  selectedFileName: {
    color: colors.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
    marginTop: 6,
  },

  /* campos */

  fieldsColumn: {
    flex: 1,
    gap: 15,
  },

  fieldsColumnWide: {
    paddingTop: 4,
  },

  fieldGroup: {
    width: '100%',
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D6CFDA',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    color: colors.purple,
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },

  doubleFields: {
    flexDirection: 'row',
    gap: 10,
  },

  doubleFieldsWide: {
    gap: 15,
  },

  halfField: {
    flex: 1,
  },

  synopsisSection: {
    marginTop: 25,
  },

  textarea: {
    minHeight: 145,
    borderWidth: 1,
    borderColor: '#D6CFDA',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 14,
    color: colors.purple,
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    lineHeight: 17,
  },

  textareaWide: {
    minHeight: 210,
    fontSize: 13,
    padding: 18,
  },

  optional: {
    color: '#9A929F',
    fontFamily: 'Poppins_400Regular',
    fontSize: 8,
    marginTop: 5,
  },

  messageBox: {
    backgroundColor: '#FFF8D9',
    borderWidth: 1,
    borderColor: '#E8D66E',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 18,
  },

  message: {
    color: '#766300',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
    textAlign: 'center',
  },

  /* botão */

  submitButton: {
    alignSelf: 'center',
    minHeight: 47,
    paddingHorizontal: 23,
    borderRadius: 999,
    backgroundColor: colors.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 28,
    shadowColor: '#2C193E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 7,
    elevation: 3,
  },

  submitButtonWide: {
    minWidth: 260,
    minHeight: 58,
    marginTop: 40,
  },

  submitText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9.5,
    letterSpacing: 0.4,
  },

  submitTextWide: {
    fontSize: 12,
  },

  submitArrow: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  required: {
    color: '#AAA2AE',
    fontFamily: 'Poppins_400Regular',
    fontSize: 7.5,
    textAlign: 'center',
    marginTop: 8,
  },

  pressed: {
    opacity: 0.65,
  },

  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },

  loadingButton: {
    opacity: 0.65,
  },
});