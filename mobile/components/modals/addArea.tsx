import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
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
  option_reaction?: string
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
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isReactionOpen, setIsReactionOpen] = useState(false);
  const [reactionOption, setReactionOption] = useState("");
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
      option_reaction: reactionOption
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

  const handleSectionToggle = (section: 'action' | 'reaction') => {
    if (section === 'action') {
      setIsActionOpen(!isActionOpen);
      setIsReactionOpen(false);
    } else {
      setIsReactionOpen(!isReactionOpen);
      setIsActionOpen(false);
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
            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.collapsibleHeader}
                onPress={() => handleSectionToggle('action')}
              >
                <Text style={[styles.label, { fontSize: fontSize - 2, letterSpacing }]}>
                  Action: {actionsMap[selectedAction]}
                </Text>
                <Ionicons 
                  name={isActionOpen ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={colors.text} 
                />
              </TouchableOpacity>
              
              {isActionOpen && (
                <ScrollView style={styles.optionsContainer}>
                  {Object.entries(actionsMap).map(([value, label]) => (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.optionButton,
                        selectedAction === value && styles.selectedOption
                      ]}
                      onPress={() => {
                        setSelectedAction(value as keyof typeof actionsMap);
                      }}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedAction === value && styles.selectedOptionText
                      ]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
          <View style={styles.section}>
            <Text
              style={[styles.label, { fontSize: fontSize - 2, letterSpacing }]}
            >
              Réaction
            </Text>
              <View style={styles.section}>
                <TouchableOpacity 
                  style={styles.collapsibleHeader}
                  onPress={() => handleSectionToggle('reaction')}
                >
                  <Text style={[styles.label, { fontSize: fontSize - 2, letterSpacing }]}>
                    Réaction: {reactionMap[selectedReaction]}
                  </Text>
                  <Ionicons 
                    name={isReactionOpen ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color={colors.text} 
                  />
                </TouchableOpacity>
                
                {isReactionOpen && (
                  <ScrollView style={styles.optionsContainer}>
                    {Object.entries(reactionMap).map(([value, label]) => (
                      <TouchableOpacity
                        key={value}
                        style={[
                          styles.optionButton,
                          selectedReaction === value && styles.selectedOption
                        ]}
                        onPress={() => {
                          setSelectedReaction(value as keyof typeof reactionMap);
                        }}
                      >
                        <Text style={[
                          styles.optionText,
                          selectedReaction === value && styles.selectedOptionText
                        ]}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
                {isReactionOpen && (
                  <TextInput
                    style={[styles.optionInput, { fontSize: fontSize - 2 }]}
                    placeholder="Option pour la réaction"
                    value={reactionOption}
                    onChangeText={setReactionOption}
                    placeholderTextColor={colors.text}
                  />
                )}
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
  optionsContainer: {
    maxHeight: 200,
    marginTop: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginBottom: 5,
  },
  optionText: {
    color: colors.text,
  },
  selectedOption: {
    backgroundColor: colors.input,
  },
  selectedOptionText: {
    color: colors.text,
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionInput: {
    backgroundColor: colors.input,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    color: colors.text,
  },
});
