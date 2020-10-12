import React from "react";
import {SafeAreaView, StyleSheet} from "react-native";
import Button from "../components/Elements/Button";

export default ({navigation}) => {
    const Login = () => {
        navigation.push('Login');
    }
    const Register = () => {
        navigation.push('Register');
    }

    return (
        <SafeAreaView style={styles.buttonContainer}>
            <Button onPress={Login} title={'Login'}/>
            <Button onPress={Register} title={'Register'}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
})
