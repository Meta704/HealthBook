import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../utils/theme';
import CheckBox from '@react-native-community/checkbox';
import { HealthLog, Treatment } from '../data/interfaces';
import Methods from '../utils/methods';

interface WhatHelpedProps {
    healthLog: HealthLog;
    onUpdate: (updatedWhatHelped: Treatment[]) => void;
}

const WhatHelped: React.FC<WhatHelpedProps> = ({ healthLog, onUpdate }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Treatment[]>(healthLog.whatHelped || []);

    useEffect(() => {
        const updatedSelectedItems = selectedItems.filter(item =>
            healthLog.treatments.some(treatment => treatment.treatmentID === item.treatmentID)
        );
    
        if (!arraysEqual(updatedSelectedItems, selectedItems)) {
            setSelectedItems(updatedSelectedItems);
            onUpdate(updatedSelectedItems);
        }
    }, [healthLog, selectedItems]);

    function arraysEqual(a: any[], b: any[]) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
    
        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
    
        return true;
    }

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const toggleSelection = (treatment: Treatment) => {
        const isSelected = selectedItems.some(item => item.treatmentID === treatment.treatmentID);
        const updatedSelectedItems = isSelected
            ? selectedItems.filter(selectedItem => selectedItem.treatmentID !== treatment.treatmentID)
            : [...selectedItems, treatment];
        setSelectedItems(updatedSelectedItems);
        onUpdate(updatedSelectedItems);
    };

    const renderTreatmentName = (treatment: Treatment) => {
        return treatment.treatmentName;
    };

    return (
        <View>
            <TouchableOpacity style={styles.inputContainer} onPress={openModal}>
                <TextInput
                    style={styles.inputInit}
                    placeholder="What Helped?"
                    placeholderTextColor={colors.placeholder}
                    value={selectedItems.map(renderTreatmentName).join('\n')}
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
                        {healthLog.treatments.length > 0 ? ( // Check if treatments are available
                            <>
                                <Text style={styles.modalTitle}>Which ones helped you?</Text>
                                <FlatList
                                    data={healthLog.treatments}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => toggleSelection(item)} style={styles.checkboxContainer}>
                                            <CheckBox
                                                value={selectedItems.some(selectedItem => selectedItem.treatmentID === item.treatmentID)}
                                                onValueChange={() => toggleSelection(item)}
                                                tintColors={{ true: colors.theme_color_1, false: colors.dataText }}
                                            />
                                            <Text style={styles.item}>{renderTreatmentName(item)}</Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </>
                        ) : (
                            <View style={styles.messageContainer}>
                                <Text style={styles.noTreatmentText}>There are no treatments to choose from.</Text>
                                <Text style={styles.noTreatmentText}>After you input the treatments you had, you can choose which one was helpful.</Text>
                            </View>
                        )}
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default WhatHelped;

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.placeholder,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    inputInit: {
        paddingHorizontal: 10,
        color: colors.dataText,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backlight,
    },
    modalContent: {
        backgroundColor: colors.baseColor,
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.dataText,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    item: {
        fontSize: 16,
        marginBottom: 5,
        color: colors.dataText
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        backgroundColor: colors.theme_color_2,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: Methods.getContrastColor(colors.theme_color_2),
    },
    messageContainer: {
        width: '100%',
        textAlign: 'center'
    },
    noTreatmentText: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 20,
        color: colors.dataText,
    },
});
