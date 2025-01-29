import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { baseStyles } from "@/styles/base_styles";
import { colors } from "@/styles/colors";
import { useSettings } from "@/contexts/settingsContext";

export default function Profile() {
  const { fontSize, letterSpacing } = useSettings();

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
          style={[styles.username, { fontSize, letterSpacing }]}
          accessible={true}
          accessibilityLabel="Nom d'utilisateur"
          accessibilityRole="text"
        >
          John Doe
        </Text>
        <Text 
          style={[styles.email, { fontSize: fontSize - 2, letterSpacing }]}
          accessible={true}
          accessibilityLabel="Adresse email"
          accessibilityRole="text"
        >
          john.doe@email.com
        </Text>
      </View>

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
});