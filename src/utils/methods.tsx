import { useSelector } from 'react-redux';
import { consoleColors } from '../utils/theme';
import { RootState } from '../redux/store';
import { storage } from '../data/storage';
import Sounds from './sounds';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
// import { auth } from '../data/database';
import { HealthLog } from '../data/interfaces';
import { getAuth } from 'firebase/auth';

export default class Methods {

    // Returns BLACK or WHITE according to contrast calculation
    static getContrastColor(color: string): string {
        const hexToRgb = (hex: string): number[] => {
            return hex.match(/[A-Za-z0-9]{2}/g)!.map(v => parseInt(v, 16));
        };

        const getLuminance = (r: number, g: number, b: number): number => {
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance;
        };

        let rgb: number[];
        if (color[0] === '#') {
            rgb = hexToRgb(color.substring(1));
        } else if (color.startsWith('rgb')) {
            rgb = color.match(/\d+/g)!.map(Number);
        } else {
            throw new Error('Invalid color format. Please provide a valid hex or RGB color.');
        }

        const luminance = getLuminance(rgb[0], rgb[1], rgb[2]);
        return luminance > 0.5 ? '#000' : '#fff';
    }

    // A function to format console log messages with colors
    static colorizeLog = (color: keyof typeof consoleColors, message: string): string => {
        const colorCode = consoleColors[color];
        const resetCode = consoleColors.reset;
        return `${colorCode}${message}${resetCode}`;
    }

    // Function to serialize Date to string
    static serializeDate(date: Date | null): string | null {
        return date ? date.toISOString() : '';
        // return date ? date.toISOString() : null;
    }

    // Function to deserialize string to Date
    static deserializeDate(dateString: string | null): Date | null {
        return dateString ? new Date(dateString) : null;
    }

    // Function to generate a unique log ID
    static generateUniqueLogID(): string {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        const seconds = ('0' + now.getSeconds()).slice(-2);
        const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
        return year + month + day + hours + minutes + seconds + milliseconds;
    }

    // Function to get a date string from a Date
    static getDateString = (date: Date | null): string => {
        if (!date) return "Unspecified";
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Function to get a date string from a timestamp
    static getDateStringFromTimestamp = (timestamp: number | null, dateFormat: string): string => {
        if (!timestamp) return "Unspecified";
        const date = new Date(timestamp);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        if (dateFormat == 'DD/MM/YYYY') return `${day}/${month}/${year}`;
        return `${month}/${day}/${year}`;
    }

    // Function to translate a Date into a timestamp
    static dateToTimestamp(date: Date): number {
        return date.getTime();
    }

    // Function to translate a timestamp into a Date
    static timestampToDate(timestamp: number): Date {
        return new Date(timestamp);
    }

    // Function to play sounds
    static playAudio(soundName: string) {
        const healthBookSettings = storage.getString('healthBookSettings');
        const muteSounds = JSON.parse(healthBookSettings || '{}').muteSounds || false;
        if (!muteSounds) Sounds.playSound(soundName);
    }

    // Function to check Google auth status
    static isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        return isSignedIn || false;
    }

    // // Function to check Google auth status
    // static isSignedIn = async () => {
    //     const isSignedIn = !!auth.currentUser;
    //     console.log(Methods.colorizeLog("green", "USER: " + !!auth.currentUser));
    //     if (isSignedIn) console.log(Methods.colorizeLog("green", "Logged in as: " + auth.currentUser?.email));
    //     return isSignedIn || false;
    // }

    // Function to convert a Journal into an object
    static arrayToObj(healthLogs: HealthLog[]): {[key: string]: HealthLog} {
        console.log(this.colorizeLog('yellow',"Converting journal into an object..."));
        const healthLogsObj: {[key: string]: HealthLog} = {};
        for (const log of healthLogs) {
            healthLogsObj[log.id] = log;
        }
        return healthLogsObj;
    }
    
    // Function to convert an object into a Journal
    static objToArray(healthLogsObj: {[key: string]: HealthLog}): HealthLog[] {
        console.log(this.colorizeLog('yellow',"Converting object into a Journal..."));
        return Object.values(healthLogsObj);
    }

}

