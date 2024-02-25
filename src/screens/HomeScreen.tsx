// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// // @ts-ignore
// import homeBanner from '../assets/home_banner_1.jpg';
// import { colors, dimensions } from '../utils/theme';
// import LinearButton from '../components/LinearButton';
// import { RootStackParamList } from '../components/navContainer';

// type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;
// interface HomeScreenProps {
//   navigation: HomeScreenNavigationProp;
// }

// const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

//   useEffect(() => {
//     StatusBar.setHidden(false);
//   }, [])

//   return (
//     <View style={styles.page_container}>
//       <View style={styles.content}>
//         <TouchableOpacity style={styles.settingsButton}>
//           <Icon name="cog" size={24} color={colors.negative} style={styles.settingsIcon} />
//         </TouchableOpacity>
//         <View>
//           <View style={styles.backgroundImageContainer} />
//           <Image source={homeBanner} style={styles.banner} />
//           <View style={styles.titleHeader}>
//             <Text style={styles.titleHeaderText}>How are you feeling today?</Text>
//           </View>
//         </View>

//         {/* Buttons */}
//         <View style={styles.container}>
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.button}>
//               <LinearButton name="plus" text="New Log" onPress={() => { navigation.navigate('NewLogScreen') }} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button}>
//               <LinearButton name="book-open" text="Health Journal" onPress={() => { navigation.navigate('HealthJournal') }} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button}>
//               <LinearButton name="pills" text="Medication Reminder" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button}>
//               <LinearButton name="smile" text="Mood Tracker" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button}>
//               <LinearButton name="weight" text="Weight Tracker" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button}>
//               <LinearButton name="calendar-alt" text="Schedule" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* Login Section */}
//       <View style={styles.loginSection}>
//         <View style={styles.line} />
//         <View style={styles.loginContainer}>
//           <TouchableOpacity style={styles.loginButton}>
//             <Icon name="google" size={30} color="white" />
//             <Text style={styles.loginButtonText}>Login with Google</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   page_container: {
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     height: '100%',
//     backgroundColor: colors.light,
//   },
//   content: {
//     flex: 1,
//   },
//   container: {
//     padding: 20,
//   },
//   backgroundImageContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   banner: {
//     width: '100%',
//     height: 250,
//     resizeMode: 'cover',
//     borderTopLeftRadius: 120,
//     // borderTopLeftRadius: dimensions.screenWidth / 1.5,
//   },
//   settingsButton: {
//     zIndex: 9,
//   },
//   titleHeader: {
//     position: 'absolute',
//     bottom: 10,
//     left: 10,
//     backgroundColor: 'rgba(0, 0, 0, 0)',
//     padding: 10,
//     borderRadius: 5,
//   },
//   titleHeaderText: {
//     color: 'white',
//     fontSize: 22,
//     fontWeight: 'bold',
//     textShadowColor: '#000000DD',
//     textShadowOffset: { width: 1, height: 1.5 },
//     textShadowRadius: 1,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   button: {
//     width: '30%',
//     height: 100,
//     borderRadius: 30,
//     marginBottom: 10,
//     overflow: 'hidden',
//   },
//   line: {
//     borderBottomWidth: 0.7,
//     borderColor: colors.dark,
//     width: '90%',
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   loginSection: {
//     paddingBottom: 20,
//   },
//   loginContainer: {
//     alignItems: 'center',
//   },
//   loginButton: {
//     backgroundColor: colors.google,
//     borderRadius: 10,
//     height: 50,
//     width: '80%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   loginButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   settingsIcon: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//   },
// });

// export default HomeScreen;
