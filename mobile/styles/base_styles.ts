import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.background,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
    color: colors.title,
  },

  subtitle: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },

  text: {
    color: colors.text,
  },

  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: colors.input,
  },

  link: {
    color: colors.link,
  },

  button: {
    width: '100%',
    backgroundColor: colors.button,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: colors.buttonText,
  },
});