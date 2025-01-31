import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useEffect, useState } from "react";
import { baseStyles } from "@/styles/baseStyles";
import { AddAreaModal } from "@/components/modals/addArea";
import { Area } from "@/components/area";
import { useSettings } from "@/contexts/settingsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { actionsMap, reactionMap } from "@/utils/areaMap";

interface AreaType {
  id: number;
  nomArea: string;
  action: string;
  reaction: string;
}

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [areas, setAreas] = useState<AreaType[]>([]);
  const { fontSize, letterSpacing } = useSettings();

  useEffect(() => {
    const fetchAreas = async () => {
      const apiUrl = await AsyncStorage.getItem("API_URL");
      const email = await AsyncStorage.getItem("USER_EMAIL");

      try {
        const response = await fetch(`${apiUrl}/api/getArea/${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const formattedAreas = data.areas.map((aera: { nomArea: string; action: keyof typeof actionsMap; reaction: keyof typeof reactionMap }, index: number) => ({
            id: index,
            nomArea: aera.nomArea,
            action: actionsMap[aera.action],
            reaction: reactionMap[aera.reaction],
          }));

          setAreas(formattedAreas);
        } else {
          const errorData = await response.json();
          const info = errorData.message || response.statusText;
          Alert.alert("Erreur", info);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAreas();
  }, []);

  const handleAddArea = (nomArea: string, action: string, reaction: string) => {
    const newArea = {
      id: Date.now(),
      nomArea,
      action,
      reaction,
    };
    setAreas([...areas, newArea]);
    setModalVisible(false);
  };

  const handleDeleteArea = (id: number) => {
    setAreas(areas.filter(area => area.id !== id));
  };

  return (
    <View 
      style={baseStyles.container}
      accessible={true}
      accessibilityLabel="Page d'accueil AREA"
    >
      <Text
        style={[baseStyles.title, { fontSize, letterSpacing }]}
        accessible={true}
        accessibilityLabel="AREA"
        accessibilityRole="header"
      >
        AREA
      </Text>
      <Text
        style={[baseStyles.subtitle, { fontSize: fontSize - 2, letterSpacing }]}
        accessible={true}
        accessibilityLabel="Gérez vos intégrations et automatisez vos tâches"
        accessibilityRole="text"
      >
        Gérez vos intégrations et automatisez vos tâches
      </Text>
      
      <TouchableOpacity 
        style={baseStyles.button}
        onPress={() => setModalVisible(true)}
        accessible={true}
        accessibilityLabel="Ajouter une nouvelle AREA"
        accessibilityHint="Double tapez pour ajouter une nouvelle automatisation"
        accessibilityRole="button"
      >
        <Text style={[baseStyles.buttonText, { fontSize: fontSize - 2, letterSpacing }]}>
          Créer une automatisation
        </Text>
      </TouchableOpacity>

      <ScrollView style={{ width: '100%' }}>
        {areas.map((area) => (
          <Area 
            key={area.id}
            title={area.nomArea}
            action={area.action}
            reaction={area.reaction}
            onDelete={() => handleDeleteArea(area.id)}
            fontSize={fontSize}
            letterSpacing={letterSpacing}
          />
        ))}
      </ScrollView>

      <AddAreaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddArea}
      />
    </View>
  );
}