import React, { useEffect, useState } from 'react';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import { Container, Slogan, Title } from './styles';

import backgroundImg from '../../assets/background.png';
import { Button } from '../../components/Button';

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '@env';
import { Alert } from 'react-native';

import {Realm, useApp} from '@realm/react';

WebBrowser.maybeCompleteAuthSession();

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [_, response, googleSignIn] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ['profile', 'email']
  })

  function handleGoogleSignIn() {
    setIsAuthenticating(true);

    googleSignIn().then((response) => {
      if (response.type !== 'success') {
        setIsAuthenticating(false);
      }
    })
  }

  const app = useApp();

  useEffect(() => {
    if (response?.type === 'success') {
      if (response.authentication?.idToken) {

        const credentials = Realm.Credentials.jwt(response.authentication.idToken)

        app.logIn(credentials).catch(err => {
          Alert.alert('Entrar', 'Não foi possível conectar-se a sua conta Google.');
          setIsAuthenticating(false)  
        })

        // fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.authentication.idToken}`)
        //   .then(response => response.json())
        //   .then(console.log)

        // console.log('TOKEN DE AUTENTICAÇÃO =>', response.authentication.idToken)
      } else {
        Alert.alert('Entrar', 'Não foi possível conectar-se a sua conta Google.');
        setIsAuthenticating(false)
      }
    }
  }, [response])

  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>
      <Slogan>Gestão de uso de veiculos</Slogan>
      <Button title='Entrar com o google' onPress={handleGoogleSignIn}  isLoading={isAuthenticating} />
    </Container>
  );
}