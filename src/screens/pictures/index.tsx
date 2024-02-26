import React, { Fragment, useEffect, useState } from 'react'
import { FlatList, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import { getFilesInCameraRoll } from '../../utils/cameraRoll';
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import Modal from 'react-native-modal/dist/modal';

export default function Pictures() {

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [fileSelected, seFileSelected] = useState<PhotoIdentifier>();
  const [files, setFiles] = useState<PhotoIdentifier[]>([]);

  useEffect(() => {
    getFilesInCameraRoll(10).then((results: PhotoIdentifier[]) => {
      setFiles(results)
    })
  }, []);

  return (
    <ScrollView horizontal={false}>
      <View>
        {
          files.length > 0 ? (
            <FlatList
              data={files}
              renderItem={({ item }) => (
                <View>
                  {item.node.id && (
                    <TouchableOpacity
                      onPress={() => { seFileSelected(item); setIsModalVisible(true) }}
                      style={{
                        width: 100,
                        height: 100
                      }}>
                      <Image
                        source={{ uri: item.node.image.uri }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              keyExtractor={(item) => item.node.id}
            />
          ) : (<></>)
        }
      </View>
      <Fragment>
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setIsModalVisible(false)}
          onSwipeComplete={() => setIsModalVisible(false)}
        >
          <View style={{ flex: 1 }}>
            <Image
              source={{ uri: fileSelected!.node.image.uri }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        </Modal>
      </Fragment>
    </ScrollView>
  )
}
