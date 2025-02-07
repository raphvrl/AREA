import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { baseStyles } from '@/styles/baseStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/styles/colors';
import { router } from 'expo-router';

interface ServiceButtonProps {
  text: string;
  color: string;
  iconName: string;
  iconType: 'Ionicons' | 'FontAwesome' | 'MaterialCommunityIcons' | 'Notion-logo';
  apiUrl: string;
  redirectUri: string;
  fontSize: number;
}

const LoginServiceButton: React.FC<ServiceButtonProps> = ({
  text,
  color,
  iconName,
  iconType,
  apiUrl, 
  redirectUri,
  fontSize,
}) => {
  const IconComponent = iconType === 'Ionicons' ? Ionicons : FontAwesome;

  const handlePress = async () => {
    const userEmail = 'jonh.doe@email.com';
    const url = `${apiUrl}?email=${encodeURIComponent(userEmail)}&redirectUri=${encodeURIComponent(redirectUri)}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Erreur", `Impossible de se connecter à ${text}`);
    }
  };

  const getIcon = () => {
    switch (iconType) {
      case 'Ionicons':
        return <Ionicons name={iconName} size={24} color="white" style={styles.buttonIcon} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={iconName} size={24} color="white" style={styles.buttonIcon} />;
      case 'FontAwesome':
        return <FontAwesome name={iconName} size={24} color="white" style={styles.buttonIcon} />;
      case 'Notion-logo':
        return <Image source={require('@/assets/images/notion-logo.png')} style={[
          styles.buttonIcon,
          { width: 24, height: 24 },
        ]} />;
      default:
        return null;
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
            {getIcon()}
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