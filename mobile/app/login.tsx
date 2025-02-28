import { 
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput ,
  Alert,
  ScrollView,
  Linking,
} from "react-native";

import { Link, router } from "expo-router";
import { baseStyles } from "@/styles/baseStyles";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginServiceButton from "@/components/loginServiceButton";

interface UserData {
  email: string;
  password: string;
}

interface UserResponse {
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

const serviceColors = {
  github: "#333",
  spotify: "#1DB954",
  dropbox: "#0061FF",
  notion: "#000000",
  twitch: "#9146FF",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirectUri = "https://raphvrl.github.io/my-app-redirection/home";
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  const hasInitialized = useRef(false);
  const listenerRef = useRef<any>(null);

  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const url = await AsyncStorage.getItem("API_URL");
        if (url && url !== apiUrl) {
          setApiUrl(url);
        }
      } catch (error) {
        console.error("API URL fetch error:", error);
      }
    };
    fetchApiUrl();
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const handleDeepLink = async (event: { url: string }) => {
      if (!event.url.includes('/home')) return;

      const apiUrl = await AsyncStorage.getItem("API_URL");
      const { url } = event;
      const parseUrl = new URL(url);
      const code = parseUrl.searchParams.get("code");
      const state = parseUrl.searchParams.get("state");
  
      if (state) {
        const stateData = JSON.parse(state);
        const service = stateData.service;
        const apiLink = `${apiUrl}${service}`;
  
        const response = await fetch(apiLink, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
            redirectUri: redirectUri,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          await Promise.all([
            AsyncStorage.setItem("USER_EMAIL", data.user.email),
            AsyncStorage.setItem("USER_FIRST_NAME", data.user.firstName),
            AsyncStorage.setItem("USER_LAST_NAME", data.user.lastName),
          ]);
          router.push('/(app)/home');
        }
      }
    };

    listenerRef.current = handleDeepLink;
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
      hasInitialized.current = false;
      listenerRef.current = null;
    }
  }, []);

  const handleLogin = async () => {
    try {
      const apiUrl = await AsyncStorage.getItem("API_URL");

      const userData: UserData = {
        email: email,
        password: password
      };

      const response = await fetch(`${apiUrl}/api/signIn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        await Promise.all([
          AsyncStorage.setItem("USER_EMAIL", data.user.email),
          AsyncStorage.setItem("USER_FIRST_NAME", data.user.firstName),
          AsyncStorage.setItem("USER_LAST_NAME", data.user.lastName),
        ]);
        router.push('/(app)/home');
      } else {
        const errorData = await response.json();
        const info = errorData.message || response.statusText;
        Alert.alert("Erreur", info);
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue");
    }
  };

  return (
    <View
      style={baseStyles.container}
      accessible={true}
      accessibilityLabel="Page de connexion AREA"
      accessibilityRole="header"
    >
      <View style={styles.formContainer}>
        <Text
          style={baseStyles.title}
          accessibilityLabel="AREA"
          accessibilityRole="header"
        >
          AREA
        </Text>

        <TextInput
          style={baseStyles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          accessibilityLabel="Champ email"
          accessibilityHint="Entrez votre adresse email"
          accessibilityRole="text"
        />

        <TextInput
          style={baseStyles.input}
          placeholder="Mot de passe"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          accessibilityLabel="Champ mot de passe"
          accessibilityHint="Entrez votre mot de passe"
          accessibilityRole="text"
        />

        <TouchableOpacity
          style={baseStyles.button}
          onPress={handleLogin}
          accessible={true}
          accessibilityLabel="Se connecter"
          accessibilityHint="Double tapez pour vous connecter"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={baseStyles.text}>Pas de compte ? </Text>
          <Link
            href="/register"
            accessible={true}
            accessibilityLabel="Créer un compte"
            accessibilityHint="Double tapez pour créer un compte"
            accessibilityRole="link"
          >
            <Text style={styles.loginLink}>Créer un compte</Text>
          </Link>
        </View>
      </View>
      <View style={styles.servicesSection}>
        <ScrollView style={styles.servicesContainer}>
          <LoginServiceButton
            text="GitHub"
            color={serviceColors.github}
            iconName="logo-github"
            iconType="Ionicons"
            apiUrl={`${apiUrl}/api/auth/github`}
            redirectUri={redirectUri}
            fontSize={16}
          />
          <LoginServiceButton
            text="Spotify"
            color={serviceColors.spotify}
            iconName="spotify"
            iconType="FontAwesome"
            apiUrl={`${apiUrl}/api/auth/spotify`}
            redirectUri={redirectUri}
            fontSize={16}
          />
          <LoginServiceButton
            text="Dropbox"
            color={serviceColors.dropbox}
            iconName="dropbox"
            iconType="FontAwesome"
            apiUrl={`${apiUrl}/api/auth/dropbox`}
            redirectUri={redirectUri}
            fontSize={16}
          />
          <LoginServiceButton
            text="Notion"
            color={serviceColors.notion}
            iconName="notion"
            iconType="Notion-logo"
            apiUrl={`${apiUrl}/api/auth/notion`}
            redirectUri={redirectUri}
            fontSize={16}
          />
          <LoginServiceButton
            text="Twitch"
            color={serviceColors.twitch}
            iconName="twitch"
            iconType="FontAwesome"
            apiUrl={`${apiUrl}/api/auth/twitch`}
            redirectUri={redirectUri}
            fontSize={16}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  servicesContainer: {
    width: '100%',
    maxHeight: 200,
    marginTop: 20,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  servicesSection: {
    width: '100%',
    marginTop: 10,
  },
  loginLink: {
    color: '#007EE5',
    fontWeight: '600'
  },
});