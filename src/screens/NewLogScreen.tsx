import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableHighlight,
    Alert,
    Modal,
    ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary, CameraOptions } from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker'
import { colors, dimensions } from '../utils/theme';
import Methods from '../utils/methods';
import SymptomInput from '../components/SymptomInput';
import TreatmentInput from '../components/TreatmentInput';
import WhatHelped from '../components/WhatHelped';
import { HealthLog, Treatment } from '../data/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { addHealthLog, editHealthLog } from '../redux/healthLogSlice';

// @ts-ignore
import imagePlaceholder from '../assets/image_placeholder.png';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/navContainer';
import { RootState } from '../redux/store';

type NewLogScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NewLogScreen'>;
interface HomeScreenProps {
    navigation: NewLogScreenNavigationProp;
    route?: any;
}

const HealthLogScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
    const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
    const [selectedButton, setSelectedButton] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [showOptionsModal, setShowOptionsModal] = React.useState(false);
    const [healthLog, setHealthLog] = useState<HealthLog>(route.params ? { ...route.params.log } : {
        id: Methods.generateUniqueLogID(),
        title: '',
        dateStarted: null,
        dateEnded: null,
        lastEdit: null,
        ongoing: false,
        symptoms: [],
        treatments: [],
        whatHelped: [],
        notes: '',
        images: [],
        isPinned: false,
    });
    const today = new Date();
    const editMode = !!route.params;
    const buttonColor = isValid ? colors.theme_color_1 : colors.placeholder;
    const dateFormat = useSelector((state: RootState) => state.settings.settings.dateFormat);
    const dispatch = useDispatch();

    // Dynamically set the validation status for the form
    useEffect(() => {
        setIsValid(healthLog.symptoms?.length > 0 || !!healthLog.notes);
    }, [healthLog.symptoms, healthLog.notes]);

    // Update Title
    const handleTitleChange = (text: string) => {
        setHealthLog(prevState => ({
            ...prevState,
            title: text,
        }));
    };

    // Update Date Started
    const handleDateStartedChange = (datePicked: number | null) => {
        setHealthLog(prevState => ({
            ...prevState,
            dateStarted: datePicked,
        }));
    };
    
    // Update Date Ended
    const handleDateEndedChange = (datePicked: number | null) => {
        setHealthLog(prevState => ({
            ...prevState, 
            dateEnded: datePicked,
        }));
    };

    // Update Ongoing Checkbox
    const handleOngoingChange = (checked: boolean) => {
        setHealthLog(prevState => ({
            ...prevState,
            ongoing: checked,
            dateEnded: checked ? null : prevState.dateEnded,
        }));
    };

    // Update Notes
    const handleNotesChange = (text: string) => {
        setHealthLog(prevState => ({
            ...prevState,
            notes: text,
        }));
    };

    // Update Symptoms
    const handleSymptomsChange = (symptoms: string[]) => {
        setHealthLog(prevState => ({
            ...prevState, 
            symptoms,
        }));
    };

    // Update Treatments
    const handleTreatmentChange = (treatments: Treatment[]) => {
        setHealthLog(prevState => ({
            ...prevState,
            treatments: treatments,
        }));
    };

    // Update What Helped
    const handleWhatHelpedChange = (updatedTreatments: Treatment[]) => {
        setHealthLog(prevState => ({
            ...prevState,
            whatHelped: updatedTreatments,
        }));
    };

    // Update Uploaded Images
    const handleUploadedImagesChange = (images: string[]) => {
        setHealthLog(prevState => ({
            ...prevState,
            images,
        }));
    };

    // Update Last Edited timestamp and continue to submit
    const updateLastEditTimestampAndContinue = () => {
        setHealthLog(prevState => ({
            ...prevState, 
            lastEdit: Methods.dateToTimestamp(today),
        }));
        submitLog();
    };

    // Open Image 
    const openImageModal = (index: number) => {
        setSelectedImageIndex(index);
        setShowModal(true);
    };

    // Close Image
    const closeImageModal = () => {
        setShowModal(false);
        setSelectedImageIndex(null);
    };

    // Date Picker Confirmation
    const handleDatePickerConfirm = (datePicked: Date) => {
        setIsOpenDatePicker(false);
        if (selectedButton === 'start') {
            // handleDateStartedChange(Methods.dateToTimestamp(datePicked));
            setHealthLog(prevState => ({
                ...prevState,
                dateStarted: Methods.dateToTimestamp(datePicked),
            }));
        } else if (selectedButton === 'end') {
            // handleDateEndedChange(Methods.dateToTimestamp(datePicked));
            setHealthLog(prevState => ({
                ...prevState,
                dateEnded: Methods.dateToTimestamp(datePicked),
            }));
        }
    };
    
    // Open Date Picker
    const openDatePicker = (button: string) => {
        setIsOpenDatePicker(true);
        setSelectedButton(button);
    };

    // Close Date Picker
    const closeDatePicker = () => {
        setIsOpenDatePicker(false);
    };

    // Name Validation
    const titleSetup = () => {
        let logTitle = healthLog.title;
        if (!logTitle) {
            const currentDate = new Date();
            logTitle = currentDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) +
            ' @ ' + currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            handleTitleChange(logTitle);
            Methods.playAudio('error');
            Alert.alert(
                'Log name generated 😊',
                `The form log was generated automatically to be:\n\n` + logTitle + "\n\nYou can still change it if you wish to.",
                [
                    {
                        text: 'CONTINUE',
                        style: 'cancel',
                    },
                ]
            );
        }
    }

    // Date Validation
    const dateValidation = (): boolean => {
        if (healthLog.dateStarted && healthLog.dateEnded && (healthLog.dateEnded < healthLog.dateStarted)) {
            Methods.playAudio('error');
            Alert.alert(
                'Invalid Date Range',
                `Seems like you confused the dates.\n\nStarted:  ${Methods.getDateStringFromTimestamp(healthLog.dateStarted, dateFormat)} \nEnded:    ${Methods.getDateStringFromTimestamp(healthLog.dateEnded, dateFormat)}`,
                [
                    {
                        text: 'Switch Range',
                        onPress: () => {
                            if (healthLog.dateStarted && healthLog.dateEnded) {
                                let tempDate = healthLog.dateStarted;
                                handleDateStartedChange(healthLog.dateEnded);
                                handleDateEndedChange(tempDate);
                            }
                        },
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                ]
            );
            return false;
        }
        return true;
    };

    // Form validation
    const isFormValid = (): boolean => {
        if (!isValid) {
            Methods.playAudio('error');
            Alert.alert(
                'Invalid Form',
                `Either 'Symptoms' or the 'Notes' entry must be filled.`,
                [
                    {
                        text: 'Close',
                        style: 'cancel',
                    },
                ]
            );
            return false;
        }
        return true;
    };

    // Submit New Log
    const submitLog = () => {
        titleSetup();
        if (healthLog.title !== '') {
            if (!dateValidation() || !isFormValid()) return;
            console.log(Methods.colorizeLog("cyan", "ADDED NEW LOG DATA: \n" + JSON.stringify(healthLog, null, 2)));
            editMode ? dispatch(editHealthLog(healthLog)) : dispatch(addHealthLog(healthLog));
            Methods.playAudio('success');
            ToastAndroid.showWithGravity('New log created!', ToastAndroid.SHORT, ToastAndroid.CENTER);
            navigation.navigate('HealthJournal', { ...route.params, needsRefresh: true });
        } else return;
    };

    // Gallery Image upload
    const handleGalleryUpload = async () => {
        setShowOptionsModal(false);
        const options: CameraOptions = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image gallery');
            } else if (response.errorMessage) {
                console.log('Image gallery error: ', response.errorMessage);
            } else {
                let imageUri = response.assets?.[0]?.uri;
                if (imageUri) {
                    handleUploadedImagesChange([...healthLog.images, imageUri]);
                }
            }
        });
    };

    // Camera Image upload
    const handleCameraUpload = async () => {
        setShowOptionsModal(false);
        const options: CameraOptions = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorMessage) {
                console.log('Camera Error: ', response.errorMessage);
            } else {
                let imageUri = response.assets?.[0]?.uri;
                if (imageUri) {
                    handleUploadedImagesChange([...healthLog.images, imageUri]);
                }
            }
        });
    };

    // Image delete
    const handleDeleteImage = (index: number) => {
        const newImages = [...healthLog.images];
        newImages.splice(index, 1);
        handleUploadedImagesChange(newImages);
    };

    return (
        <View style={styles.infoContainer}>
            <ScrollView style={styles.container}>

                {/* LOG TITLE */}
                <TextInput
                    style={styles.input}
                    placeholder="Log Title"
                    value={healthLog.title}
                    onChangeText={handleTitleChange}
                    placeholderTextColor={colors.placeholder}
                />

                {/* DATES */}
                <View style={styles.rowContainer}>
                    <TouchableHighlight
                        style={styles.dateInput}
                        onPress={() => openDatePicker("start")}>
                        <Text style={[styles.dateText, !healthLog.dateStarted && styles.placeholderText]}>{healthLog.dateStarted ? Methods.getDateStringFromTimestamp(healthLog.dateStarted, dateFormat) : 'Date Started'}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[styles.dateInput, healthLog.ongoing && styles.disabledDateInput]}
                        onPress={() => openDatePicker("end")}
                        disabled={healthLog.ongoing}>
                        <Text style={[styles.dateText, healthLog.ongoing && styles.disabledDateInput, !healthLog.dateEnded && styles.placeholderText]}>
                            {healthLog.dateEnded ? Methods.getDateStringFromTimestamp(healthLog.dateEnded, dateFormat) : 'Date Ended'}
                        </Text>
                    </TouchableHighlight>
                    <DatePicker
                        modal
                        open={isOpenDatePicker}
                        date={today}
                        mode={"date"}
                        onConfirm={handleDatePickerConfirm}
                        onCancel={closeDatePicker}
                        maximumDate={today}
                    />
                    {/* ONGOING CHECKBOX */}
                    <View style={styles.rowContainer}>
                        <CheckBox
                            style={styles.checkbox}
                            value={healthLog.ongoing}
                            onValueChange={(newValue) => {
                                handleOngoingChange(newValue);
                                if (newValue) {
                                    handleDateEndedChange(null);
                                }
                            }}
                            tintColors={{ true: colors.theme_color_1, false: colors.dataText }}
                        />
                        <Text style={styles.checkboxLabel}>Ongoing</Text>
                    </View>
                </View>

                {/* DIVIDER */}
                <View style={styles.divider} />

                {/* SYMPTOMS */}
                <SymptomInput
                    onUpdate={handleSymptomsChange}
                    preState={healthLog.symptoms} />

                {/* TREATMENTS */}
                <TreatmentInput
                    onUpdate={handleTreatmentChange}
                    preState={healthLog.treatments} />

                {/* WHAT HELPED */}
                <WhatHelped
                    healthLog={healthLog}
                    onUpdate={handleWhatHelpedChange} />

                {/* NOTES */}
                <TextInput
                    style={[styles.notesInput, { height: 150 }]}
                    placeholder="Notes"
                    placeholderTextColor={colors.placeholder}
                    multiline
                    numberOfLines={5}
                    maxLength={500}
                    value={healthLog.notes}
                    onChangeText={handleNotesChange}
                />

                {/* IMAGES */}
                <View style={styles.imageContainer}>
                    {healthLog.images?.map((image, index) => (
                        <View key={index} style={{ position: 'relative' }}>
                            <TouchableHighlight key={index} onPress={() => openImageModal(index)}>
                                <Image
                                    source={{ uri: image }}
                                    style={[styles.image, { marginLeft: index === 0 ? 0 : 5 }]}
                                />
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={styles.deleteButton}
                                onPress={() => handleDeleteImage(index)}>
                                <Icon name="cancel" size={20} color={colors.warning} />
                            </TouchableHighlight>
                        </View>
                    ))}
                    {healthLog.images?.length < 5 && (
                        <TouchableHighlight
                            style={[styles.placeholderImageContainer, { backgroundColor: 'lightgray', marginLeft: healthLog.images.length === 0 ? 0 : 5 }]}
                            onPress={() => setShowOptionsModal(true)}>
                            <Image
                                source={imagePlaceholder}
                                style={styles.image} />
                        </TouchableHighlight>
                    )}
                </View>

                {/* OPTIONS MODAL */}
                <Modal
                    visible={showOptionsModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowOptionsModal(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableHighlight
                                style={styles.closeButton}
                                onPress={() => setShowOptionsModal(false)}>
                                <Icon name="cancel" size={28} color={colors.theme_color_1} />
                            </TouchableHighlight>
                            <Text style={styles.modalText}>Choose an option:</Text>
                            <TouchableHighlight underlayColor={'transparent'} style={styles.optionButton} onPress={handleCameraUpload}>
                                <Text style={styles.optionButtonText}>Take Photo</Text>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor={'transparent'} style={styles.optionButton} onPress={handleGalleryUpload}>
                                <Text style={styles.optionButtonText}>Choose from Gallery</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>

                {/* IMAGE MODAL */}
                <Modal
                    visible={showModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={closeImageModal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalImageContainer}>
                            {selectedImageIndex !== null && (
                                <Image
                                    source={{ uri: healthLog.images[selectedImageIndex] }}
                                    style={styles.modalImage}
                                />
                            )}
                            <TouchableHighlight onPress={closeImageModal} style={styles.closeButton}>
                                <Icon name="close" size={30} color={colors.placeholder} />
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            </ScrollView>

            {/* SUBMIT */}
            <TouchableHighlight
                style={[styles.button, { backgroundColor: buttonColor }]}
                onPress={updateLastEditTimestampAndContinue}
                underlayColor="#DDDDDD">
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableHighlight>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    infoContainer: {
        flex: 1,
        padding: 20,
    },
    topLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    topDivider: {
        borderBottomColor: colors.placeholder,
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    divider: {
        borderBottomColor: colors.placeholder,
        borderBottomWidth: 5,
        marginBottom: 10,
        borderRadius: 100,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.theme_color_1,
    },
    dateText: {
        fontSize: 16,
        color: '#000',
    },
    placeholderText: {
        fontSize: 16,
        color: colors.placeholder,
    },
    input: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.placeholder,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        color: '#000',
        textAlignVertical: 'center',
    },
    notesInput: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.placeholder,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        color: '#000',
        textAlignVertical: 'top',
    },
    dateInput: {
        flex: 1,
        marginRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: colors.placeholder,
        color: colors.dataText,
        borderRadius: 10,
        alignItems: 'center'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkbox: {
        marginRight: 1,
    },
    checkboxLabel: {
        fontSize: 16,
        color: colors.dataText
    },
    imageContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    placeholderImageContainer: {
        width: dimensions.screenWidth / 6,
        height: dimensions.screenWidth / 6,
        borderRadius: 10,
    },
    image: {
        width: dimensions.screenWidth / 6,
        height: dimensions.screenWidth / 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.placeholder
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 100,
    },
    button: {
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
    },
    disabledDateInput: {
        backgroundColor: '#F0F0F0',
        borderColor: '#C0C0C0',
    },
    disabledDateText: {
        color: colors.disabled,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backlight,
    },
    modalImageContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: dimensions.screenWidth - 40,
        height: dimensions.screenHeight / 2,
        borderRadius: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        borderRadius: 100,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: colors.dark
    },
    optionButton: {
        backgroundColor: colors.theme_color_3,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    optionButtonText: {
        fontSize: 16,
        color: Methods.getContrastColor(colors.theme_color_3),
    },
});

export default HealthLogScreen;