import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { baseStyles } from '@/styles/baseStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ServiceButtonProps {
  text: string;
  color: string;
  iconName: string;
  iconType: 'Ionicons' | 'FontAwesome';
  apiUrl: string;
  redirectUri: string;
  userEmail: string;
  fontSize: number;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({ text, color, iconName, iconType, apiUrl, redirectUri, userEmail, fontSize }) => {
  const IconComponent = iconType === 'Ionicons' ? Ionicons : FontAwesome;

  const handlePress = async () => {
    const url = `${apiUrl}?email=${encodeURIComponent(userEmail)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Erreur", `Impossible de se connecter à ${text}`);
    }
  };

  return (
    <TouchableOpacity 
      style={[baseStyles.button, styles.serviceButton, { backgroundColor: color }]}
      onPress={handlePress}
      accessible={true}
      accessibilityLabel={`Connexion ${text}`}
      accessibilityRole="button"
    >
      <View style={styles.buttonContent}>
        <IconComponent name={iconName} size={24} color="white" style={styles.buttonIcon} />
        <Text style={[baseStyles.buttonText, { fontSize }]}>
          {`Connecter ${text}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  serviceButton: {
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
});

export default ServiceButton;