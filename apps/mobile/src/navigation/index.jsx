import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { restoreToken } from '../actions/restoreAction';
import { connect } from 'react-redux';

import LoginPage from '../pages/Login';
import AppMainNavigator from './appMainNavigator';

const Stack = createStackNavigator();

function MainNavigator({ localAuth }) {
  return (
    <NavigationContainer>
      {localAuth.userToken === null ? (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginPage} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={AppMainNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    localAuth: state.auth,
  };
};

const mapDispatchToProps = {
  restoreToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigator);
