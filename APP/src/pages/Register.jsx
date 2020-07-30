import React, {useEffect, useState} from "react";
import {Image, ScrollView, StyleSheet, Text} from "react-native";
import TextInput from "../components/Elements/Inputs/TextInput";
import Button from "../components/Elements/Button";
import Center from "../components/Center";
import ButtonSocialMedia from "../components/Elements/ButtonSocialMedia";
import {Link} from "@react-navigation/native";
import {useForm} from "react-hook-form";
import {mash_field} from "../Dictionary/Index";
import userService from "../services/userService";

export default ({navigation}) => {
    const {register, handleSubmit, errors, setValue} = useForm();

    useEffect(() => {
        register('email', {
            required: mash_field('required'),
            pattern: {
                value: /^((?!\.)[\w-_.+]*)(@[\w|-]+)(\.\w+(\.\w+)?[^.\W])$/,
                message: 'invalid email address'
            }
        });

        register('password', {required: mash_field('required')});
        register('password_confirmation', {required: mash_field('required')});
    }, [register]);

    const [loading, setLoading] = useState(false);
    const [registrationError, setRegistrationError] = useState(false);

    const handleRegister = async (data, type = 'na') => {
        setRegistrationError(false)
        const {status = false} = await userService.register({...data, registration_type: type}).catch({status: false});

        if (status) {
            navigation.push('Login')
            return true;
        }

        setRegistrationError(true);
    }

    return (
        <ScrollView style={Styles.container}>
            <Center>
                IMAGE
            </Center>

            {registrationError && <Text>
                Error Registering
            </Text>}

            <TextInput
                onChange={value => setValue('email', value)}
                value={register.email}
                label="Email"
                errorMessage={errors.email && errors.email.message}
            />

            <TextInput
                onChange={value => setValue('password', value)}
                value={register.password}
                secureTextEntry={true}
                label="Password"
                errorMessage={errors.password && errors.password.message}
            />

            <TextInput
                onChange={value => setValue('password_confirmation', value)}
                value={register.password_confirmation}
                label="Confirm Password"
                secureTextEntry={true}
                errorMessage={errors.password_confirmation && "Confirm Password is required"}
            />

            <Button
                onPress={handleSubmit(data => handleRegister(data, 'system'))}
                title="Register"
                disabled={loading}
            />
            <ButtonSocialMedia
                onPress={handleSubmit(data => handleRegister(data, 'facebook'))}
                title="Facebook"
                icon="facebook-f"
                disabled={loading}
            />

            <ButtonSocialMedia
                onPress={handleSubmit(data => handleRegister(data, 'google'))}
                title="Google"
                icon="google"
                disabled={loading}
            />

            <Center>
                <Text style={Styles.loginText}>
                    Already have an account? <Link to="/Login" style={Styles.loginLink}>Login</Link>
                </Text>
            </Center>
        </ScrollView>
    )
}

const Styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,

        overflow: 'scroll',

        paddingBottom: 20,

        // flex: 1,
        // flexDirection: 'column',
        // padding: 30,
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    loginText: {
        marginTop: 25,
    },
    loginLink: {
        textDecorationLine: 'underline',
    }
})
