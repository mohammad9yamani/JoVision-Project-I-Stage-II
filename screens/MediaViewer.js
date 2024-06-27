import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Button , TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import { useRoute, useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';

const MediaViewer = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { files, currentIndex } = route.params;
  const [index, setIndex] = useState(currentIndex);
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);



  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const seekForward = () => {
    const newTime = Math.min(currentTime + 5, duration);
    videoRef.current.seek(newTime);
  };

  const seekBackward = () => {
    const newTime = Math.max(currentTime - 5, 0);
    videoRef.current.seek(newTime);
  };

  const handleNext = () => {
    const nextIndex = (index + 1) % files.length;
    setIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = (index - 1 + files.length) % files.length;
    setIndex(prevIndex);
  };

  const file = files[index];

  if (file.name.endsWith('.mp4')) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

        <Video
          source={{ uri: `file://${file.path}` }}
          ref={videoRef}
          style={styles.video}
          paused={paused}
          resizeMode="contain"
          onProgress={({ currentTime }) => setCurrentTime(currentTime)}
          onLoad={({ duration }) => setDuration(duration)}
        />
       <View style={styles.buttonContainer}>

            <TouchableOpacity style={styles.button} onPress={handlePrevious}>
              <Text>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={togglePlayPause}>
              <Text>{paused ? "Play" : "Pause"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text>Next</Text>
            </TouchableOpacity>
            
        </View>
          
          <View style={styles.buttonContainer}>
          
            <TouchableOpacity style={styles.forwardBackwardButton} onPress={seekBackward}>
              <Text>Backward 5s</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forwardBackwardButton} onPress={seekForward}>
              <Text>Forward 5s</Text>
            </TouchableOpacity>

          </View>

      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

        <Image source={{ uri: `file://${file.path}` }} style={styles.image} />

        <View style={styles.buttonContainer}>
  
            <TouchableOpacity style={styles.button} onPress={handlePrevious}>
              <Text>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text>Next</Text>
            </TouchableOpacity>

        </View>
        
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '70%',
  },
  image: {
    width: '100%',
    height: '70%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    width: '20%',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  forwardBackwardButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  
  backButtonText: {
    color: 'white',
  },
});

export default MediaViewer;
