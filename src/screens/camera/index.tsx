import React, { Fragment, useEffect, useRef, useState } from 'react'
import showToast from '../../utils/toast'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useCameraDevice, useCameraPermission, Camera as CameraVision } from 'react-native-vision-camera'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBoltLightning, faBullseye, faCameraRotate, faImages } from '@fortawesome/free-solid-svg-icons'
import { handleNavigate, handleReplaceScreen } from '../../utils/handleNavigate'
import { PropsNvI, Screens } from '../../navigation/navigation.interface'
import { CameraDevice } from './camera.screen.interface'
import { camera_style } from './camera.screen.style'
import { useIsFocused } from '@react-navigation/native'
import { useAppState } from '@react-native-community/hooks'
import { saveFilesInCameraRoll } from '../../utils/cameraRoll'

export default function Camera(navigationProps: PropsNvI) {

    const { hasPermission: hasPermissionCamera, requestPermission: requestPermissionCamera } = useCameraPermission()
    const [currentCameraDevice, setCurrentCameraDevice] = useState<CameraDevice>("back")
    const [currentFps, setCurrentFps] = useState<number>(30)
    const [flashStatus, setFlashStatus] = useState<"on" | "off">("off")
    const [isHdrActive, setIsHdrActive] = useState<boolean>(false)
    const device = useCameraDevice(currentCameraDevice)
    const camera = useRef<CameraVision>(null)
    const isFocused = useIsFocused()
    const appState = useAppState()
    const isActive = isFocused && appState === "active"

    useEffect(() => {
        handleInitializeCamera()
    }, [])

    const handleRequestPermissionCamera = async () => {
        requestPermissionCamera()
            .then(resultRequestPermissionCamera => {
                if (!resultRequestPermissionCamera) {
                    showToast(`We need camera permission`, "error")
                }else{setFlashStatus("on")}
            })
            .catch(() => {
                showToast(`Error on request camera's permission, try again`, "error")
            })
    }

    const handleTakePhoto = async () => {
        const photo = await camera.current!.takePhoto({
            flash: flashStatus
        })
        saveFilesInCameraRoll(photo)
    }

    const handleInitializeCamera = async () => {
        if (!hasPermissionCamera) {
            handleRequestPermissionCamera()
        }
    }

    if (device == null || device == undefined) handleReplaceScreen(navigationProps, Screens.NDV)

    return (
        <Fragment>
            <CameraVision
                ref={camera}
                device={device!}
                isActive={isActive}
                style={StyleSheet.absoluteFill}
                torch={flashStatus}
                photo={!isHdrActive}
                photoHdr={isHdrActive}
                fps={currentFps}
            />

            <View style={camera_style.container}>
                <View style={camera_style.headerOptions}>
                    <TouchableOpacity
                        onPress={() => setCurrentCameraDevice(currentCameraDevice === "front" ? "back" : "front")}
                    >
                        <FontAwesomeIcon color='white' size={25} icon={faCameraRotate} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setFlashStatus(flashStatus === "off" ? "on" : "off")}
                    >
                        <FontAwesomeIcon color={flashStatus === "on" ? "yellow" : "white"} size={25} icon={faBoltLightning} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setCurrentFps(currentFps === 30 ? 60 : 30)}
                    >
                        <Text style={{ color: `${currentFps === 60 ? 'yellow' : 'white'}`, fontWeight: "bold" }}>60 FPS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsHdrActive(!isHdrActive)}
                    >
                        <Text style={{ color: `${isHdrActive ? 'yellow' : 'white'}`, fontWeight: "bold" }}>HDR</Text>
                    </TouchableOpacity>
                </View>

                <View style={camera_style.footerOptions}>
                    <TouchableOpacity
                        onPress={() => handleNavigate(navigationProps, Screens.PTS)}
                    >
                        <FontAwesomeIcon color='white' secondaryColor='purple' size={40} icon={faImages} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleTakePhoto()}
                    >
                        <FontAwesomeIcon color='white' size={60} icon={faBullseye} />
                    </TouchableOpacity>
                </View>
            </View>
        </Fragment>
    )
}
