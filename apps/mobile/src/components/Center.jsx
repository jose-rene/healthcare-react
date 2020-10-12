import {StyleSheet, View} from 'react-native';
import React from "react";

export default ({children}) => {
    return (
        <View style={styles.Center}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    Center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})
