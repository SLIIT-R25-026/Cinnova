import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

export default function CustomSplashScreen({ onFinish }) {
  useEffect(() => {
    // Hide the default splash screen
    SplashScreen.hideAsync();
    
    // Show custom splash for 3 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('../assets/splash_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Overlay with Logo */}
      <View style={styles.overlay}>
        <Image 
          source={require('../assets/logo/cinnova_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(111, 110, 110, 0.3)', // Semi-transparent overlay
    width: width,
    height: height,
  },
  logo: {
    width: 250,
    height: 250,
  },
});
