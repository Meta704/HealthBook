import React, { useEffect, useState } from 'react';
import { Modal, Alert, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../utils/theme';
import Methods from '../utils/methods';
import { Treatment } from '../data/interfaces';

interface TreatmentInputProps {
    onUpdate: (treatment: Treatment[]) => void;
    preState?: Treatment[];
}

const TreatmentInput: React.FC<TreatmentInputProps> = ({ onUpdate, preState }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [treatmentName, settreatmentName] = useState('');
    const [amount, setAmount] = useState('');
    const [amountUnit, setAmountUnit] = useState('mg');
    const [frequencyValue, setFrequencyValue] = useState('');
    const [frequencyUnit, setFrequencyUnit] = useState('Day');
    const [durationValue, setDurationValue] = useState('');
    const [durationUnit, setDurationUnit] = useState('days');
    const [isOnceSelected, setIsOnceSelected] = useState(false);
    const [checkALAIT, setCheckALAIT] = useState(false);
    const [treatments, setTreatments] = useState<Treatment[]>(preState || []);

    useEffect(() => {
        if (preState) {
            setTreatments(preState);
        }
    }, [preState]);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleAddTreatment = () => {
        if (treatmentName.trim() === '') {
            Methods.playAudio('error');
            Alert.alert("Hold on...", "A new treatment must have a name.", [{ text: "Got it" }]);
            return;
        }

        if (amount.trim() === '' || frequencyValue.trim() === '' || 
            (!isOnceSelected && (amount.trim() === ''))) {
            Methods.playAudio('error');
            Alert.alert("Hold on...", "Please fill in all the fields.", [{ text: "Got it" }]);
            return;
    }

        const newTreatmentObj: Treatment = {
            treatmentID: "TRT" + Methods.generateUniqueLogID(),
            treatmentName,
            amount,
            amountUnit,
            frequencyValue,
            frequencyUnit,
            durationValue,
            durationUnit
        };
        
        const updatedTreatments = [...treatments, newTreatmentObj];
        setTreatments(updatedTreatments);
        onUpdate(updatedTreatments);
        settreatmentName('');
        setAmount('');
        setFrequencyValue('');
        setDurationValue('');
        setModalVisible(false);
    };

    const handleDeleteTreatment = (treatmentId: string) => {
        const updatedTreatments = treatments.filter(treatment => treatment.treatmentID !== treatmentId);
        setTreatments(updatedTreatments);
        onUpdate(updatedTreatments);
        console.log(Methods.colorizeLog("yellow","Size of Treatments is: "+treatments.length));
    };

    return (
        <View>
            <TouchableOpacity style={styles.inputContainer} onPress={openModal}>
                {/* Treatments list */}
                {treatments.length > 0 ? (
                    treatments.map(treatment => (
                        <View key={treatment.treatmentID} style={styles.rowContainer}>
                            <TextInput
                                style={styles.inputInit}
                                placeholder="Treatments"
                                placeholderTextColor={colors.placeholder}
                                value={
                                    treatment.frequencyUnit === 'once'
                                        ? `${treatment.treatmentName} ${treatment.amount} ${treatment.amountUnit} | ${treatment.frequencyValue} taken ${treatment.frequencyUnit}`
                                        : `${treatment.treatmentName} ${treatment.amount} ${treatment.amountUnit} | ${treatment.frequencyValue} ${treatment.frequencyUnit} | ${treatment.durationValue || "for"} ${treatment.durationUnit}`
                                }
                                editable={false}
                                multiline={true}
                            />
                            {/* Delete icon */}
                            <TouchableOpacity onPress={() => handleDeleteTreatment(treatment.treatmentID)} style={styles.deleteButton}>
                                <Icon name="delete" size={20} color={colors.warning} />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <TextInput
                        style={[styles.inputInit, {height: 50}]}
                        placeholder="Treatments"
                        placeholderTextColor={colors.placeholder}
                        value={''}
                        editable={false}
                        multiline={true}
                    />
                )}
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Treatment</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Treatment/Medication Name"
                            placeholderTextColor={colors.placeholder}
                            value={treatmentName}
                            onChangeText={settreatmentName}
                        />
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Dosage"
                                placeholderTextColor={colors.placeholder}
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={amountUnit}
                                    itemStyle={styles.pickerItem}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => setAmountUnit(itemValue)}>
                                    <Picker.Item label="mg" value="mg" />
                                    <Picker.Item label="ml" value="ml" />
                                    <Picker.Item label="g" value="g" />
                                    <Picker.Item label="tbsp(s)" value="tbsp(s)" />
                                    <Picker.Item label="unit(s)" value="unit(s)" />
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.inputRow}>
                            <Text style={styles.dataText}>Taken</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Times"
                                placeholderTextColor={colors.placeholder}
                                keyboardType="numeric"
                                value={frequencyValue}
                                onChangeText={setFrequencyValue}
                            />
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={frequencyUnit}
                                    style={styles.picker}
                                    itemStyle={{ color: colors.dataText }}
                                    onValueChange={(itemValue) => {
                                        setFrequencyUnit(itemValue);
                                        setIsOnceSelected(itemValue === 'once');
                                    }}>
                                    <Picker.Item label="per day" value="per day" />
                                    <Picker.Item label="per week" value="per week" />
                                    <Picker.Item label="per month" value="per month" />
                                    <Picker.Item label="once" value="once" />
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.inputRow}>
                            <Text style={styles.dataText}>For</Text>
                            <TextInput
                                style={[styles.input, (checkALAIT || isOnceSelected) && styles.disabledInput]}
                                placeholder="Duration"
                                placeholderTextColor={colors.placeholder}
                                keyboardType="numeric"
                                value={durationValue}
                                onChangeText={setDurationValue}
                                editable={!isOnceSelected && !checkALAIT}
                            />
                            <View style={[styles.pickerContainer, isOnceSelected && styles.disabledContainer]}>
                                <Picker
                                    selectedValue={durationUnit}
                                    style={[styles.picker, isOnceSelected && styles.disabledPicker]}
                                    itemStyle={{ color: colors.dataText }}
                                    enabled={!isOnceSelected}
                                    onValueChange={(itemValue) => {
                                        setDurationUnit(itemValue);
                                        setCheckALAIT(itemValue === 'ALAIT');
                                    }}>
                                    <Picker.Item label="days" value="days" />
                                    <Picker.Item label="weeks" value="weeks" />
                                    <Picker.Item label="months" value="months" />
                                    <Picker.Item label="ALAIT" value="ALAIT" />
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleAddTreatment} style={styles.addButton}>
                                <Text style={styles.buttonText}>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TreatmentInput;

const styles = StyleSheet.create({
    inputInit: {
        paddingHorizontal: 10,
        color: colors.dataText,
        height: 40,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        marginRight: 10,
        textAlignVertical: 'center',
        borderWidth: 1,
        borderRadius: 5,
        color: colors.dataText,
        borderColor: colors.placeholder
    },
    inputContainer: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.placeholder,
        justifyContent: 'center',
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
        width: '90%',
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.dataText
    },
    dataText: {
        fontSize: 16,
        marginBottom: 10,
        marginRight: 10,
        color: colors.dataText
    },
    modalInput: {
        height: 40,
        borderColor: colors.placeholder,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: colors.dataText,
    },
    disabledContainer: {
        backgroundColor: colors.disabled,
    },
    disabledInput: {
        backgroundColor: colors.disabled,
        color: colors.placeholder,
    },
    disabledPicker: {
        color: colors.placeholder,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    deleteButton: {
        marginRight: 5,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    pickerContainer: {
        borderColor: colors.placeholder,
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        width: '50%',
        justifyContent: 'space-around',
    },
    picker: {
        height: 40,
        width: '100%',
        color: colors.dataText,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.placeholder,
    },
    pickerItem: {
        color: colors.dataText,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
    addButton: {
        flex: 1,
        marginRight: 5,
        paddingVertical: 10,
        backgroundColor: colors.theme_color_2,
        borderRadius: 5,
        alignItems: 'center',
    },
    cancelButton: {
        marginLeft: 5,
        paddingVertical: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
        alignItems: 'center',
        width: '40%',
    },
    buttonText: {
        fontSize: 16,
        color: Methods.getContrastColor(colors.theme_color_2),
    },
});

