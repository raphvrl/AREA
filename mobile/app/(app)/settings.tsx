import { Text, View, StyleSheet } from "react-native";
import { baseStyles } from "@/styles/baseStyles";
import { colors } from "@/styles/colors";
import Slider from '@react-native-community/slider';
import { useSettings } from '@/contexts/settingsContext';

export default function Settings() {
  const { fontSize, letterSpacing, updateSettings } = useSettings();

  return (
    <View style={baseStyles.container}>
      <Text style={baseStyles.title}>Paramètres</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Taille du texte</Text>
        <Slider
          style={styles.slider}
          minimumValue={18}
          maximumValue={32}
          value={fontSize}
          onValueChange={(value) => updateSettings(value, letterSpacing)}
          minimumTrackTintColor={colors.button}
          maximumTrackTintColor={colors.text}
        />
        <Text style={[styles.previewText, { fontSize }]}>
          Exemple ({Math.round(fontSize)}px)
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Espacement des lettres</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={2}
          step={0.1}
          value={letterSpacing}
          onValueChange={(value) => updateSettings(fontSize, value)}
          minimumTrackTintColor={colors.button}
          maximumTrackTintColor={colors.text}
        />
        <Text style={[styles.previewText, { letterSpacing }]}>
          Exemple ({letterSpacing.toFixed(1)})
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  previewText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
});