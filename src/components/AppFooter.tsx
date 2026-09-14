import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';

export function AppFooter() {
  const { width } = useWindowDimensions();
  const wide = width >= 760;

  return (
    <View style={[styles.footer, wide && styles.footerWide]}>
      <View style={[styles.columns, wide && styles.columnsWide]}>
        <View style={styles.leftColumn}>
          <Text style={styles.footerText}>Desenvolvedores:{`\n`}Ana Clara Rivas{`\n`}Beatriz Krisan{`\n`}Byanca Lourenço{`\n`}Gabriely Santos</Text>
          <View style={styles.divider} />
          <Text style={styles.footerText}>Trabalho de DDM II</Text>
        </View>
        <Text style={styles.footerText}>Filme{`\n`}Série{`\n`}Livro{`\n`}Destaques{`\n`}Cadastrar obras</Text>
        <View style={styles.brandWrap}>
          <Text style={styles.brandIcons}>🎬  🎟️  🇧🇷</Text>
          <Text style={styles.footerBrand}>MONTENEGRO</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { marginTop: 58, backgroundColor: colors.purple, paddingHorizontal: 28, paddingTop: 32, paddingBottom: 36 },
  footerWide: { minHeight: 330, paddingHorizontal: 65, paddingTop: 62, justifyContent: 'center' },
  columns: { gap: 26 },
  columnsWide: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', maxWidth: 1310, width: '100%', alignSelf: 'center' },
  leftColumn: { minWidth: 250 },
  footerText: { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 19 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,.55)', marginVertical: 16, width: 300, maxWidth: '100%' },
  brandWrap: { alignItems: 'center', justifyContent: 'center', minWidth: 260 },
  brandIcons: { fontSize: 34 },
  footerBrand: { color: '#FFDD56', fontFamily: 'Cinzel_700Bold', fontSize: 27, marginTop: 5 },
});
