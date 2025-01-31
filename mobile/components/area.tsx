import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/colors';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AreaProps {
  title: string;
  action: string;
  reaction: string;
  onDelete?: () => void;
  fontSize: number;
  letterSpacing: number;
};

interface DeleteData {
  nomArea: string;
  email: string;
};

export const Area = ({
  title,
  action,
  reaction,
  onDelete,
  fontSize,
  letterSpacing
}: AreaProps) => {
  const [isEnabled, setIsEnabled] = useState(true);

  const handleDeleteArea = async () => {
    const apiUrl = await AsyncStorage.getItem("API_URL");
    const email = await AsyncStorage.getItem("USER_EMAIL");

    try {
      const data : DeleteData = {
        nomArea: title,
        email: email || "",
      };

      const response = await fetch(`${apiUrl}/api/deleteArea`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok && onDelete) {
        onDelete();
      } else {
        const errorData = await response.json();
        const info = errorData.message || response.statusText;
        Alert.alert("Erreur", info);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleDeleteArea}
            accessible={true}
            accessibilityLabel="Supprimer cette AREA"
            accessibilityHint="Double tapez pour supprimer"
            accessibilityRole="button"
          >
            <Ionicons name="trash-outline" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text
            style={[styles.title, { fontSize, letterSpacing }]}
            accessible={true}
            accessibilityRole="header"
          >
            {title}
          </Text>
          
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            trackColor={{ false: colors.text, true: colors.button }}
            accessible={true}
            accessibilityLabel="Activer ou désactiver cette AREA"
            accessibilityRole="switch"
          />
        </View>

        <View style={styles.box}>
          <Text
            style={[styles.text, { fontSize: fontSize - 2, letterSpacing }]}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Action: ${action}`}
          >
            {action}
          </Text>
        </View>
        
        <Ionicons 
          name="arrow-down" 
          size={24} 
          color={colors.text}
          style={styles.arrow}
        />
        
        <View style={styles.box}>
          <Text
            style={[styles.text, { fontSize: fontSize - 2, letterSpacing }]}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Réaction: ${reaction}`}
          >{reaction}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  card: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    color: colors.title,
    fontSize: 18,
    fontWeight: 'bold',
  },
  box: {
    backgroundColor: colors.input,
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    color: colors.text,
    fontSize: 16,
  },
  arrow: {
    marginVertical: 10,
  }
});