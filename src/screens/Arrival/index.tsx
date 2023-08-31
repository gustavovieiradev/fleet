import React from 'react';
import { Container, Content, Description, Footer, Label, LicensePlate } from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { X } from 'phosphor-react-native';
import { useObject, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { BSON } from 'realm';
import { Alert } from 'react-native';
import { Header } from '../../components/Header';


type RouteParamsProps = {
  id: string;
}

export function Arrival() {
  const route = useRoute();
  const realm = useRealm();
  const { goBack } = useNavigation();
  const { id } = route.params as RouteParamsProps;

  const historic = useObject(Historic, new BSON.UUID(id) as unknown as string);

  function handleRemoveVehicleUsage() {
    Alert.alert(
      'Cancelar',
      'Cancelar a utilização do veículo?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => remvoeVehiculeUsage() },
      ]
    )
  }

  function remvoeVehiculeUsage() {
    realm.write(() => {
      realm.delete(historic);
    })

    goBack();
  }

  function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert('Error', 'Não foi possível obter os dados para registrar a chegada do veículo');
      }

      realm.write(() => {
        historic.status = 'arrival';
        historic.updated_at = new Date();
      })

      Alert.alert('Chegada', 'Chegada registrada com sucesso!');
      goBack();

    } catch(err) {
      console.log(err);
      Alert.alert('Error', 'Não foi possível registrar a chegada do veículo.');
    }
  }

  const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes';

  return (
    <Container>
      <Header title={title} />
      <Content>
        <Label>
          Placa do veículo
        </Label>

        <LicensePlate>
          {historic?.license_plate}
        </LicensePlate>

        <Label>
          Finalidade
        </Label>

        <Description>
          {historic?.description}
        </Description>


        {historic?.status === 'departure' && (
          <Footer>
            <ButtonIcon 
              icon={X}
              onPress={handleRemoveVehicleUsage}
            />
            <Button 
              title='Registrar chegada'
              onPress={handleArrivalRegister}
            />
          </Footer>
        )}
      </Content>
    </Container>
  );
}