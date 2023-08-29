import { ThemeProvider } from 'styled-components/native';
import { SignIn } from './src/screens/SignIn';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import theme from './src/theme';
import { Loading } from './src/components/Loading';
import { StatusBar } from 'react-native';
import { AppProvider, UserProvider } from '@realm/react';

import {REALM_APP_ID} from '@env';
import { Home } from './src/screens/Home';
import { Route } from './src/routes';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {

  const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold});

  if (!fontsLoaded) {
    return (
      <Loading />
    )
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <StatusBar barStyle={"light-content"} backgroundColor="transparent" translucent />
          <UserProvider fallback={SignIn}>
            <Route />
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
