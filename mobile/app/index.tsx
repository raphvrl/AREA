import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { baseStyles } from "../styles/base_styles";

export default function Index() {
  return (
    <View style={baseStyles.container}>
      <Text style={baseStyles.title}>AREA</Text>
      <TouchableOpacity
        style={baseStyles.button}
        onPress={() => router.push("/login")}
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
});