import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { baseStyles } from '@/styles/baseStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/styles/colors';

interface ServiceButtonProps {
  text: string;
  color: string;
  iconName: string;
  iconType: 'Ionicons' | 'FontAwesome';
  apiUrl: string;
  redirectUri: string;
  userEmail: string;
  fontSize: number;
  isActive?: boolean;
}

const LoginServiceButton: React.FC<ServiceButtonProps> = ({
  text,
  color,
  iconName,
  iconType,
  apiUrl, 
  redirectUri,
  userEmail,
  fontSize,
  isActive,
}) => {
  const IconComponent = iconType === 'Ionicons' ? Ionicons : FontAwesome;

  const handlePress = async () => {
    const url = `${apiUrl}?redirectUri=${encodeURIComponent(redirectUri)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Erreur", `Impossible de se connecter à ${text}`);
    }
  };

  return (
    <View style={styles.outerContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  greyBox: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 20,
    paddingTop: 30,
    position: 'relative',
  },
  statusLed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: 10,
    right: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  serviceButton: {
    marginBottom: 0,
    marginTop: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
});

export default LoginServiceButton;