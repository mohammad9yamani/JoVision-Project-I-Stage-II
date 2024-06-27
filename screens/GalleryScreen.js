import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import Dialog from 'react-native-dialog';

const GalleryScreen = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const navigation = useNavigation();

  const loadMediaFiles = async () => {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const mediaExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mov'];
      const mediaFiles = files.filter(file =>
        file.isFile() && mediaExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
      );
      setMediaFiles(mediaFiles);
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

  const renameMedia = async () => {
    if (newFileName && selectedFilePath) {
      const newFilePath = `${RNFS.DocumentDirectoryPath}/${newFileName}`;
      try {
        await RNFS.moveFile(selectedFilePath, newFilePath);
        loadMediaFiles();
        setDialogVisible(false);
        setNewFileName('');
        setSelectedFilePath(null);
      } catch (error) {
        Alert.alert('Error', 'Failed to rename file');
      }
    }
  };

  const deleteMedia = async (filePath) => {
    try {
      await RNFS.unlink(filePath);
      loadMediaFiles();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete file');
    }
  };

  const openMedia = (index) => {
    navigation.navigate('MediaViewer', { files: mediaFiles, currentIndex: index });
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.mediaItem}>
      <Text>{item.name}</Text>
      <TouchableOpacity onPress={() => {
        setSelectedFilePath(item.path);
        setDialogVisible(true);
      }}>
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
    <View style={styles.container}>
      <FlatList
        data={mediaFiles}
        renderItem={renderItem}
        keyExtractor={item => item.path}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Rename File</Dialog.Title>
        <Dialog.Input
          placeholder="Enter new name"
          value={newFileName}
          onChangeText={setNewFileName}
        />
        <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="Rename" onPress={renameMedia} />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  mediaItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default GalleryScreen;
