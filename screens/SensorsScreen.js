import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { accelerometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';

const SensorsScreen = () => {
  const [location, setLocation] = useState({});
  const [orientation, setOrientation] = useState({});
  const [hasPermission, setHasPermission] = useState(false);

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
    <View style={styles.container}>
      <Text>Altitude: {location.altitude}</Text>
      <Text>Longitude: {location.longitude}</Text>
      <Text>Latitude: {location.latitude}</Text>
      <Text>Speed: {location.speed}</Text>
      <Image source={getSpeedImage()} style={styles.icon} />
      <Text>X: {orientation.x}</Text>
      <Text>Y: {orientation.y}</Text>
      <Text>Z: {orientation.z}</Text>
      <Image source={getOrientationImage()} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default SensorsScreen;
