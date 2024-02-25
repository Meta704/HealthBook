import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Methods from '../utils/methods';

// @ts-ignore
import logo from '../assets/logo.png';
// @ts-ignore
import metux from '../assets/metux_white_sym.png';
import { colors } from '../utils/theme';

type RootStackParamList = {
    SplashScreen: undefined;
    HomeScreen: undefined;
    HealthJournal: undefined;
};

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SplashScreen'>;
interface SplashScreenProps {
    navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {

    useEffect(() => {
        StatusBar.setHidden(true);
        const timer = setTimeout(() => {
            Methods.playAudio('welcome');
            navigation.navigate('HealthJournal');
        }, 2000);

        return () => {
            clearTimeout(timer);
            StatusBar.setHidden(false);
        };
    }, [navigation]);

    return (
        <LinearGradient
            colors={[colors.theme_color_2, colors.theme_color_4]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={logo}
                    style={styles.logo}
                    resizeMode="contain" />
            </View>
            <View style={styles.bottomContent}>
                <View style={styles.metuxContainer}>
                    <Image
                        source={metux}
                        style={styles.metux}
                        resizeMode="contain" />
                </View>
                <Text style={styles.text}>By Meishar Tal</Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 240,
        height: 240,
    },
    bottomContent: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20,
    },
    metux: {
        width: 50,
        height: 50,
    },
    metuxContainer: {
        shadowColor: 'black',
        shadowOffset: { width: 0.8, height: 1 },
        shadowRadius: 3,
    },
    text: {
        fontSize: 18,
        color: 'white',
        letterSpacing: -1,
        textShadowColor: 'black',
        textShadowOffset: { width: 0.8, height: 1 },
        textShadowRadius: 3,
    },
});

export default SplashScreen;
