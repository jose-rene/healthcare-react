import * as React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {FontAwesome, SimpleLineIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

import CustomDrawerContent from '../components/DrawerComponent/CustomDrawer';
import DrawerButton from '../components/DrawerComponent/DrawerButton';
import Colors from '../Config/Colors';

import HomePage from '../pages/HomePage';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function appMainNavigator(props) {
    return (
        <Drawer.Navigator
            drawerContent={myProps => <CustomDrawerContent {...myProps} childProps={props}/>}
            drawerStyle={{backgroundColor: '#2f2e2e'}}
            overlayColor={'#000000aa'}
            initialRouteName="Home"
            drawerContentOptions={{
                activeTintColor: '#ffffff',
                activeBackgroundColor: '#7f6e6e',
                inactiveTintColor: '#ffffff',
                labelStyle: {
                    fontSize: 18,
                    // fontFamily: 'bpg-nino-mtavruli',
                }
            }}>
            <Drawer.Screen
                name="HomeStack"
                component={appMainStack}
                options={{
                    drawerLabel: "Home",
                    drawerIcon: ({focused, color, size}) => <FontAwesome color={Colors.buttonColor} size={size}
                                                                         name={'home'}/>
                }}/>
        </Drawer.Navigator>
    )
}

function appMainStack({navigation}) {
    return (
        <Stack.Navigator initialRouteName="HomeScreen">
            <Stack.Screen
                name="HomeScreen"
                component={HomePage}
                options={{
                    headerBackground: props => (
                        <LinearGradient
                            colors={[Colors.gradientColor1, Colors.gradientColor2]}
                            start={{x: 0, y: 0.75}}
                            end={{x: 1, y: 0.25}}
                            style={{width: '100%', height: '100%'}}/>
                    ),
                    headerLeft: () => (
                        <DrawerButton navigationProps={navigation}/>
                    ),
                    headerRight: () => (
                        <SimpleLineIcons name="location-pin" size={28} color="white" style={{marginRight: 15}}/>
                    ),
                    headerTitle: "Home",
                    headerTintColor: 'white',
                    headerTitleStyle: {
                        // fontFamily: 'bpg-nino-mtavruli',
                        fontSize: 22,
                    }
                }}/>
        </Stack.Navigator>
    )
}
