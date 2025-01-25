import { 
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput 
} from "react-native";

import { Link, router } from "expo-router";
import { baseStyles } from "@/styles/base_styles";

export default function Login() {
  return (
    <View style={baseStyles.container}>
      <Text style={baseStyles.title}>AREA</Text>

      <TextInput
        style={baseStyles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={baseStyles.input}
        placeholder="Mot de passe"
        secureTextEntry
      />

      <TouchableOpacity
        style={baseStyles.button}
        onPress={() => router.push("/(app)/home")}
      >
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={baseStyles.text}>Pas de compte ? </Text>
        <Link href="/register">
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