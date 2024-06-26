import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import 'react-native-gesture-handler';

import CameraScreen from './screens/CameraScreen';
import SensorsScreen from './screens/SensorsScreen';
import GalleryScreen from './screens/GalleryScreen';
import MediaViewer from './screens/MediaViewer';

enableScreens();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Sensors" component={SensorsScreen} />
        <Tab.Screen name="Gallery" component={GalleryScreen} />
        <Tab.Screen 
          name="MediaViewer" 
          component={MediaViewer} 
          options={{
            tabBarStyle: { display: 'none' },
            unmountOnBlur: true,
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
