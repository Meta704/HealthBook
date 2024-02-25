import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../utils/theme';

interface LinearButtonProps {
  name: string;
  text: string;
  style?: ViewStyle;
  onPress?: () => void;
}

const LinearButton: React.FC<LinearButtonProps> = ({ name, text, style, onPress }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <LinearGradient
        colors={[colors.theme_color_1, colors.theme_color_2]}
        start={{x: 1, y: 1}}
        end={{x: 0, y: 0}}
        style={styles.gradient}>
        <Icon name={name} size={30} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 100,
    borderRadius: 30,
    marginBottom: 10,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  icon: {
    textShadowColor: '#000000AA',
    textShadowOffset: { width: 0.2, height: 1 },
    textShadowRadius: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000000AA',
    textShadowOffset: { width: 0.2, height: 1 },
    textShadowRadius: 1,
    margin: 5,
  },
});

export default LinearButton;
