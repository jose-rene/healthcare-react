import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from '@expo/vector-icons/Entypo';

export default (props) => {
    const {navigationProps} = props;
    const toggleDrawer = () => {
        navigationProps.toggleDrawer();
    }

    return (
        <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
                style={styles.drawerbtn}
                onPress={toggleDrawer}>
                <Icon name="menu" size={30} color={'white'}/>
            </TouchableOpacity>
        </View>
    );
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
