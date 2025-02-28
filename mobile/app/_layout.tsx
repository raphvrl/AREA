import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="login"/>
        <Stack.Screen name="register"/>
      </Stack>
    </GestureHandlerRootView>
  )
}
