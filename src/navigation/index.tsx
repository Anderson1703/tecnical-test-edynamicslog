import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Screens } from './navigation.interface';
import Camera from '../screens/camera';
import NoDeviceCamera from '../screens/no-device';
import Pictures from '../screens/pictures';

export default function DefaultNavigator () {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator screenOptions={{ statusBarHidden: false }}>
            <Stack.Screen options={{headerShown:false}} name={Screens.CMV} component={Camera} />
            <Stack.Screen name={Screens.NDV} component={NoDeviceCamera} />
            <Stack.Screen name={Screens.PTS} component={Pictures} />
        </Stack.Navigator>
    )
}