import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { baseStyles } from "@/styles/baseStyles";
import { colors } from "@/styles/colors";
import { useSettings } from "@/contexts/settingsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FontAwesome } from '@expo/vector-icons';

const serviceColors = {
  github: "#333",
  spotify: "#1DB954",
};

export default function Profile() {
  const { fontSize, letterSpacing } = useSettings();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");

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
  }, []);

  const handleGithubAuth = async () => {
    const apiUrl = await AsyncStorage.getItem("API_URL");

    const redirect_uri = "area-app://profile";
    // const githubUrl = `${apiUrl}/api/auth/github?email=${encodeURIComponent(userEmail)}&redirect_uri=${encodeURIComponent(redirect_uri)}`

    try {
      await Linking.openURL(`${apiUrl}/redirect`);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de se connecter à GitHub");
    }
  };

  const handleSpotifyAuth = async () => {
    const apiUrl = await AsyncStorage.getItem("API_URL");

    const redirect_uri = "https://youtube.com";
    const spotifyUrl = `${apiUrl}/api/auth/spotify?email=${encodeURIComponent(userEmail)}&redirect_uri=${encodeURIComponent(redirect_uri)}`

    console.log(spotifyUrl);

    try {
      await Linking.openURL(spotifyUrl);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de se connecter à Spotify");
    }
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
        <TouchableOpacity 
          style={[baseStyles.button, styles.serviceButton, { backgroundColor: serviceColors.github }]}
          onPress={() => {handleGithubAuth()}}
          accessible={true}
          accessibilityLabel="Connexion GitHub"
          accessibilityRole="button"
        >
          <View style={styles.buttonContent}>
            <Ionicons name="logo-github" size={24} color="white" style={styles.buttonIcon} />
            <Text style={[baseStyles.buttonText, { fontSize }]}>
              Connecter GitHub
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[baseStyles.button, styles.serviceButton, { backgroundColor: serviceColors.spotify }]}
          onPress={() => {handleSpotifyAuth()}}
          accessible={true}
          accessibilityLabel="Connexion Spotify"
          accessibilityRole="button"
        >
          <View style={styles.buttonContent}>
            <FontAwesome name="spotify" size={24} color="white" style={styles.buttonIcon} />
            <Text style={[baseStyles.buttonText, { fontSize }]}>
              Connecter Spotify
            </Text>
          </View>
        </TouchableOpacity>
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