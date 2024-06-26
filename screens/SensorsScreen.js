import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert , Dimensions} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { accelerometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';

const SensorsScreen = () => {
  const [location, setLocation] = useState({});
  const [orientation, setOrientation] = useState({});
  const [hasPermission, setHasPermission] = useState(false);

  const { width, height } = Dimensions.get('window');
  const isPortrait = height >= width;

  useEffect(() => {
    const requestPermissions = async () => {
      const statuses = await requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ]);
      if (statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'granted' &&
          statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === 'granted') {
        console.log(statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
        setHasPermission(true);
      } else {
        Alert.alert('Permissions not granted', 'Please enable location and sensor permissions in your device settings.');
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    if (!hasPermission) return;

    const locationWatchId = Geolocation.watchPosition(
      (position) => {
        const { altitude, longitude, latitude, speed } = position.coords;
        setLocation({ altitude, longitude, latitude, speed });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 0, interval: 10000 }
    );

    setUpdateIntervalForType(SensorTypes.accelerometer, 500);
    const orientationSubscription = accelerometer.subscribe({
      next: ({ x, y, z }) => setOrientation({ x, y, z }),
      error: (error) => console.log('The sensor is not available', error),
      complete: () => console.log('Subscription complete')
    });

    return () => {
      Geolocation.clearWatch(locationWatchId);
      orientationSubscription.unsubscribe();
    };
  }, [hasPermission]);

  const getSpeedImage = () => {
    const speed = location.speed || 0;
    if (speed > 30) return require('./resources/car.png'); // change to appropriate speed thresholds
    if (speed > 5) return require('./resources/walking.png');
    return require('./resources/sitting.png');
  };

  const getOrientationImage = () => {
    const { x, y } = orientation;
    if (x > 7) return require('./resources/landscape-left.png');
    if (x < -7) return require('./resources/landscape-right.png');
    if (y > 7) return require('./resources/portrait-up.png');
    if (y < -7) return require('./resources/portrait-down.png');
    return require('./resources/unknown.png');
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Waiting for permissions...</Text>
      </View>
    );
  }

  return (
<View style={[styles.container, isPortrait ? styles.portraitContainer : styles.landscapeContainer]}>

<View style={styles.dataContainer}>
      <Text style={styles.label} >Altitude: {location.altitude}</Text>
      <Text style={styles.label} >Longitude: {location.longitude}</Text>
      <Text style={styles.label} >Latitude: {location.latitude}</Text>
      <Text style={styles.label} >Speed: {location.speed}</Text>
</View>
      <Image source={getSpeedImage()} style={styles.icon} />

<View style={styles.dataContainer}>
      <Text style={styles.label} >X: {orientation.x}</Text>
      <Text style={styles.label} >Y: {orientation.y}</Text>
      <Text style={styles.label} >Z: {orientation.z}</Text>
</View>

      <Image source={getOrientationImage()} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  portraitContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  landscapeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dataContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    marginVertical: 20,
  },
});

export default SensorsScreen;
