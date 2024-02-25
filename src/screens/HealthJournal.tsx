import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, LayoutAnimation, FlatList, TextInput, TouchableOpacity, Platform, UIManager } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/navContainer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { storage } from '../data/storage';
import { HealthLog, Settings } from '../data/interfaces';
import Methods from '../utils/methods';
import JournalItem from '../components/JournalItem';
import { colors } from '../utils/theme';
import { useDispatch } from 'react-redux';
import { updateGridView } from '../redux/settingsSlice';
import { setHealthLogs } from '../redux/healthLogSlice';

import { db } from '../data/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { doc, setDoc, updateDoc, collection, addDoc } from "firebase/firestore";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type HealthJournalNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NewLogScreen'>;
interface HealthJournalProps {
  navigation: HealthJournalNavigationProp;
  route?: any;
}

const HealthJournal: React.FC<HealthJournalProps> = ({ navigation, route }) => {
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<HealthLog[]>([]);
  const [searchText, setSearchText] = useState('');
  const [gridView, setGridView] = useState(false);
  const [showingPinned, setShowingPinned] = useState(false);
  const refreshByParent = route.params?.needsRefresh ?? false;
  const dispatch = useDispatch();

  useEffect(() => {
    fetchHealthLogs();
  }, [refreshByParent]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsString = await storage.getString('healthBookSettings');
        if (settingsString) {
          const settings = JSON.parse(settingsString) as Settings;
          setGridView(settings.gridView);
        }
      } catch (error) {
        console.error('Error retrieving settings:', error);
      }
    };
    fetchSettings();
  }, []);

  // Update cards according to the search entry
  useEffect(() => {
    const filteredLogs = logs.filter(log =>
      Object.entries(log).some(([key, value]) =>
        key !== 'id' &&
        typeof value === 'string' &&
        value.toLowerCase().includes(searchText.toLowerCase())
      ) ||
      (log.symptoms && log.symptoms.some(symptom =>
        typeof symptom === 'string' && symptom.toLowerCase().includes(searchText.toLowerCase())
      )) ||
      (log.treatments && log.treatments.some(treatment =>
        Object.values(treatment).some(treatmentValue =>
          typeof treatmentValue === 'string' && treatmentValue.toLowerCase().includes(searchText.toLowerCase())
        )
      )) ||
      (log.whatHelped && log.whatHelped.some(helpedTreatment =>
        Object.values(helpedTreatment).some(helpedTreatmentValue =>
          typeof helpedTreatmentValue === 'string' && helpedTreatmentValue.toLowerCase().includes(searchText.toLowerCase())
        )
      ))
    );
    setFilteredLogs(filteredLogs);
  }, [searchText, logs]);

  const toggleSize = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    Methods.playAudio('switch');
    dispatch(updateGridView(!gridView));
    setGridView(!gridView);
  }

  const handlePinSelect = () => {
    Methods.playAudio('switch');
    setShowingPinned(!showingPinned);
  }

  // Function to get last updated logs from Firebase
  const fetchHealthLogsFromFirebase = async (): Promise<HealthLog[]> => {
    return [];
  }

  // Function to update Firebase with logs
  const updateFirebaseDB = async (combinedLogs: HealthLog[]) => {
    const userID = auth().currentUser?.uid;

    if (!userID) {
      console.log('Current UID could not be reached.');
      return;
    }

    const xRef = collection(db, 'users', userID, "Journal");
    const dataRef = await addDoc(xRef,{something: "something"});
    
  //   const docData = {
  //     stringExample: "Hello world!",
  //     booleanExample: true,
  //     numberExample: 3.14159265,
  //     arrayExample: [5, true, "hello"],
  //     nullExample: null,
  //     objectExample: {
  //         a: 5,
  //         b: {
  //             nested: "foo"
  //         }
  //     }
  // };
  // try {
  //   await setDoc(doc(db, "users", userID), docData)
  //   // await setDoc(doc(db, "users", userID), Methods.arrayToObj(combinedLogs))
  //   .then(() => { console.log('Journal updated on Firebase!') });
  // } catch (error) {
  //   console.error('Error updating journal on Firebase:', error);
  // }
    
      // const usersRef = collection(db, 'users');
      // console.log(Methods.colorizeLog('blue',""+usersRef.id));
      // const userDocs = await getDocs(usersRef);
      // console.log(Methods.colorizeLog('blue',""+userDocs.size));
      // const userList = userDocs.docs.map(doc => doc.data());
      // console.log(Methods.colorizeLog('blue',""+userList.length));
      // userList.forEach(user => {
      //   console.log(Methods.colorizeLog('blue',user.email));
      // });

  // firestore()
  // .collection('users')
  // .get()
  // .then(querySnapshot => {
  //   console.log('Total users: ', querySnapshot.size);
  //   querySnapshot.forEach(documentSnapshot => {
  //     console.log('User ID: ', documentSnapshot.id);
  //   });
  // });

  // firestore()
  //     .collection('users')
  //     .doc(userId)
  //     .set({ Journal: combinedLogs })
  //     .then(() => { console.log('Journal updated on Firebase!') });

  // try {
  //   await firestore()
  //     .collection('users')
  //     .doc(userID)
  //     .set({ Journal: combinedLogs })
  //     .then(() => { console.log('Journal updated on Firebase!') });
  // } catch (error) {
  //   console.error('Error updating journal on Firebase:', error);
  // }
  }

  // Combine healthLogs from firebase and local storage
  const combineHealthLogs = (firebaseLogs: HealthLog[], localLogs: HealthLog[]): HealthLog[] => {
    const combinedLogs: HealthLog[] = [...firebaseLogs];
    localLogs.forEach(localLog => {
      const index = combinedLogs.findIndex(log => log.id === localLog.id);
      if (index !== -1) {
        const combinedLog = combinedLogs[index];
        if (combinedLog.lastEdit! < localLog.lastEdit!) {
          combinedLogs[index] = localLog;
        }
      } else {
        combinedLogs.push(localLog);
      }
    });

    return combinedLogs;
  }

  // Retrieve the health logs from both Firebase and local storage
  const fetchHealthLogs = async () => {
    try {
      const isSignedIn = false;
      // const isSignedIn = await Methods.isSignedIn();

      if (isSignedIn) {
        const firebaseHealthLogs = await fetchHealthLogsFromFirebase();
        console.log(Methods.colorizeLog("yellow","# of logs from Firebase: "+firebaseHealthLogs.length));
        const localHealthLogsString = storage.getString('healthLogs');
        let localHealthLogs: HealthLog[] = [];
        if (localHealthLogsString) {
          localHealthLogs = JSON.parse(localHealthLogsString) as HealthLog[];
          console.log(Methods.colorizeLog("yellow","# of logs from memory: "+localHealthLogs.length));
        }
        const combinedHealthLogs = combineHealthLogs(firebaseHealthLogs, localHealthLogs);
        dispatch(setHealthLogs(combinedHealthLogs));
        // updateFirebaseDB(combinedHealthLogs);
        setLogs(combinedHealthLogs);
      } else {
        let localHealthLogs = JSON.parse(storage.getString('healthLogs')!) as HealthLog[];
        setLogs(localHealthLogs);
      }
      handleRefresh();
    } catch (error) {
      console.error('Error retrieving health logs:', error);
    }
  }

  const handleRefresh = () => {
    navigation.navigate('HealthJournal');
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('NewLogScreen')}>
          <Icon name="add" size={26} color={Methods.getContrastColor(colors.theme_color_2)} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={toggleSize}>
          {gridView ?
            <Icon name="view-agenda" size={26} color={Methods.getContrastColor(colors.theme_color_2)} />
            : <Icon name="grid-view" size={26} color={Methods.getContrastColor(colors.theme_color_2)} />}
        </TouchableOpacity>
        {showingPinned ?
          <TouchableOpacity style={styles.iconContainer_neg} onPress={handlePinSelect}>
            <Icon name="push-pin" size={26} color={colors.theme_color_2} />
          </TouchableOpacity>
          : <TouchableOpacity style={styles.iconContainer} onPress={handlePinSelect}>
            <Icon name="push-pin" size={26} color={Methods.getContrastColor(colors.theme_color_2)} />
          </TouchableOpacity>}
        <View style={{ width: 10 }} />
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={colors.placeholder}
            value={searchText}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => {/* No action, just cute */ }}>
            <Icon name="search" size={24} color={colors.theme_color_1} />
          </TouchableOpacity>
        </View>
      </View>

      {filteredLogs && filteredLogs.length > 0 ? (
        gridView ? (
          <FlatList
            key="grid"
            data={showingPinned ? filteredLogs.filter(log => log.isPinned)
              .sort((a, b) => parseInt(b.id) - parseInt(a.id))
              : filteredLogs.sort((a, b) => parseInt(b.id) - parseInt(a.id))}
            numColumns={2}
            columnWrapperStyle={{ flexDirection: 'row' }}
            renderItem={({ item }) => (
              <JournalItem
                log={item}
                onChange={fetchHealthLogs}
                navigation={navigation}
                onChangeView={true}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <FlatList
            key="list"
            data={showingPinned ? filteredLogs.filter(log => log.isPinned)
              .sort((a, b) => parseInt(b.id) - parseInt(a.id))
              : filteredLogs.sort((a, b) => parseInt(b.id) - parseInt(a.id))}
            renderItem={({ item }) => (
              <JournalItem
                log={item}
                onChange={fetchHealthLogs}
                navigation={navigation}
                onChangeView={false}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )
      ) : (
        <Text style={styles.text}>- No logs found -</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme_color_5,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: colors.baseColor,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: colors.theme_color_2
  },
  iconContainer: {
    borderRadius: 50,
    backgroundColor: colors.theme_color_2,
    padding: 5,
    marginLeft: 10,
  },
  iconContainer_neg: {
    borderRadius: 50,
    backgroundColor: Methods.getContrastColor(colors.theme_color_2),
    padding: 5,
    marginLeft: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.theme_color_2,
    borderRadius: 20,
    backgroundColor: colors.baseColor,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: colors.baseColor,
    color: colors.dark,
  },
  text: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.dark,
  },
});

export default HealthJournal;
