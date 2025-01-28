import { Text, View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { baseStyles } from "../styles/base_styles";
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
    <View style={baseStyles.container}>
      <Text style={baseStyles.title}>AREA</Text>

      <TextInput
        style={styles.input}
        placeholder="Entrez l'adresse IP du serveur"
        value={ipAddress}
        onChangeText={setIpAddress}
        keyboardType="numeric"
        autoCapitalize="none"
      />

<TouchableOpacity
        style={[baseStyles.button, !ipAddress && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!ipAddress}
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