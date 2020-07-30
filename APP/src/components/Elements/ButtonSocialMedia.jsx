import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {Styles} from "./Button";
import {Button} from "react-native-elements";

export default ({onPress = false, title = false, icon = null, disabled = false}) => {
    const handleOnPress = () => {
        onPress && onPress();
    }

    const buttonColor = BtnSocialMedia[`${icon}-button-color`] || '';
    const textColor = BtnSocialMedia[`${icon}-text-color`] || '';

    return (
        <View style={Styles.contentContainer}>
            <Button
                large
                activeOpacity={0.8}
                buttonStyle={[Styles.Button, {backgroundColor: '#ffffff'}, buttonColor]}
                titleStyle={textColor}
                onPress={handleOnPress}
                disabled={disabled}
                icon={icon && <FontAwesome
                    name={icon}
                    size={30}
                    style={[{marginRight: 20}, textColor]}
                />}
                title={title}
            />
        </View>
    );
}

const BtnSocialMedia = StyleSheet.create({
    'facebook-f-button-color': {
        borderColor: 'blue',
        // borderWidth: 2,
    },

    'facebook-f-text-color': {
        color: 'blue',
    },

    'google-button-color': {
        borderColor: 'red',
        // borderWidth: 2,
    },

    'google-text-color': {
        color: 'red',
    },
})
