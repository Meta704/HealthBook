import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableHighlight, Alert, Image, FlatList, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, dimensions } from '../utils/theme';
import { HealthLog } from '../data/interfaces';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteHealthLog, togglePinLog } from '../redux/healthLogSlice';
import Methods from '../utils/methods';
import { RootState } from '../redux/store';

interface JournalItemProps {
    log: HealthLog;
    onChange: () => void;
    navigation: any;
    onChangeView: boolean;
}

const JournalItem: React.FC<JournalItemProps> = ({ log, onChange, navigation, onChangeView }) => {
    const dispatch = useDispatch();
    const [showImageModal, setShowImageModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const dateFormat = useSelector((state: RootState) => state.settings.settings.dateFormat);

    // Handler for deletion
    const handleDelete = () => {
        Methods.playAudio('error');
        Alert.alert(
            'Careful!',
            'This log will be permanently deleted!\nWould you like to continue?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        dispatch(deleteHealthLog(log.id));
                        onChange(); //refresh call
                    },
                },
            ],
            { cancelable: true }
        );
    };

    // Handler for editing
    const handleEdit = () => {
        navigation.navigate('NewLogScreen', { log });
    };

    // Toggle pinned log
    const handlePinToggle = () => {
        dispatch(togglePinLog(log.id));
        onChange();
    };

    // Open Image 
    const openImageModal = (index: number) => {
        setSelectedImageIndex(index);
        setShowImageModal(true);
    };

    // Close Image
    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedImageIndex(null);
    };

    // Open Log Card
    const openCardModal = () => {
        setShowCardModal(true);
    };

    // Close Log Card
    const closeCardModal = () => {
        setShowCardModal(false);
    };

    if (onChangeView) {
        const shouldShowOnlySymptoms = (log.symptoms.length >= 4) || (log.symptoms.length + log.whatHelped.length) > 4;
        return (
            <TouchableHighlight key={'card'} underlayColor={'transparent'} onPress={openCardModal}>
                <View>
                    <LinearGradient
                        colors={[colors.baseColor, colors.baseColor]}
                        start={{ x: 0.2, y: 0.7 }}
                        end={{ x: 0.53, y: 0 }}
                        style={styles.logContainer_minimal}>
                        <Text style={styles.logTitle_minimal}>{log.title}</Text>
                        {/* DIVIDER */}
                        <View style={styles.divider} />
                        {/* SYMPTOMS */}
                        <Text style={styles.logData_minimal}>
                            <Text style={styles.dataLabel_minimal}>Symptoms:</Text>
                        </Text>
                        {shouldShowOnlySymptoms ? (
                        <View style={styles.listView_minimal}>
                            {log.symptoms.map((symptom, index) => (
                                <Text key={index} style={styles.logData_minimal}>• {symptom}</Text>
                            ))}
                        </View>
                    ) : (
                        <>
                            {log.symptoms && log.symptoms.length > 0 && (
                                <View style={styles.listView_minimal}>
                                    {log.symptoms.map((symptom, index) => (
                                        <Text key={index} style={styles.logData_minimal}>• {symptom}</Text>
                                    ))}
                                </View>
                            )}
                            {!log.symptoms || log.symptoms.length === 0 && (
                                <View style={styles.listView_minimal}>
                                    <Text style={styles.logData_minimal}>• No symptoms</Text>
                                </View>
                            )}
                            <Text style={styles.logData_minimal}>
                                <Text style={styles.dataLabel_minimal}>Eased by:</Text>
                            </Text>

                            {/* WHAT HELPED */}
                            {log.whatHelped && log.whatHelped.length > 0 && (
                                <View style={styles.listView_minimal}>
                                    {log.whatHelped.map((treatment, index) => (
                                        <Text key={index} style={styles.logData_minimal}>
                                            • {treatment.treatmentName}, {treatment.amount} {treatment.amountUnit}
                                        </Text>
                                    ))}
                                </View>
                            )}
                            {!log.whatHelped || log.whatHelped.length === 0 && (
                                <View style={styles.listView_minimal}>
                                    <Text style={styles.logData_minimal}>• Nothing so far</Text>
                                </View>
                            )}
                        </>
                    )}

                        {/* WHAT HELPED */}
                        {/* <Text style={styles.logData_minimal}>
                            <Text style={styles.dataLabel_minimal}>Eased by:</Text>
                        </Text>
                        {log.whatHelped && log.whatHelped.length > 0 && (
                            <View style={styles.listView_minimal}>
                                {log.whatHelped.map((treatment, index) => (
                                    <Text key={index} style={styles.logData_minimal}>
                                        • {treatment.treatmentName}, {treatment.amount} {treatment.amountUnit}
                                    </Text>
                                ))}
                            </View>
                        )}
                        {!log.whatHelped || log.whatHelped.length === 0 && (
                            <View style={styles.listView_minimal}>
                                <Text style={styles.logData_minimal}>• Nothing so far</Text>
                            </View>
                        )} */}

                        {/* CARD MODAL */}
                        <Modal
                            visible={showCardModal}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={closeCardModal}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalCardContainer}>
                                    <LinearGradient
                                        colors={[colors.baseColor, colors.baseColor]}
                                        start={{ x: 0.2, y: 0.7 }}
                                        end={{ x: 0.53, y: 0 }}
                                        style={styles.logContainer_modal}>
                                        <View style={styles.cardActions}>
                                            <TouchableHighlight
                                                underlayColor={'transparent'}
                                                style={styles.iconButton}
                                                onPress={handlePinToggle}>
                                                {log.isPinned ?
                                                    <Icon key={'pushpin' + log.id} name="push-pin" size={28} color={colors.pinned} style={{ transform: [{ rotate: '45deg' }] }} />
                                                    : <Icon key={'pushpin' + log.id} name="push-pin" size={28} color={colors.theme_color_3} style={{ transform: [{ rotate: '45deg' }] }} />}
                                            </TouchableHighlight>
                                            <TouchableHighlight
                                                underlayColor={'transparent'}
                                                style={styles.iconButton}
                                                onPress={() => {
                                                    handleEdit();
                                                    closeCardModal();
                                                }}>
                                                <Icon name="edit" size={28} color={colors.theme_color_3} />
                                            </TouchableHighlight>
                                            <TouchableHighlight
                                                underlayColor={'transparent'}
                                                style={styles.iconButton}
                                                onPress={() => {
                                                    handleDelete();
                                                    closeCardModal();
                                                }}>
                                                <Icon name="delete-forever" size={28} color={colors.theme_color_3} />
                                            </TouchableHighlight>
                                        </View>
                                        <Text style={styles.logTitle}>{log.title}</Text>

                                        {/* DATES */}
                                        <Text style={styles.logData}>
                                            <Text style={styles.dataLabel}>Date Started:</Text> {Methods.getDateStringFromTimestamp(log.dateStarted!,dateFormat)}
                                        </Text>
                                        <Text style={styles.logData}>
                                            <Text style={styles.dataLabel}>Date Ended:</Text> {log.ongoing ? "Ongoing" : Methods.getDateStringFromTimestamp(log.dateEnded!,dateFormat)}
                                        </Text>

                                        {/* SYMPTOMS */}
                                        <Text style={styles.logData}>
                                            <Text style={styles.dataLabel}>Symptoms:</Text>
                                        </Text>
                                        {log.symptoms && log.symptoms.length > 0 && (
                                            <View style={styles.listView}>
                                                {log.symptoms.map((symptom, index) => (
                                                    <Text key={index} style={styles.logData}>• {symptom}</Text>
                                                ))}
                                            </View>
                                        )}
                                        {!log.symptoms || log.symptoms.length === 0 && (
                                            <View style={styles.listView}>
                                                <Text style={styles.logData}>• No symptoms</Text>
                                            </View>
                                        )}

                                        {/* TREATMENTS */}
                                        <Text style={styles.logData}>
                                            <Text style={styles.dataLabel}>Treated with:</Text>
                                        </Text>
                                        {log.treatments && log.treatments.length > 0 && (
                                            <View style={styles.listView}>
                                                {log.treatments.map((treatment, index) => (
                                                    treatment.frequencyUnit == 'once' ?
                                                        <Text key={index} style={styles.logData}>
                                                            • {treatment.treatmentName}, {treatment.amount} {treatment.amountUnit}, {treatment.frequencyValue} taken {treatment.frequencyUnit}
                                                        </Text>
                                                        :
                                                        <Text key={index} style={styles.logData}>
                                                            • {treatment.treatmentName}, {treatment.amount} {treatment.amountUnit}, {treatment.frequencyValue} {treatment.frequencyUnit} for {treatment.durationValue} {treatment.durationUnit}
                                                        </Text>
                                                ))}
                                            </View>
                                        )}
                                        {!log.treatments || log.treatments.length === 0 && (
                                            <View style={styles.listView}>
                                                <Text style={styles.logData}>• No treatments</Text>
                                            </View>
                                        )}

                                        {/* WHAT HELPED */}
                                        <Text style={styles.logData}>
                                            <Text style={styles.dataLabel}>Eased by:</Text>
                                        </Text>
                                        {log.whatHelped && log.whatHelped.length > 0 && (
                                            <View style={styles.listView}>
                                                {log.whatHelped.map((treatment, index) => (
                                                    treatment.frequencyUnit == 'once' ?
                                                        <Text key={index} style={styles.logData}>
                                                            • {treatment.treatmentName}, {treatment.amount} {treatment.amountUnit}, {treatment.frequencyValue} taken {treatment.frequencyUnit}
                                                        </Text>
                                                        :
                                                        <Text key={index} style={styles.logData}>
                                                            • {treatment.treatmentName}, {treatment.amount} {treatment.amountUnit}, {treatment.frequencyValue} {treatment.frequencyUnit} for {treatment.durationValue} {treatment.durationUnit}
                                                        </Text>
                                                ))}
                                            </View>
                                        )}
                                        {!log.whatHelped || log.whatHelped.length === 0 && (
                                            <View style={styles.listView}>
                                                <Text style={styles.logData}>• Nothing so far</Text>
                                            </View>
                                        )}

                                        {/* NOTES */}
                                        <Text style={styles.logData}>
                                            <Text style={styles.dataLabel}>Notes:</Text>
                                        </Text>
                                        <View style={styles.listView}>
                                            <Text style={styles.notesText}>
                                                • {log.notes && log.notes.length > 0 ? log.notes : 'No notes taken.'}
                                            </Text>
                                        </View>

                                        {/* IMAGE THUMBNAILS */}
                                        <View style={styles.imageContainer}>
                                            <FlatList
                                                data={log.images}
                                                horizontal
                                                scrollEnabled={false}
                                                renderItem={({ item, index }) => (
                                                    <TouchableHighlight underlayColor={'transparent'} onPress={() => openImageModal(index)}>
                                                        <Image
                                                            source={{ uri: item }}
                                                            style={styles.image}
                                                        />
                                                    </TouchableHighlight>
                                                )}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                        </View>

                                        {/* IMAGE MODAL */}
                                        <Modal
                                            visible={showImageModal}
                                            animationType="slide"
                                            transparent={true}
                                            onRequestClose={closeImageModal}>
                                            <View style={styles.modalContainer}>
                                                <View style={styles.modalImageContainer}>
                                                    {selectedImageIndex !== null && (
                                                        <Image
                                                            source={{ uri: log.images[selectedImageIndex] }}
                                                            style={styles.modalImage}
                                                        />
                                                    )}
                                                    <TouchableHighlight onPress={closeImageModal} style={styles.closeButton}>
                                                        <Icon name="close" size={30} color={colors.placeholder} />
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                        </Modal>
                                    </LinearGradient>

                                    <TouchableHighlight underlayColor={colors.theme_color_2} onPress={closeCardModal} style={styles.closeButton_cardModal}>
                                        <Icon name="close" size={34} color={colors.dark} />
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </Modal>
                    </LinearGradient>
                    { log.isPinned ? 
                    <View style={styles.pinIconOnMinimal}>
                        <Icon key={'pushpin' + log.id} name="push-pin" size={28} color={colors.pinned} style={{ transform: [{ rotate: '45deg' }] }} />
                    </View> : null}
                </View>
            </TouchableHighlight>
        );
    } else {
        return (
            <LinearGradient
                colors={[colors.baseColor, colors.baseColor]}
                start={{ x: 0.2, y: 0.7 }}
                end={{ x: 0.53, y: 0 }}
                style={styles.logContainer}>
                <View style={styles.cardActions}>
                    <TouchableHighlight
                        underlayColor={'transparent'}  
                        style={styles.iconButton}
                        onPress={handlePinToggle}>
                        {log.isPinned ?
                            <Icon key={'pushpin' + log.id} name="push-pin" size={28} color={colors.pinned} style={{ transform: [{ rotate: '45deg' }] }} />
                            : <Icon key={'pushpin' + log.id} name="push-pin" size={28} color={colors.theme_color_3} style={{ transform: [{ rotate: '45deg' }] }} />}
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={'transparent'}
                        style={styles.iconButton}
                        onPress={handleEdit}>
                        <Icon name="edit" size={28} color={colors.theme_color_3} />
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={'transparent'}
                        style={styles.iconButton}
                        onPress={handleDelete}>
                        <Icon name="delete-forever" size={28} color={colors.theme_color_3} />
                    </TouchableHighlight>
                </View>
                <Text style={styles.logTitle}>{log.title}</Text>

                {/* DATES */}
                <Text style={styles.logData}>
                    <Text style={styles.dataLabel}>Date Started:</Text> {Methods.getDateStringFromTimestamp(log.dateStarted!,dateFormat)}
                </Text>
                <Text style={styles.logData}>
                    <Text style={styles.dataLabel}>Date Ended:</Text> {log.ongoing ? "Ongoing" : Methods.getDateStringFromTimestamp(log.dateEnded!,dateFormat)}
                </Text>

                {/* SYMPTOMS */}
                <Text style={styles.logData}>
                    <Text style={styles.dataLabel}>Symptoms:</Text>
                </Text>
                {log.symptoms && log.symptoms.length > 0 && (
                    <View style={styles.listView}>
                        {log.symptoms.map((symptom, index) => (
                            <Text key={index} style={styles.logData}>• {symptom}</Text>
                        ))}
                    </View>
                )}
                {!log.symptoms || log.symptoms.length === 0 && (
                    <View style={styles.listView}>
                        <Text style={styles.logData}>• No symptoms</Text>
                    </View>
                )}

                {/* TREATMENTS */}
                <Text style={styles.logData}>
                    <Text style={styles.dataLabel}>Treated with:</Text>
                </Text>
                {log.treatments && log.treatments.length > 0 && (
                    <View style={styles.listView}>
                        {log.treatments.map((treatment, index) => (
                            treatment.frequencyUnit == 'once' ?
                                <Text key={index} style={styles.logData}>
                                    • {treatment.treatmentName}, {treatment.amount} {treatment.amountUnit}, {treatment.frequencyValue} taken {treatment.frequencyUnit}
                                </Text>
                                :
                                <Text key={index} style={styles.logData}>
                                    • {treatment.treatmentName}, {treatment.amount} {treatment.amountUnit}, {treatment.frequencyValue} {treatment.frequencyUnit} for {treatment.durationValue} {treatment.durationUnit}
                                </Text>
                        ))}
                    </View>
                )}
                {!log.treatments || log.treatments.length === 0 && (
                    <View style={styles.listView}>
                        <Text style={styles.logData}>• No treatments</Text>
                    </View>
                )}

                {/* WHAT HELPED */}
                <Text style={styles.logData}>
                    <Text style={styles.dataLabel}>Eased by:</Text>
                </Text>
                {log.whatHelped && log.whatHelped.length > 0 && (
                    <View style={styles.listView}>
                        {log.whatHelped.map((treatment, index) => (
                            treatment.frequencyUnit == 'once' ?
                                <Text key={index} style={styles.logData}>
                                    • {treatment.treatmentName}, {treatment.amount} {treatment.amountUnit}, {treatment.frequencyValue} taken {treatment.frequencyUnit}
                                </Text>
                                :
                                <Text key={index} style={styles.logData}>
                                    • {treatment.treatmentName}, {treatment.amount} {treatment.amountUnit}, {treatment.frequencyValue} {treatment.frequencyUnit} for {treatment.durationValue} {treatment.durationUnit}
                                </Text>
                        ))}
                    </View>
                )}
                {!log.whatHelped || log.whatHelped.length === 0 && (
                    <View style={styles.listView}>
                        <Text style={styles.logData}>• Nothing so far</Text>
                    </View>
                )}

                {/* NOTES */}
                <Text style={styles.logData}>
                    <Text style={styles.dataLabel}>Notes:</Text>
                </Text>
                <View style={styles.listView}>
                    <Text style={styles.notesText}>
                        • {log.notes && log.notes.length > 0 ? log.notes : 'No notes taken.'}
                    </Text>
                </View>

                {/* IMAGE THUMBNAILS */}
                <View style={styles.imageContainer}>
                    <FlatList
                        data={log.images}
                        horizontal
                        scrollEnabled={false}
                        renderItem={({ item, index }) => (
                            <TouchableHighlight onPress={() => openImageModal(index)}>
                                <Image
                                    source={{ uri: item }}
                                    style={styles.image}
                                />
                            </TouchableHighlight>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>

                {/* IMAGE MODAL */}
                <Modal
                    visible={showImageModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={closeImageModal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalImageContainer}>
                            {selectedImageIndex !== null && (
                                <Image
                                    source={{ uri: log.images[selectedImageIndex] }}
                                    style={styles.modalImage}
                                />
                            )}
                            <TouchableHighlight onPress={closeImageModal} style={styles.closeButton}>
                                <Icon name="close" size={30} color={colors.placeholder} />
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            </LinearGradient>
        );
    }
};

const styles = StyleSheet.create({
    logContainer: {
        margin: 5,
        padding: 15,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 1,
    },
    pinIconOnMinimal: {
        position: 'absolute',
        top: 2,
        right: 2,
    },
    logContainer_modal: {
        margin: 5,
        padding: 15,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 1,
        width: dimensions.screenWidth - 40,
    },
    logContainer_minimal: {
        margin: 5,
        padding: 15,
        width: dimensions.screenWidth / 2 - 10,
        height: 180,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 1,
        overflow: 'hidden',
    },
    divider: {
        borderBottomColor: colors.theme_color_4,
        borderBottomWidth: 2,
        marginBottom: 5,
        borderRadius: 100,
    },
    logTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.dark,
    },
    logTitle_minimal: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.dark,
    },
    logData: {
        fontSize: 16,
        color: colors.dark,
        marginLeft: 15,
    },
    logData_minimal: {
        fontSize: 14,
        color: colors.dark,
        marginLeft: 0,
    },
    dataLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.dark,
    },
    dataLabel_minimal: {
        fontWeight: 'normal',
        textDecorationLine: 'underline',
        marginBottom: 5,
        color: colors.dark,
    },
    notesText: {
        fontSize: 16,
        color: colors.dark,
        marginLeft: 15,
    },
    cardActions: {
        position: 'absolute',
        top: 30,
        right: 10,
    },
    iconButton: {
        backgroundColor: '#fff',
        borderRadius: 100,
        paddingTop: 5,
        paddingBottom: 5,
        zIndex: 1,
    },
    listView: {
        marginLeft: 25,
    },
    listView_minimal: {
        marginLeft: 10,
        marginBottom: 10,
    },
    imageContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    image: {
        width: dimensions.screenWidth / 7,
        height: dimensions.screenWidth / 7,
        borderRadius: 5,
        borderWidth: 1,
        marginHorizontal: 2,
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
    modalCardContainer: {
        backgroundColor: colors.theme_color_5,
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
    closeButton_cardModal: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: colors.theme_color_5,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: colors.theme_color_5
    },
});

export default JournalItem;
