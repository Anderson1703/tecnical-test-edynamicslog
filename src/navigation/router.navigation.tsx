import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import DefaultNavigator from '.';

export default function Router() {
    return (
        <SafeAreaProvider>
            <NavigationContainer >
                <DefaultNavigator/>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}
