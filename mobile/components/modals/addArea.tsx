import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { baseStyles } from "@/styles/baseStyles";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useSettings } from "@/contexts/settingsContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { actionsMap, reactionMap } from "@/utils/areaMap";

interface AddAreaModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string, action: string, reaction: string) => void;
}

interface AddAreaInfo {
  emailUser: string;
  nomArea: string;
  action: string;
  reaction: string;
};

export const AddAreaModal = ({
  visible,
  onClose,
  onAdd,
}: AddAreaModalProps) => {
  const [selectedAction, setSelectedAction] = useState<keyof typeof actionsMap>("repoCreated_github");
  const [selectedReaction, setSelectedReaction] = useState<keyof typeof reactionMap>("sendMessage_telegram");
  const [title, setTitle] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const { fontSize, letterSpacing } = useSettings();

  useEffect(() => {
    const fetchUserData = async () => {
      const email = await AsyncStorage.getItem("USER_EMAIL");
      setEmailUser(email || "");
    };

    fetchUserData();
  }, [visible]);

  const handleAdd = async () => {
    const areaInfo : AddAreaInfo = {
      emailUser: emailUser,
      nomArea: title,
      action: selectedAction,
      reaction: selectedReaction,
    };

    console.log(areaInfo);
    
    const apiUrl = await AsyncStorage.getItem("API_URL");

    try {
      const response = await fetch(`${apiUrl}/api/setArea`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(areaInfo),
      });

      if (response.ok) {
        const action = actionsMap[selectedAction];
        const reaction = reactionMap[selectedReaction];

        onAdd(title, action, reaction);
        onClose();
      } else {
        const errorData = await response.json();
        const info = errorData.message || response.statusText
        Alert.alert('Error:', info);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      accessible={true}
      accessibilityLabel="Modale d'ajout d'AREA"
      accessibilityRole="alert"
    >
      <View style={styles.overlay} accessible={true} accessibilityRole="none">
        <View style={styles.modal} accessible={true} accessibilityRole="none">
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessible={true}
            accessibilityLabel="Fermer"
            accessibilityHint="Double tapez pour fermer la modale"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text
            style={[
              baseStyles.title,
              styles.modalTitle,
              { fontSize, letterSpacing },
            ]}
          >
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
            <Text
              style={[styles.label, { fontSize: fontSize - 2, letterSpacing }]}
            >
              Action
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedAction}
                onValueChange={(value) => setSelectedAction(value)}
                style={[{ color: colors.text, fontSize: fontSize - 2 }]}
                accessible={true}
                accessibilityLabel="Sélection de l'action"
                accessibilityHint="Choisissez l'action déclencheur"
                accessibilityRole="combobox"
              >
                {Object.entries(actionsMap).map(([value, label]) => (
                  <Picker.Item key={value} label={label} value={value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.label, { fontSize: fontSize - 2, letterSpacing }]}
            >
              Réaction
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedReaction}
                onValueChange={(value) => setSelectedReaction(value)}
                style={[{ color: colors.text, fontSize: fontSize - 2 }]}
                accessible={true}
                accessibilityLabel="Sélection de la réaction"
                accessibilityHint="Choisissez la réaction à déclencher"
                accessibilityRole="combobox"
              >
                {Object.entries(reactionMap).map(([value, label]) => (
                  <Picker.Item key={value} label={label} value={value} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={baseStyles.button}
            onPress={handleAdd}
            accessible={true}
            accessibilityLabel="Ajouter l'AREA"
            accessibilityHint="Double tapez pour créer l'AREA"
            accessibilityRole="button"
          >
            <Text
              style={[
                baseStyles.buttonText,
                { fontSize: fontSize - 2, letterSpacing },
              ]}
            >
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 12,
  },
  closeButton: {
    position: "absolute",
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
