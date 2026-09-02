import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="generate/index" options={{ title: 'Generate Document' }} />
        <Stack.Screen name="generate/[id]" options={{ title: 'Preview' }} />
        <Stack.Screen name="pdf/viewer" options={{ title: 'PDF Viewer' }} />
        <Stack.Screen name="pdf/editor" options={{ title: 'PDF Editor' }} />
        <Stack.Screen name="pdf/merge" options={{ title: 'Merge PDFs' }} />
        <Stack.Screen name="pdf/split" options={{ title: 'Split PDF' }} />
        <Stack.Screen name="pdf/sign" options={{ title: 'E-Sign' }} />
        <Stack.Screen name="camera/scanner" options={{ title: 'Scanner' }} />
        <Stack.Screen name="camera/ocr" options={{ title: 'OCR' }} />
        <Stack.Screen name="settings/index" options={{ title: 'Settings' }} />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
