import React from 'react'
import { View, Text } from 'react-native'
import { no_device } from './no-device.screen.stye'

export default function NoDeviceCamera() {
    return (
        <View style={no_device.container}>
            <Text style={no_device.title}>No Camera device</Text>
        </View>
    )
}
