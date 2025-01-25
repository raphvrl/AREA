import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/colors';
import { useState } from 'react';

interface AreaProps {
  title: string;
  action: string;
  reaction: string;
  onDelete?: () => void;
  fontSize: number;
  letterSpacing: number;
}

export const Area = ({
  title,
  action,
  reaction,
  onDelete,
  fontSize,
  letterSpacing
}: AreaProps) => {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.title, { fontSize, letterSpacing }]}>{title}</Text>
          
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            trackColor={{ false: colors.text, true: colors.button }}
          />
        </View>

        <View style={styles.box}>
          <Text style={[styles.text, { fontSize: fontSize - 2, letterSpacing }]}>{action}</Text>
        </View>
        
        <Ionicons 
          name="arrow-down" 
          size={24} 
          color={colors.text}
          style={styles.arrow}
        />
        
        <View style={styles.box}>
          <Text style={[styles.text, { fontSize: fontSize - 2, letterSpacing }]}>{reaction}</Text>
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