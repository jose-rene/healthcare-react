import React from 'react';
import {StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';
import Colors from "../../../Config/Colors";

export default ({label, onChange, value, secureTextEntry = false, addShadow = false, ...otherProps}) => {
    const handleOnChange = (value) => {
        onChange && onChange(value);
    }

    return (
        <Input
            placeholder=''
            labelStyle={styles.labelStyle}
            inputStyle={[styles.inputStyle, addShadow ? styles.inputShadow : null]}
            inputContainerStyle={styles.inputContainerStyle}
            onChangeText={handleOnChange}
            value={value}
            label={label}
            secureTextEntry={secureTextEntry}
            {...otherProps}
        />
    )
}

const styles = StyleSheet.create({
    labelStyle: {
        // paddingLeft: 10,
        marginVertical: 3,
        fontWeight: "300",
        color: '#000000',
    },
    inputStyle: {
        height: 50,
        padding: 5,
        borderRadius: 8,
        borderWidth: 0,
        marginBottom: 2,
        backgroundColor: Colors.textInputBackground,
    },
    // Drop shadow
    inputShadow: {
        shadowColor: '#000',
        shadowOffset: {width: 2, height: 5},
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputContainerStyle: {
        borderBottomWidth: 0,
    }
})
