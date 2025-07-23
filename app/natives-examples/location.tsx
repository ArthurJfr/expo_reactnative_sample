import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Link } from 'expo-router';

export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);

  const askLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Impossible d’accéder à la localisation.');
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de récupérer la localisation.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Géolocalisation</Text>
      <Button title="Obtenir ma position" onPress={askLocation} />
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {location && (
        <>
          <View style={styles.result}>
            <Text>Latitude : {location.coords.latitude}</Text>
            <Text>Longitude : {location.coords.longitude}</Text>
          </View>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Vous êtes ici"
            />
          </MapView>
        </>
      )}
      <Link href="/" style={styles.link}>Retour à l’accueil</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  result: { marginTop: 24, alignItems: 'center' },
  map: {
    width: Dimensions.get('window').width * 0.9,
    height: 300,
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  link: { marginTop: 24, color: '#2563eb', textDecorationLine: 'underline' },
});
