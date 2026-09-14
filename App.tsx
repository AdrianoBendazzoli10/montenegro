import { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Cinzel_700Bold, useFonts as useCinzelFonts } from '@expo-google-fonts/cinzel';
import { Poppins_400Regular, Poppins_600SemiBold, useFonts as usePoppinsFonts } from '@expo-google-fonts/poppins';
import { Roboto_300Light, Roboto_400Regular, Roboto_500Medium, useFonts as useRobotoFonts } from '@expo-google-fonts/roboto';
import { View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { CatalogScreen } from './src/screens/CatalogScreen';
import { DetailsScreen } from './src/screens/DetailsScreen';
import { QuickReviewScreen, DetailedReviewScreen } from './src/screens/ReviewScreens';
import { ShelvesScreen } from './src/screens/ShelvesScreen';
import { ProfileScreen, EditProfileScreen } from './src/screens/ProfileScreens';
import { AddWorkScreen } from './src/screens/AddWorkScreen';
import type { RootStackParamList } from './src/navigation/types';
import { colors } from './src/theme/colors';
import { restoreAuthToken } from './src/services/api';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [cinzelLoaded] = useCinzelFonts({ Cinzel_700Bold });
  const [poppinsLoaded] = usePoppinsFonts({ Poppins_400Regular, Poppins_600SemiBold });
  const [robotoLoaded] = useRobotoFonts({ Roboto_300Light, Roboto_400Regular, Roboto_500Medium });
  const [sessionReady, setSessionReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    restoreAuthToken()
      .then((token) => setHasSession(Boolean(token)))
      .finally(() => setSessionReady(true));
  }, []);

  if (!cinzelLoaded || !poppinsLoaded || !robotoLoaded || !sessionReady) {
    return <View style={{ flex: 1, backgroundColor: colors.navy }} />;
  }

  return (
    <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.navy } }}>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName={hasSession ? 'Explore' : 'Home'} screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: '#FFFFFF' } }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="Catalog" component={CatalogScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="QuickReview" component={QuickReviewScreen} />
        <Stack.Screen name="DetailedReview" component={DetailedReviewScreen} />
        <Stack.Screen name="Shelves" component={ShelvesScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="AddWork" component={AddWorkScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
