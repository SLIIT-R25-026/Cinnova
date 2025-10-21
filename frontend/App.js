import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import HomeScreen from './screens/HomeScreen';
import CustomSplashScreen from './components/CustomSplashScreen';
import './global.css';
import CinnovaScanScreen from './screens/CinnovaScanScreen';
import CinnovaScanResultsScreen from './screens/CinnovaScanResultsScreen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, 
        await new Promise(resolve => setTimeout(resolve, 10000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return <CustomSplashScreen onFinish={() => setIsReady(true)} />;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <StatusBar style="light" />
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />

        <Stack.Screen 
          name="CinnovaScanHome" 
          component={CinnovaScanScreen} 
        />
        
        <Stack.Screen 
          name="CinnovaScanResults" 
          component={CinnovaScanResultsScreen} 
        />
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
