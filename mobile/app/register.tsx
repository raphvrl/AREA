import { 
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput 
} from "react-native";

import { Link, router } from "expo-router";
import { baseStyles } from "@/styles/base_styles";

export default function Register() {
  return (
    <View style={baseStyles.container}>
      <Text style={baseStyles.title}>AREA</Text>

      <TextInput
        style={baseStyles.input}
        placeholder="Nom d'utilisateur"
      />

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
        onPress={() => router.push("/login")}
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