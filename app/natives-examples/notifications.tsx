import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Link } from 'expo-router';
import NotificationScheduler from '../../components/NotificationScheduler';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function NotificationsScreen() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Écoute les notifications reçues
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Écoute les interactions avec la notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Tu peux gérer ici la navigation ou autre
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications Push</Text>
      <Text style={styles.label}>Token Expo Push :</Text>
      <Text selectable style={styles.token}>{expoPushToken ?? 'En attente...'}</Text>
      <Button
        title="Envoyer une notification locale"
        onPress={async () => {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Hello 👋',
              body: 'Ceci est une notification locale !',
            },
            trigger: null,
          });
        }}
      />
      <NotificationScheduler />
      {notification && (
        <View style={styles.notification}>
          <Text style={styles.label}>Dernière notification reçue :</Text>
          <Text>{notification.request.content.title}</Text>
          <Text>{notification.request.content.body}</Text>
        </View>
      )}
      <Link href="/" style={styles.link}>Retour à l’accueil</Link>

    </View>
  );
}

// Fonction utilitaire pour demander la permission et obtenir le token
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Permission pour les notifications refusée !');
      return;
    }
    
    try {
      // Essayer d'obtenir le token push avec gestion d'erreur
      const pushToken = await Notifications.getExpoPushTokenAsync();
      token = pushToken.data;
    } catch (error) {
      console.warn('Impossible d\'obtenir le token push:', error);
      // En mode développement ou si le projectId n'est pas valide, on continue sans token
      token = 'Token non disponible (mode développement)';
    }
  } else {
    alert('Doit être utilisé sur un appareil physique');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  label: { fontWeight: 'bold', marginTop: 16 },
  token: { fontSize: 12, color: '#2563eb', marginBottom: 16 },
  link: { marginTop: 20, padding: 10, width: 200, textAlign: 'center', color: '#000', borderRadius: 5 },
  notification: { marginTop: 24, alignItems: 'center' },
});
