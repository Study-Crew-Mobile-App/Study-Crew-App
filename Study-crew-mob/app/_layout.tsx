import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../components/context/AuthContext';
import { AuthModalProvider } from '../components/context/AuthModalContext';
import { AuthModalRoot } from '../components/auth/AuthModalRoot';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#ffffff' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="dashboard/user" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          {/* Add more screens here as you build them */}
          {/* Example:
          <Stack.Screen name="profile/index" options={{ headerShown: false }} />
          <Stack.Screen name="courses/index" options={{ headerShown: false }} />
          */}
        </Stack>
        <AuthModalRoot />
      </AuthModalProvider>
    </AuthProvider>
  );
}
