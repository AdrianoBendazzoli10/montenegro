import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    keyof RootStackParamList
  >;
};

export function AppHeader({ navigation }: Props) {
  const { width } = useWindowDimensions();

  const wide = width >= 760;
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <View
      style={[
        styles.header,
        wide && styles.headerWide,
        menuOpen && !wide && styles.headerOpen,
      ]}
    >
      {/* topo do header */}
      <View style={[styles.topRow, wide && styles.topRowWide]}>
        {/* logo */}
        <Pressable
          onPress={() => navigation.navigate('Explore')}
          hitSlop={8}
          style={styles.brandButton}
        >
          <Text style={[styles.brand, wide && styles.brandWide]}>
            MONTENEGRO
          </Text>
        </Pressable>

        {/* menu normal no desktop */}
        {wide && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.navRow}
            style={styles.navScroll}
          >
            <Pressable
              onPress={() => navigation.navigate('Explore')}
              style={styles.navItem}
            >
              <Text style={styles.navText}>Obras</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('Shelves')}
              style={styles.navItem}
            >
              <Text style={styles.navText}>Estantes</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                navigation.navigate('QuickReview', { id: '1' })
              }
              style={styles.navItem}
            >
              <Text style={styles.navText}>Avaliações</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('AddWork')}
              style={styles.navItem}
            >
              <Text style={styles.navText}>Cadastrar obras</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('Profile')}
              style={styles.navItem}
            >
              <Text style={styles.navText}>Perfil</Text>
            </Pressable>
          </ScrollView>
        )}

        {/* botão hamburguer no celular */}
        {!wide && (
          <Pressable
            onPress={() => setMenuOpen(!menuOpen)}
            style={({ pressed }) => [
              styles.menuButton,
              pressed && styles.menuButtonPressed,
            ]}
            hitSlop={8}
          >
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </Pressable>
        )}
      </View>

      {/* menu aberto no celular */}
      {!wide && menuOpen && (
        <View style={styles.mobileMenu}>
          <Pressable
            onPress={() => {
              closeMenu();
              navigation.navigate('Explore');
            }}
            style={styles.mobileItem}
          >
            <Text style={styles.navText}>Obras</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              closeMenu();
              navigation.navigate('Shelves');
            }}
            style={styles.mobileItem}
          >
            <Text style={styles.navText}>Estantes</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              closeMenu();
              navigation.navigate('QuickReview', { id: '1' });
            }}
            style={styles.mobileItem}
          >
            <Text style={styles.navText}>Avaliações</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              closeMenu();
              navigation.navigate('AddWork');
            }}
            style={styles.mobileItem}
          >
            <Text style={styles.navText}>Cadastrar obras</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              closeMenu();
              navigation.navigate('Profile');
            }}
            style={styles.mobileItem}
          >
            <Text style={styles.navText}>Perfil</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 14,
    marginTop: 12,

    minHeight: 62,

    backgroundColor: colors.purple,
    borderRadius: 999,

    paddingHorizontal: 18,
    paddingVertical: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  headerOpen: {
    borderRadius: 28,
  },

  headerWide: {
    alignSelf: 'center',
    width: '88%',
    maxWidth: 1225,

    height: 82,
    minHeight: 82,

    paddingHorizontal: 42,
    paddingVertical: 0,

    borderRadius: 999,
  },

  topRow: {
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    width: '100%',
  },

  topRowWide: {
    minHeight: 82,
    height: 82,
  },

  brandButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  brand: {
    color: '#FFFFFF',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    letterSpacing: 1.2,
  },

  brandWide: {
    fontSize: 25,
    letterSpacing: 1.5,
  },

  navScroll: {
    flexGrow: 0,
    marginLeft: 'auto',
    maxWidth: '75%',
  },

  navRow: {
    alignItems: 'center',
    gap: 26,
  },

  navItem: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 20,
  },

  navText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },

  /* botão hamburguer */
  menuButton: {
    width: 42,
    height: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 21,
  },

  menuButtonPressed: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  menuLine: {
    width: 22,
    height: 2,

    marginVertical: 2.5,

    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },

  /* menu que aparece no celular */
  mobileMenu: {
    marginTop: 8,

    paddingTop: 8,
    paddingBottom: 4,

    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },

  mobileItem: {
    minHeight: 44,

    justifyContent: 'center',

    paddingHorizontal: 12,

    borderRadius: 12,
  },
});