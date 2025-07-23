import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ou true si tu veux l’en-tête natif
      }}
    />
  );
}
