import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import 'react-native-gesture-handler';

import CameraScreen from './screens/CameraScreen';
import SensorsScreen from './screens/SensorsScreen';
import GalleryScreen from './screens/GalleryScreen';
import MediaViewer from './screens/MediaViewer';

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Camera" component={CameraScreen} />
    <Tab.Screen name="Sensors" component={SensorsScreen} />
    <Tab.Screen name="Gallery" component={GalleryScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="MediaViewer" component={MediaViewer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;