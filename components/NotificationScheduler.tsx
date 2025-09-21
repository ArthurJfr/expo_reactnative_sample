import React, { useState, useRef } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function NotificationScheduler() {
  const [scheduledId, setScheduledId] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleRepeatingNotification = async () => {
    // Annule toute notification précédente
    if (scheduledId) {
      await Notifications.cancelScheduledNotificationAsync(scheduledId);
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Notification récurrente',
        body: 'Ceci est une notification toutes les 1 minute.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60,
        repeats: true,
      },
    });
    setScheduledId(id);
    setActive(true);
  };

  const cancelRepeatingNotification = async () => {
    if (scheduledId) {
      await Notifications.cancelScheduledNotificationAsync(scheduledId);
      setScheduledId(null);
    }
    setActive(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Notification récurrente toutes les 1 minute :</Text>
      <Button
        title={active ? 'Désactiver la notification récurrente' : 'Activer la notification récurrente'}
        onPress={active ? cancelRepeatingNotification : scheduleRepeatingNotification}
        color={active ? '#dc2626' : '#2563eb'}
      />
      {active && <Text style={styles.active}>Active</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 24, alignItems: 'center' },
  label: { marginBottom: 8, fontWeight: 'bold' },
  active: { marginTop: 8, color: '#16a34a', fontWeight: 'bold' },
}); 