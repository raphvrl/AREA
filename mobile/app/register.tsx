import { 
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";

import { Link, router } from "expo-router";
import { baseStyles } from "@/styles/base_styles";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const apiUrl = await AsyncStorage.getItem("API_URL");
      const userData = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password
      }

      const response = await fetch(`${apiUrl}/auth/sign_up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

    if (response.ok) {
      router.push('/login');
    } else {
      Alert.alert("Erreur", data.message);
    }
  } catch (error) {
    Alert.alert("Erreur", "Une erreur est survenue");
  }
};

  return (
    <View style={baseStyles.container}>
      <Text style={baseStyles.title}>AREA</Text>

      <TextInput
        style={baseStyles.input}
        placeholder="Prenom"
        value={firstName}
        onChangeText={setFirstName}
      />

<TextInput
        style={baseStyles.input}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={baseStyles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={baseStyles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={baseStyles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Déjà un compte?</Text>
        <Link href="/login" style={styles.registerLink}>
          <Text style={styles.registerLinkText}>Se connecter</Text>
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
  registerText: {
    color: '#666',
  },
  registerLink: {
    marginLeft: 5,
  },
  registerLinkText: {
    color: '#007AFF',
    fontWeight: '600',
  }
});