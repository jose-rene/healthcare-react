import React from 'react';
import { StyleSheet, Image } from 'react-native';
import Center from './Center';

const Logo = () => {
  return (
    <Center>
      <Image
        source={require('../assets/images/splash.png')}
        style={styles.logo}
      />
    </Center>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 200,
    resizeMode: 'contain',
    marginTop: 20,
  },
});

export default Logo;
