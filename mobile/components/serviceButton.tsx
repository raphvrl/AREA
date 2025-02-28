import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { baseStyles } from '@/styles/baseStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/styles/colors';

interface ServiceButtonProps {
  text: string;
  color: string;
  iconName: string;
  iconType: 'Ionicons' | 'FontAwesome' | 'MaterialCommunityIcons' | 'Notion-logo';
  apiUrl: string;
  redirectUri: string;
  userEmail: string;
  fontSize: number;
  onServiceUpdate?: () => void;
  isActive?: boolean;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({
  text,
  color,
  iconName,
  iconType,
  apiUrl, 
  redirectUri,
  userEmail,
  fontSize,
  onServiceUpdate,
  isActive,
}) => {
  const IconComponent = iconType === 'Ionicons' ? Ionicons : FontAwesome;

  const handleConnect = async () => {
    const url = `${apiUrl}?email=${encodeURIComponent(userEmail)}&redirectUri=${encodeURIComponent(redirectUri)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Erreur", `Impossible de se connecter à ${text}`);
    }
  }

  const handleDisconnect = async () => {
    const url = await AsyncStorage.getItem('API_URL');

    try {
      const response = await fetch(`${url}/api/logoutService`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nameService: text.toLowerCase(),
          email: userEmail,
        }),
      });

      if (response.ok) {
        Alert.alert('Déconnexion réussie', `Vous êtes maintenant déconnecté de ${text}`);
        if (onServiceUpdate) {
          onServiceUpdate();
        }
      } else {
        Alert.alert('Erreur', `Impossible de se déconnecter de ${text}`);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  const handlePress = async () => {
    if (isActive) {
      await handleDisconnect();
    } else {
      await handleConnect();
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
      <View style={styles.greyBox}>
        <View style={[styles.statusLed, { backgroundColor: isActive ? '#4CAF50' : '#FF0000' }]} />
        <TouchableOpacity 
          style={[baseStyles.button, styles.serviceButton, { backgroundColor: color }]}
          onPress={handlePress}
          accessible={true}
          accessibilityLabel={isActive ? `Déconnecter ${text}` : `Connecter ${text}`}
          accessibilityRole="button"
        >
          <View style={styles.buttonContent}>
            {getIcon()}
            <Text style={[baseStyles.buttonText, { fontSize }]}>
              {isActive ? `Déconnecter ${text}` : `Connecter ${text}`}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
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

export default ServiceButton;