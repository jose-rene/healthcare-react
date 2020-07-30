import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Colors from "../../Config/Colors";
import {Button} from "react-native-elements";
// import Icon from '@expo/vector-icons/Entypo';

export default ({loading = false, onPress = false, title = false, disabled = false, loading_title = "Loading"}) => {
    const [buttonText, setButtonText] = useState(title);
    const handleOnPress = () => {
        onPress && onPress();
    }

    useEffect(() => {
        setButtonText(loading ? loading_title : title);
    }, [loading]);

    return (
        <View style={Styles.contentContainer}>
            <Button
                large
                disabled={disabled}
                activeOpacity={0.8}
                buttonStyle={Styles.Button}
                onPress={handleOnPress}
                title={buttonText}
                titleProps={Styles.ButtonText}
            />
        </View>
    );
}

export const Styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    Button: {
        // Button styles
        height: 55,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.buttonColor,
        padding: 20,
        paddingHorizontal: 50,
        borderRadius: 30,
        marginHorizontal: 10,
        marginTop: 10,
    },
    ButtonText: {
        fontSize: 24,
        color: 'white'
    }
});
