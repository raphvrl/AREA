import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { baseStyles } from "@/styles/base_styles";
import { AddAreaModal } from "@/components/modals/addArea";
import { Area } from "@/components/area";
import { useSettings } from "@/contexts/settingsContext";

interface AreaType {
  id: number;
  title: string;
  action: string;
  reaction: string;
}

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [areas, setAreas] = useState<AreaType[]>([]);
  const { fontSize, letterSpacing } = useSettings();

  const handleAddArea = (title: string, action: string, reaction: string) => {
    const newArea = {
      id: Date.now(),
      title,
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
    <View style={baseStyles.container}>
      <Text style={[baseStyles.title, { fontSize, letterSpacing }]}>AREA</Text>
      <Text style={[baseStyles.subtitle, { fontSize: fontSize - 2, letterSpacing }]}>
        Gérez vos intégrations et automatisez vos tâches
      </Text>
      
      <TouchableOpacity 
        style={baseStyles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[baseStyles.buttonText, { fontSize: fontSize - 2, letterSpacing }]}>
          Créer une automatisation
        </Text>
      </TouchableOpacity>

      <ScrollView style={{ width: '100%' }}>
        {areas.map((area) => (
          <Area 
            key={area.id}
            title={area.title}
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