import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
// import { Provider } from 'react-redux';
// import { store } from '../../redux/store';

function CameraLayoutNav(): React.JSX.Element {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName='/camera/cameraView'>
          <Stack.Screen
            name="cameraView"
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="confirmation"
            options={{
              headerTitle: "Confirmation",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="results"
            options={{
              headerTitle: "Results",
            }}
          />
        </Stack>
    </ThemeProvider>
  );
}

export default function CameraLayout(): React.JSX.Element {
  return <CameraLayoutNav />;
}
