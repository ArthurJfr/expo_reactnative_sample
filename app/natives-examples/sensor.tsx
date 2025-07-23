import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';

function getOrientation(x: number, y: number, z: number) {
  if (Math.abs(x) > Math.abs(y) && Math.abs(x) > Math.abs(z)) {
    return x > 0 ? 'Penché à gauche' : 'Penché à droite';
  }
  if (Math.abs(y) > Math.abs(x) && Math.abs(y) > Math.abs(z)) {
    return y > 0 ? 'Penché vers l’avant' : 'Penché vers l’arrière';
  }
  if (Math.abs(z) > Math.abs(x) && Math.abs(z) > Math.abs(y)) {
    return z > 0 ? 'Face vers le haut' : 'Face vers le bas';
  }
  return 'Position inconnue';
}

export default function SensorScreen() {
  // États pour chaque capteur
  const [accel, setAccel] = useState({ x: 0, y: 0, z: 0 });
  const [gyro, setGyro] = useState({ x: 0, y: 0, z: 0 });
  const [magnet, setMagnet] = useState({ x: 0, y: 0, z: 0 });

  // États pour activer/désactiver les capteurs
  const [accelOn, setAccelOn] = useState(true);
  const [gyroOn, setGyroOn] = useState(false);
  const [magnetOn, setMagnetOn] = useState(false);

  useEffect(() => {
    let accelSub: any, gyroSub: any, magnetSub: any;

    if (accelOn) {
      accelSub = Accelerometer.addListener(setAccel);
      Accelerometer.setUpdateInterval(200);
    } else if (accelSub) {
      accelSub.remove();
    }

    if (gyroOn) {
      gyroSub = Gyroscope.addListener(setGyro);
      Gyroscope.setUpdateInterval(200);
    } else if (gyroSub) {
      gyroSub.remove();
    }

    if (magnetOn) {
      magnetSub = Magnetometer.addListener(setMagnet);
      Magnetometer.setUpdateInterval(200);
    } else if (magnetSub) {
      magnetSub.remove();
    }

    return () => {
      accelSub && accelSub.remove();
      gyroSub && gyroSub.remove();
      magnetSub && magnetSub.remove();
    };
  }, [accelOn, gyroOn, magnetOn]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Capteurs du téléphone</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accéléromètre</Text>
        <Switch value={accelOn} onValueChange={setAccelOn} />
        <Text style={styles.value}>x: {accel.x.toFixed(2)}</Text>
        <Text style={styles.value}>y: {accel.y.toFixed(2)}</Text>
        <Text style={styles.value}>z: {accel.z.toFixed(2)}</Text>
        <Text style={styles.interpretation}>
          Orientation : {getOrientation(accel.x, accel.y, accel.z)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gyroscope</Text>
        <Switch value={gyroOn} onValueChange={setGyroOn} />
        <Text style={styles.value}>x: {gyro.x.toFixed(2)}</Text>
        <Text style={styles.value}>y: {gyro.y.toFixed(2)}</Text>
        <Text style={styles.value}>z: {gyro.z.toFixed(2)}</Text>
        <Text style={styles.interpretation}>
          {Math.abs(gyro.x) + Math.abs(gyro.y) + Math.abs(gyro.z) > 0.5
            ? 'Le téléphone tourne !'
            : 'Stable'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Magnétomètre</Text>
        <Switch value={magnetOn} onValueChange={setMagnetOn} />
        <Text style={styles.value}>x: {magnet.x.toFixed(2)}</Text>
        <Text style={styles.value}>y: {magnet.y.toFixed(2)}</Text>
        <Text style={styles.value}>z: {magnet.z.toFixed(2)}</Text>
        <Text style={styles.interpretation}>
          Champ magnétique détecté : {Math.sqrt(magnet.x ** 2 + magnet.y ** 2 + magnet.z ** 2).toFixed(2)} µT
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  section: {
    marginBottom: 32,
    backgroundColor: '#f1f5fd',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  value: { fontSize: 16, marginVertical: 2 },
  interpretation: { marginTop: 8, fontStyle: 'italic', color: '#2563eb' },
});
