import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/colors';
import { baseStyles } from '@/styles/base_styles';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useSettings } from '@/contexts/settingsContext';

interface AddAreaModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string, action: string, reaction: string) => void;
}

export const AddAreaModal = ({ visible, onClose, onAdd }: AddAreaModalProps) => {
  const [selectedAction, setSelectedAction] = useState('discord');
  const [selectedReaction, setSelectedReaction] = useState('github');
  const [title, setTitle] = useState('');
  const { fontSize, letterSpacing } = useSettings();

  const handleAdd = () => {
    onAdd(title, selectedAction, selectedReaction);
    onClose();
  };

  return (
    <Modal
      visible={visible} transparent animationType="slide"
      accessible={true}
      accessibilityLabel="Modale d'ajout d'AREA"
      accessibilityRole="alert"
    >
      <View
        style={styles.overlay}
        accessible={true}
        accessibilityRole="none"
      >
        <View
          style={styles.modal}
          accessible={true}
          accessibilityRole="none"
        >
          <TouchableOpacity
            onPress={onClose} style={styles.closeButton}
            accessible={true}
            accessibilityLabel="Fermer"
            accessibilityHint="Double tapez pour fermer la modale"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[baseStyles.title, styles.modalTitle, { fontSize, letterSpacing }]}>
            Ajouter un AREA
          </Text>

          <TextInput
            style={[baseStyles.input, { fontSize: fontSize - 2 }]}
            placeholder="Nom de l'AREA"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={colors.text}
            accessible={true}
            accessibilityLabel="Titre de l'AREA"
            accessibilityHint="Entrez un titre pour votre AREA"
            accessibilityRole="none"
          />

          <View style={styles.section}>
            <Text style={[styles.label, { fontSize: fontSize - 2, letterSpacing }]}>Action</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedAction}
                onValueChange={setSelectedAction}
                style={[{ color: colors.text, fontSize: fontSize - 2 }]}
                accessible={true}
                accessibilityLabel="Sélection de l'action"
                accessibilityHint="Choisissez l'action déclencheur"
                accessibilityRole="combobox"
              >
                <Picker.Item label="GitHub" value="github" />
                <Picker.Item label="Discord" value="discord" />
                <Picker.Item label="Telegram" value="telegram" />
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { fontSize: fontSize - 2, letterSpacing }]}>Réaction</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedReaction}
                onValueChange={setSelectedReaction}
                style={[{ color: colors.text, fontSize: fontSize - 2 }]}
                accessible={true}
                accessibilityLabel="Sélection de la réaction"
                accessibilityHint="Choisissez la réaction à déclencher"
                accessibilityRole="combobox"
              >
                <Picker.Item label="GitHub" value="github" />
                <Picker.Item label="Discord" value="discord" />
                <Picker.Item label="Telegram" value="telegram" />
              </Picker>
            </View>
          </View>
          
          <TouchableOpacity
            style={baseStyles.button} onPress={handleAdd}
            accessible={true}
            accessibilityLabel="Ajouter l'AREA"
            accessibilityHint="Double tapez pour créer l'AREA"
            accessibilityRole="button"
          >
            <Text style={[baseStyles.buttonText, { fontSize: fontSize - 2, letterSpacing }]}>
              Ajouter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    color: colors.text,
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: colors.input,
    borderRadius: 12,
  },
});