import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';

export function AppFooter() {
  const { width } = useWindowDimensions();
  const wide = width >= 760;

  return (
    <View style={[styles.footer, wide && styles.footerWide]}>
      <View style={[styles.columns, wide && styles.columnsWide]}>

        <View style={styles.leftColumn}>
          <Text style={styles.title}>Desenvolvedores</Text>

          <Text style={styles.footerText}>
            Ana Clara Rivas{`\n`}
            Beatriz Krisan{`\n`}
            Byanca Lourenço{`\n`}
            Gabriely Santos
          </Text>

          <View style={styles.divider} />

          <Text style={styles.footerText}>
            Trabalho de DDM II
          </Text>
        </View>

        <View style={styles.linksColumn}>
          <Text style={styles.title}>Navegação</Text>

          <Text style={styles.footerText}>
            Filme{`\n`}
            Série{`\n`}
            Livro{`\n`}
            Destaques{`\n`}
            Cadastrar obras
          </Text>
        </View>

        <View style={styles.brandWrap}>
          <Text style={styles.footerBrand}>MONTENEGRO</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 58,

    backgroundColor: colors.purple,

    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 40,
  },

  footerWide: {
    minHeight: 300,

    paddingHorizontal: 65,
    paddingTop: 58,
    paddingBottom: 58,

    justifyContent: 'center',
  },

  columns: {
    gap: 34,
  },

  columnsWide: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'flex-start',

    maxWidth: 1310,
    width: '100%',

    alignSelf: 'center',
  },

  leftColumn: {
    minWidth: 250,
  },

  linksColumn: {
    minWidth: 180,
  },

  title: {
    color: '#FFFFFF',

    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,

    marginBottom: 12,

    letterSpacing: 0.2,
  },

  footerText: {
    color: 'rgba(255, 255, 255, 0.82)',

    fontFamily: 'Poppins_400Regular',
    fontSize: 12,

    lineHeight: 21,
  },

  divider: {
    height: 1,

    backgroundColor: 'rgba(255,255,255,0.35)',

    marginVertical: 17,

    width: 300,
    maxWidth: '100%',
  },

  brandWrap: {
    alignItems: 'flex-end',
    justifyContent: 'center',

    minWidth: 260,

    paddingTop: 2,
  },

  footerBrand: {
    color: '#FFDD56',

    fontFamily: 'Cinzel_700Bold',

    fontSize: 27,

    letterSpacing: 1.5,
  },
});