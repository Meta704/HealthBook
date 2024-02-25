import React from 'react';
import { View, Image, TouchableHighlight, StyleSheet } from 'react-native';
import { dimensions, colors } from '../utils/theme';
import imagePlaceholder from '../assets/image_placeholder.png';

const ImagePickerComponent = ({ uploadedImages }) => {

    const handleImageUpload = () => {
        
    }

    return (
        <View style={styles.imageContainer}>

            {/* Show placeholder image */}
            <TouchableHighlight
                style={[styles.image]}
                onPress={handleImageUpload}>
                <Image source={imagePlaceholder} style={styles.image} />
            </TouchableHighlight>

            {/* Show uploaded images */}
            {uploadedImages.map((image, index) => (
                <Image
                    key={index}
                    source={{ uri: image }}
                    style={[styles.image, { marginLeft: 5 }]}
                />
            ))}
        </View>
    );
};

export default ImagePickerComponent;

const styles = StyleSheet.create({
    imageContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    image: {
        backgroundColor: colors.placeholder,
        width: dimensions.screenWidth / 6,
        height: dimensions.screenWidth / 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.theme_color_4
    },
});
