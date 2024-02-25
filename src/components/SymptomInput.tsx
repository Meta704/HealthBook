import React, { useEffect, useState } from 'react';
import { TextInput, Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

import { colors } from '../utils/theme';
import CheckBox from '@react-native-community/checkbox';
import symptomsData from '../data/symptoms.json';
import Methods from '../utils/methods';

interface SymptomInputProps {
  onUpdate: (symptoms: string[]) => void;
  preState?: string[];
}

const SymptomInput: React.FC<SymptomInputProps> = ({ onUpdate, preState }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(preState || []);
  const [searchQuery, setSearchQuery] = useState('');
  const { symptoms } = symptomsData;

  useEffect(() => {
    if (preState) {
        setSelectedSymptoms(preState);
    }
}, [preState]);


  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const toggleSymptom = (symptom: string) => {
    const isSelected = selectedSymptoms.includes(symptom);
    let updatedSymptoms: string[] = [];
    if (isSelected) {
      updatedSymptoms = selectedSymptoms.filter(item => item !== symptom);
    } else {
      updatedSymptoms = [...selectedSymptoms, symptom];
    }
    setSelectedSymptoms(updatedSymptoms);
    onUpdate(updatedSymptoms);
  };

  const filteredSymptoms = symptoms.filter((symptom) =>
    symptom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      <TouchableOpacity style={styles.inputContainer} onPress={openModal}>
        <TextInput
          style={styles.inputInit}
          placeholder="Symptoms"
          placeholderTextColor={colors.placeholder}
          value={selectedSymptoms.join('\n')}
          editable={false}
          multiline={true}
        />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search symptoms"
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Text style={styles.modalTitle}>Select Symptoms</Text>
            <FlatList
              data={filteredSymptoms}
              renderItem={({ item }) => (
                <View key={item}>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      value={selectedSymptoms.includes(item)}
                      onValueChange={() => toggleSymptom(item)}
                      tintColors={{ true: colors.theme_color_1, false: colors.dataText }}
                    />
                    <Text style={styles.symptomItem}>{item}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputInit: {
    paddingHorizontal: 10,
    color: colors.dataText,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    color: '#000',
    textAlignVertical: 'center',
  },
  inputContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.placeholder,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backlight,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.dataText
  },
  searchInput: {
    height: 40,
    borderColor: colors.placeholder,
    color: colors.dataText,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symptomItem: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.theme_color_2,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: Methods.getContrastColor(colors.theme_color_2),
  },
});

export default SymptomInput;
