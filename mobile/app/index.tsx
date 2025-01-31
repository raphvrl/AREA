import { Text, View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { baseStyles } from "../styles/baseStyles";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "@/styles/colors";
import { router } from "expo-router";

export default function Index() {
  const [ipAddress, setIpAddress] = useState("");

  const handleSubmit = async () => {
    if (ipAddress) {
      await AsyncStorage.setItem("API_URL", `http://${ipAddress}:8080`);
      router.push("/login");
    }
  };

  return (
    <View
      style={baseStyles.container}
      accessible={true}
      accessibilityLabel="Page de configuration AREA"
      accessibilityRole="header"
    >
      <Text
        style={baseStyles.title}
        accessible={true}
        accessibilityLabel="AREA"
        accessibilityRole="header"
      >AREA</Text>

      <TextInput
        style={styles.input}
        placeholder="Entrez l'adresse IP du serveur"
        value={ipAddress}
        onChangeText={setIpAddress}
        keyboardType="numeric"
        autoCapitalize="none"
        accessible={true}
        accessibilityLabel="Champ adresse IP"
        accessibilityHint="Entrez l'adresse IP de votre serveur"
        accessibilityRole="text"
      />

<TouchableOpacity
        style={[baseStyles.button, !ipAddress && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!ipAddress}
        accessible={true}
        accessibilityLabel="Bouton de validation"
        accessibilityHint="Double tapez pour valider l'adresse IP"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>C'est partie!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});