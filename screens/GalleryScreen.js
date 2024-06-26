import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';

const GalleryScreen = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const loadMediaFiles = async () => {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const mediaExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mov'];
      setMediaFiles(files.filter(file => file.isFile() &&
       mediaExtensions.some(ext => file.name.toLowerCase().endsWith(ext))))
       
    } catch (error) {
      console.error('Failed to load media files', error);
    }
  };

  useEffect(() => {
    loadMediaFiles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadMediaFiles().then(() => setRefreshing(false));
  };

  const renameMedia = async (filePath) => {
    const newName = prompt('Enter new name for the media file');
    if (newName) {
      const newFilePath = `${RNFS.DocumentDirectoryPath}/${newName}`;
      await RNFS.moveFile(filePath, newFilePath);
      loadMediaFiles();
    }
  };

  const deleteMedia = async (filePath) => {
    await RNFS.unlink(filePath);
    loadMediaFiles();
  };

  const openMedia = (index) => {
    navigation.navigate('MediaViewer', { files: mediaFiles, currentIndex: index });
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.mediaItem}> 
      <Text>{item.name}</Text>
      <TouchableOpacity onPress={() => renameMedia(item.path)}>
        <Text>Rename</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteMedia(item.path)}>
        <Text>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openMedia(index)}>
        <Text>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={mediaFiles}
      renderItem={renderItem}
      keyExtractor={item => item.path}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  mediaItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default GalleryScreen;
