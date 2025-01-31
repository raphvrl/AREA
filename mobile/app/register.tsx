import { 
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";

import { Link, router } from "expo-router";
import { baseStyles } from "@/styles/baseStyles";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
} 

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    try {
      const apiUrl = await AsyncStorage.getItem("API_URL");

      const userData: UserData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        confirmPassword: confirmPassword
      };

      if (userData.password !== userData.confirmPassword) {
        Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
        return;
      }

      const response = await fetch(`${apiUrl}/api/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
      });

    if (response.ok) {
      router.push('/login');
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
      accessibilityLabel="Page d'inscription AREA"
      accessibilityRole="header"
    >
      <Text
        style={baseStyles.title}
        accessible={true}
        accessibilityLabel="AREA"
        accessibilityRole="header"
      >
        AREA
      </Text>

      <TextInput
        style={baseStyles.input}
        placeholder="Prenom"
        value={firstName}
        onChangeText={setFirstName}
        accessible={true}
        accessibilityLabel="Champ prénom"
        accessibilityHint="Entrez votre prénom"
        accessibilityRole="none"
      />

      <TextInput
        style={baseStyles.input}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
        accessibilityLabel="Champ nom"
        accessibilityHint="Entrez votre nom"
        accessibilityRole="text"
      />

      <TextInput
        style={baseStyles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        accessible={true}
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
        accessible={true}
        accessibilityLabel="Champ mot de passe"
        accessibilityHint="Entrez votre mot de passe"
        accessibilityRole="text"
      />

      <TextInput
        style={baseStyles.input}
        placeholder="Confirmer le mot de passe"
        secureTextEntry
        autoCapitalize="none"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        accessible={true}
        accessibilityLabel="Champ confirmation mot de passe"
        accessibilityHint="Confirmez votre mot de passe"
        accessibilityRole="text"
      />

      <TouchableOpacity
        style={baseStyles.button}
        onPress={handleRegister}
        accessible={true}
        accessibilityLabel="Bouton s'inscrire"
        accessibilityHint="Double tapez pour créer votre compte"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Déjà un compte?</Text>
        <Link
          href="/login" style={styles.registerLink}
          accessible={true}
          accessibilityLabel="Lien vers la connexion"
          accessibilityHint="Double tapez pour aller à la page de connexion"
          accessibilityRole="link"
        >
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