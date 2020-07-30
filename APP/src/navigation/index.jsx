import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import {restoreToken} from '../actions/restoreAction';
import {connect} from 'react-redux';

import LoginPage from '../pages/Login';
import AppMainNavigator from './appMainNavigator';
import LoginOrRegister from "../pages/LoginOrRegister";
import Register from "../pages/Register";

const Stack = createStackNavigator();

function MainNavigator({restoreTokenResponse}) {
    return (
        <NavigationContainer>
            {
                restoreTokenResponse.userToken === null ?
                    <Stack.Navigator initialRouteName="LoginOrRegister">
                        <Stack.Screen name="Login" component={LoginPage}/>
                        <Stack.Screen name="LoginOrRegister" component={LoginOrRegister}/>
                        <Stack.Screen name="Register" component={Register}/>
                    </Stack.Navigator>
                    :
                    <Stack.Navigator initialRouteName="Home">
                        <Stack.Screen name="Home" component={AppMainNavigator} options={{headerShown: false}}/>
                    </Stack.Navigator>
            }
        </NavigationContainer>
    );
}

const mapStateToProps = state => {
    return {
        restoreTokenResponse: state.restoreTokenReducer,
    }
}

const mapDispatchToProps = {
    restoreToken,
}

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigator);
