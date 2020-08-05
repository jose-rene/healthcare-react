import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, SimpleLineIcons } from '@expo/vector-icons';

import Colors from '../../Config/Colors';
import Button from '../../components/Elements/Button';

const HomePage = ({ navigation }) => {
  const [clicked, setClicked] = useState(0);

  const handleClicked = () => {
    setClicked(clicked + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Home Page button clicked {clicked} times</Text>
      <Button onPress={handleClicked} title="Click Me" />
    </SafeAreaView>
  );
};

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
