import React, { useEffect, useState } from 'react'
import { FlatList, View, Image, ScrollView } from 'react-native'
import { getFilesInCameraRoll } from '../../utils/cameraRoll';
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';

export default function Pictures() {

  const [files, setFiles] = useState<PhotoIdentifier[]>([]);

  useEffect(() => {
    getFilesInCameraRoll(10).then((results: PhotoIdentifier[]) => {
      setFiles(results)
    })
  }, []);

  return (
    <ScrollView horizontal={false}>
      <FlatList
        data={files}
        renderItem={({ item }) => (
          <View>
            {item.node.id && (
              <Image
                source={{ uri: item.node.image.uri }}
                style={{ width: 100, height: 100 }}
              />
            )}
          </View>
        )}
        keyExtractor={(item) => item.node.id}
      />
    </ScrollView>
  )
}
