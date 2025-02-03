import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { SettingsProvider } from "@/contexts/settingsContext";

export default function AppLayout() {
  return (
    <SettingsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: 'transparent',
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
          animation: 'shift',
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Accueil",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Paramètres",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? "settings" : "settings-outline"} size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SettingsProvider>
  );
}