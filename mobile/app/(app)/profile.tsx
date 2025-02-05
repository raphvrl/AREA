import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { baseStyles } from "@/styles/baseStyles";
import { colors } from "@/styles/colors";
import { useSettings } from "@/contexts/settingsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FontAwesome } from '@expo/vector-icons';
import ServiceButton from "@/components/serviceButton";

const serviceColors = {
  github: "#333",
  spotify: "#1DB954",
};

interface ActiveServices {
  email: string;
};

export default function Profile() {
  const { fontSize, letterSpacing } = useSettings();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const [activeServices, setActiveServices] = useState<string[]>([]);
  const redirectUri = "https://raphvrl.github.io/my-app-redirection/";

  const fetchActiveServices = async () => {
    try {
      if (!userEmail || !apiUrl) return;
  
      const response = await fetch(`${apiUrl}/api/get_login_service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        setActiveServices(data.activeServices);
      }
    } catch (error) {
      console.error('Erreur récupération services:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const firstName = await AsyncStorage.getItem("USER_FIRST_NAME");
      const lastName = await AsyncStorage.getItem("USER_LAST_NAME");
      const email = await AsyncStorage.getItem("USER_EMAIL");

      setFirstName(firstName || "");
      setLastName(lastName || "");
      setUserEmail(email || "");
    };

    fetchUserData();

    const fetchApiUrl = async () => {
      const url = await AsyncStorage.getItem("API_URL");
      setApiUrl(url);
    };

    fetchApiUrl();
    fetchActiveServices();

    console.log("activeServices", activeServices);

    const handleDeepLink = async (event: { url: string }) => {
      const { url} = event;
      const parseUrl = new URL(url);
  
      const code = parseUrl.searchParams.get("code");
      const state = parseUrl.searchParams.get("state");
  
      if (state) {
        try {
          const sender = {
            code: code || "",
            email: userEmail,
          };
  
          const stateData = JSON.parse(state);
          const service = stateData.service;
  
          const apiLink = `${apiUrl}${service}`;
  
          const response = await fetch(apiLink, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sender),
          });
  
          if (response.ok) {
            Alert.alert("Succès", "Connexion réussie");
            if (onServiceUpdate) {
              onServiceUpdate();
            }
          } else {
            const errorData = await response.json();
            const info = errorData.message || response.statusText
            Alert.alert("Erreur", info);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    const sub = Linking.addEventListener("url", handleDeepLink);
    return () => sub.remove();
  }, [userEmail, apiUrl]);

  const isServiceActive = (serviceName: string): boolean => {
    console.log("activeServices", activeServices);
    console.log("serviceName", serviceName);
    return activeServices.includes(serviceName.toLowerCase());
  };

  const onServiceUpdate = () => {
    fetchActiveServices();
  };

  return (
    <View
      style={baseStyles.container}
      accessible={true}
      accessibilityLabel="Page de profil"
      accessibilityRole="header"
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={80} color={colors.text} />
        </View>
        <Text
          style={[styles.firstName, { fontSize: fontSize + 8, letterSpacing }]}
          accessible={true}
          accessibilityLabel="Prénom"
          accessibilityRole="text"
        >
          {firstName}
        </Text>
        <Text
          style={[styles.lastName, { fontSize: fontSize + 4, letterSpacing }]}
          accessible={true}
          accessibilityLabel="Nom"
          accessibilityRole="text"
        >
          {lastName}
        </Text>
      </View>

      <ScrollView style={styles.servicesContainer}>
        <ServiceButton
          text="GitHub"
          color={serviceColors.github}
          iconName="logo-github"
          iconType="Ionicons"
          apiUrl={`${apiUrl}/api/auth/github`}
          redirectUri={redirectUri}
          userEmail={userEmail}
          fontSize={fontSize}
          onServiceUpdate={onServiceUpdate}
          isActive={isServiceActive("github")}
        />
        <ServiceButton
          text="Spotify"
          color={serviceColors.spotify}
          iconName="spotify"
          iconType="FontAwesome"
          apiUrl={`${apiUrl}/api/auth/spotify`}
          redirectUri={redirectUri}
          userEmail={userEmail}
          fontSize={fontSize}
          onServiceUpdate={onServiceUpdate}
          isActive={isServiceActive("spotify")}
        />
        <ServiceButton
          text="Dropbox"
          color="#007EE5"
          iconName="dropbox"
          iconType="FontAwesome"
          apiUrl={`${apiUrl}/api/auth/dropbox`}
          redirectUri={redirectUri}
          userEmail={userEmail}
          fontSize={fontSize}
          onServiceUpdate={onServiceUpdate}
          isActive={isServiceActive("dropbox")}
        />
        <ServiceButton
          text="Notion"
          color="#000000"
          iconName="notion"
          iconType="FontAwesome"
          apiUrl={`${apiUrl}/api/auth/notion`}
          redirectUri={redirectUri}
          userEmail={userEmail}
          fontSize={fontSize}
          onServiceUpdate={onServiceUpdate}
          isActive={isServiceActive("notion")}
        />
        <ServiceButton
          text="Twitch"
          color="#9146FF"
          iconName="twitch"
          iconType="FontAwesome"
          apiUrl={`${apiUrl}/api/auth/twitch`}
          redirectUri={redirectUri}
          userEmail={userEmail}
          fontSize={fontSize}
          onServiceUpdate={onServiceUpdate}
          isActive={isServiceActive("twitch")}
        />
      </ScrollView>

      <TouchableOpacity 
        style={[baseStyles.button, styles.logoutButton]}
        onPress={() => router.replace("/login")}
        accessible={true}
        accessibilityLabel="Bouton de déconnexion"
        accessibilityHint="Double tapez pour vous déconnecter"
        accessibilityRole="button"
      >
        <Text style={[baseStyles.buttonText, { fontSize: fontSize - 2, letterSpacing }]}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: colors.text,
  },
  section: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    marginTop: 'auto',
    backgroundColor: colors.button,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  firstName: {
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  lastName: {
    fontWeight: '500',
    color: colors.text,
    textTransform: 'uppercase',
  },
  servicesContainer: {
    marginBottom: 20,
  },
  serviceButton: {
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
});