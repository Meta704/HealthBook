import React, { SetStateAction, useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../utils/theme';
import { updateDateFormat, updateMuteSounds } from '../redux/settingsSlice';
import { useDispatch } from 'react-redux';
import { storage } from '../data/storage';
import { Settings } from '../data/interfaces';
import Methods from '../utils/methods';
// import { auth } from '../data/database';
import auth from '@react-native-firebase/auth';
import { signOut, signInWithPopup, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type RootStackParamList = {
    SettingsPage: undefined;
    HealthJournal: undefined;
};

type SettingsPageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SettingsPage'>;
interface SettingsPageProps {
    navigation: SettingsPageNavigationProp;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const [dateFormat, setDateFormat] = useState('');
    const [muteSounds, setMuteSounds] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(auth().currentUser || null);
    // const [currentUser, setCurrentUser] = useState(auth.currentUser || null);
    const provider = new GoogleAuthProvider();

    // Configure Google auth
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '603316969059-lacj1m0ho2rn3hjjvhq2retk33h6oqkt.apps.googleusercontent.com',
        });
        isSignedIn();
    }, [currentUser]);
    
    // Check Sign-in status
    const isSignedIn = async () => {
        setIsLoggedIn(await Methods.isSignedIn());
        handleRefresh();
    };

    // Funtion for the Google sign-in button
    const onGoogleButtonPress = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const { idToken, user } = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            auth().signInWithCredential(googleCredential);
            setCurrentUser(auth()?.currentUser);
        } catch (error: any) {
            return null;
        }

        // signInWithPopup(auth, provider)
        // .then((result) => {
        //     const credential = GoogleAuthProvider.credentialFromResult(result);
        //     const token = credential!.accessToken;
        //     const user = result.user;
        // }).catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     const email = error.customData.email;
        //     const credential = GoogleAuthProvider.credentialFromError(error);
        // });
    };

    // Refresh page
    const handleRefresh = () => {
        navigation.navigate('SettingsPage');
    };

    // Sign-out button
    const logOut = async () => {
        // signOut(auth);
        // setIsLoggedIn(false);
        try {
          await GoogleSignin.signOut();
          console.log(Methods.colorizeLog("red", "User logged out"));
          setCurrentUser(null);
          //REMOVE USER STATE
        } catch (error) {
          console.error(error);
        } finally {
            handleRefresh();
        }
      };

    // Fetch settings from storage when component mounts
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settingsString = await storage.getString('healthBookSettings');
                if (settingsString) {
                    const settings = JSON.parse(settingsString) as Settings;
                    setDateFormat(settings.dateFormat);
                    setMuteSounds(settings.muteSounds);
                }
            } catch (error) {
                console.error('Error retrieving settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const toggleMuteSounds = (value: boolean) => {
        setMuteSounds(value);
        dispatch(updateMuteSounds(value));
    };

    const handleDateFormatChange = (value: string) => {
        setDateFormat(value);
        dispatch(updateDateFormat(value));
    };

    return (
        <LinearGradient colors={[colors.baseColor, colors.theme_color_5]} style={styles.container}>
            {isLoggedIn ?
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>User Data</Text>
                    <View style={styles.divider} />
                    <View style={styles.userData}>
                        <Text style={styles.label}>You are currently logged in as:</Text>
                        <Text style={styles.value}>{currentUser?.email}</Text>
                    </View>
                    <View style={styles.logOutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
                        <Icon name="sign-out-alt" size={30} color="white" />
                        <Text style={styles.loginButtonText}>Sign out</Text>
                    </TouchableOpacity>
                </View>
                </View>
                :
                <View style={styles.loginSection}>
                    <Text style={styles.sectionTitle}>You are not logged in.</Text>
                    <TouchableOpacity style={styles.loginButton} onPress={onGoogleButtonPress}>
                        <Icon name="google" size={30} color="white" />
                        <Text style={styles.loginButtonText}>Login with Google</Text>
                    </TouchableOpacity>
                </View>}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={styles.divider} />
                <View style={styles.setting}>
                    <Text style={styles.label}>Mute Sounds:</Text>
                    <Switch
                        trackColor={{ false: colors.placeholder, true: colors.theme_color_3 }}
                        value={muteSounds}
                        onValueChange={toggleMuteSounds}
                    />
                </View>
                <View style={styles.setting}>
                    <Text style={styles.label}>Date Format:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={dateFormat}
                            style={styles.picker}
                            onValueChange={handleDateFormatChange}>
                            <Picker.Item label="MM/DD/YYYY" value="MM/DD/YYYY" />
                            <Picker.Item label="DD/MM/YYYY" value="DD/MM/YYYY" />
                        </Picker>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 40,
    },
    loginSection: {
        marginBottom: 40,
        alignItems: 'center',
    },
    logOutSection: {
        marginTop: 20,
        alignItems: 'flex-end',
    },
    loginButton: {
        backgroundColor: colors.google,
        borderRadius: 10,
        height: 50,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    logoutButton: {
        backgroundColor: colors.google,
        borderRadius: 10,
        height: 50,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 10,
    },
    userData: {
        backgroundColor: colors.baseColor,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.theme_color_1
    },
    label: {
        fontSize: 16,
        color: colors.negative,
    },
    value: {
        fontSize: 16,
        color: colors.theme_color_1,
    },
    divider: {
        borderBottomColor: colors.theme_color_2,
        borderBottomWidth: 2,
        marginBottom: 20,
        borderRadius: 10,
    },
    setting: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    pickerContainer: {
        width: '50%',
        height: 50,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.theme_color_1,
        overflow: 'hidden'
    },
    picker: {
        height: 20,
        color: colors.baseColor,
        backgroundColor: colors.theme_color_2,
    },
});

export default SettingsPage;
