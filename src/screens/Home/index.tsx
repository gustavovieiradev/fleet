import React, { useEffect, useState } from 'react';
import { Container, Content, Label, Title } from './styles';
import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { HistoricCard, HistoricCardProps } from '../../components/HistoricCard';
import dayjs from 'dayjs';
import { FlatList } from 'react-native';

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>([]);
  const { navigate } = useNavigation();
  const realm = useRealm();

  const historic = useQuery(Historic)

  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
     return navigate('arrival', { id: vehicleInUse._id.toString() });
    }
    navigate('departure')
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = historic.filtered(`status = 'departure'`)[0];
      setVehicleInUse(vehicle);
    } catch (err) {
      console.log(err)
    }
  }

  function fetchHistoric() {
    try {
      const response = historic.filtered(`status = 'arrival' SORT(created_at DESC)`);

      const formattedHistoric = response.map((item) => {
        return ({
          id: item._id!.toString(),
          licensePlate: item.license_plate,
          isSync: false,
          created: dayjs(item.created_at).format('[Saída em] DD/MM/YYYY [às] HH:mm')
        })
      })

      setVehicleHistoric(formattedHistoric);
    } catch(err) {
      console.log(err)
    }
  }

  function handleHistoricDetail(id: string) {
    navigate('arrival', { id })
  }

  useEffect(() => {
    fetchVehicleInUse()
  }, [])

  useEffect(() => {
    fetchHistoric()
  }, [historic])

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse())

    return () => {
      if (realm && !realm.isClosed) { 
        realm.removeListener('change', fetchVehicleInUse)
      }
    }
  }, []);

  

  return (
    <Container>
      <HomeHeader />
      <Content>
        <CarStatus 
          licensePlate={vehicleInUse?.license_plate} 
          onPress={handleRegisterMovement} 
        />

        <Title>
          Histórico
        </Title>

        <FlatList 
          data={vehicleHistoric}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <HistoricCard 
              data={item} 
              onPress={() => handleHistoricDetail(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          ListEmptyComponent={(
            <Label>
              Nenhum veículo utilizado.
            </Label>
          )}
        />
      </Content>
    </Container>
  );
}