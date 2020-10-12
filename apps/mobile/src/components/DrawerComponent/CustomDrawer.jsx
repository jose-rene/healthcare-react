import * as React from 'react';
import {SafeAreaView, ScrollView, StyleSheet,} from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from '@expo/vector-icons/AntDesign';
import {DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import useAuth from "~/Hooks/useAuth";
import Colors from '~/Config/Colors';

import {signOut} from '../../actions/restoreAction';
import {connect} from 'react-redux';

function CustomDrawerContent(props) {
    const {signOut, progress, ...rest} = props;
    const [{authed}, {doLogout}] = useAuth();

    const translateX = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [-100, 0],
    });

    async function logOut() {
        props.navigation.closeDrawer();

        doLogout();
        signOut();

        // I don't need it to wait for the navigation to close. If we do use this set timeout code
        // setTimeout(async function () {
        // doLogout();
        // signOut();
        // }, 500)
    }

    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <SafeAreaView forceInset={{top: 'always', horizontal: 'never', backgroundColor: '#2f2e2e'}}>
                <ScrollView style={{backgroundColor: '#2f2e2e'}}>
                    <Animated.View style={{transform: [{translateX}]}}>
                        <DrawerItemList {...rest} />
                    </Animated.View>
                    <Animated.View style={[{marginTop: 50, transform: [{translateX}]}]}>
                        <DrawerItem
                            label={"Logout"}
                            activeTintColor={"#ffffff"}
                            activeBackgroundColor={'#3e3d3d'}
                            inactiveTintColor={'#ffffff'}
                            onPress={() => logOut()}
                            icon={({focused, color, size}) => <Icon name="logout" size={22}
                                                                    color={Colors.buttonColor}/>}/>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    drawerbtn: {
        marginLeft: 16,
    }
});

const mapStateToProps = ({restoreTokenReducer}) => ({restoreTokenReducer});

const mapDispatchToProps = {signOut}

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawerContent);
