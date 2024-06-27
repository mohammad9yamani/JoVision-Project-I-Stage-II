import React, { useState, useRef, useEffect } from 'react';
import { View, Button, StyleSheet, Image, Alert, Text, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';

const CameraScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraMode, setCameraMode] = useState('photo');
  const [cameraFacing, setCameraFacing] = useState('back');
  const cameraRef = useRef(null);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    const checkPermission = async () => {
      if (!hasPermission) {
        const status = await requestPermission();
        console.log(status);
        if (!status) {
          Alert.alert('Permission Denied', 'Camera permission is required to take photos or record videos.');
        }
      }
    };

    checkPermission();
  }, [hasPermission, requestPermission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo_captured = await cameraRef.current.takePhoto({
        qualityPrioritization: 'speed',
      });
      const fileName = `Mohammad_${new Date().toISOString()}.jpg`;
      setPhoto({ path: photo_captured.path, fileName });
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      const video_captured = await cameraRef.current.startRecording({
        onRecordingFinished: (video) => {
          const fileName = `Mohammad_${new Date().toISOString()}.mp4`;
          setPhoto({ path: video.path, fileName });
          setIsRecording(false);
        },
        onRecordingError: (error) => {
          console.error(error);
          setIsRecording(false);
        },
      });
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      await cameraRef.current.stopRecording();
    }
  };

  const handleCapture = () => {
    if (cameraMode === 'photo') {
      takePicture();
    } else {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };

  const saveMedia = async (media) => {
    const destPath = `${RNFS.DocumentDirectoryPath}/${media.fileName}`;
    await RNFS.moveFile(media.path, destPath);
    setPhoto(null);
    Alert.alert('Media saved!', 'The media has been saved successfully.');
  };
  
  const discardMedia = async () => {
    await RNFS.unlink(photo.path);
    setPhoto(null);
  };
  
  const switchCamera = () => {
    setCameraFacing((prevFacing) => (prevFacing === 'back' ? 'front' : 'back'));
  };

  const switchMode = () => {
    setCameraMode((prevMode) => (prevMode === 'photo' ? 'video' : 'photo'));
  };

  if (device == null || !hasPermission) return <View><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      {photo ? (
        <>
          <Image source={{ uri: `file://${photo.path}` }} style={styles.preview} />
          <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={() => saveMedia(photo)}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.discardButton} onPress={discardMedia}>
            <Text style={styles.buttonText}>Discard</Text>
          </TouchableOpacity>
        </View>
        </>
      ) : (
        <>
          <Camera
            style={styles.camera}
            ref={cameraRef}
            device={device}
            isActive={true}
            photo={cameraMode === 'photo'}
            video={cameraMode === 'video'}
          />
          <View style={styles.buttonContainer}>
        
          <TouchableOpacity style={styles.switchButton} onPress={switchCamera}>
            <Text>Switch Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
            <Text>{cameraMode === 'photo' ? 'Take Photo' : (isRecording ? 'Stop Recording' : 'Record Video')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.switchButton} onPress={switchMode}>
            <Text>Switch Mode</Text>
          </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    marginHorizontal: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: '20%',
  },
  switchButton: {
    marginHorizontal: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: '20%',
  },
  saveButton: {
    marginHorizontal: 10,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    width: '20%',
  },
  discardButton: {
    marginHorizontal: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '20%',
  },
  buttonText: {
    color: 'white',
  },
});

export default CameraScreen;
