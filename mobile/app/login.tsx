import { 
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput ,
  Alert,
} from "react-native";

import { Link, router } from "expo-router";
import { baseStyles } from "@/styles/baseStyles";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const apiUrl = await AsyncStorage.getItem("API_URL");

      const userData: UserData = {
        email: email,
        password: password
      };

      const response = await fetch(`${apiUrl}/api/sign_in`, {
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
        Alert.alert("Erreur", data.message);
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
          <Text style={baseStyles.link}>Créer un compte</Text>
        </Link>
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
});