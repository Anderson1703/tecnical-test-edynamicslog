import React, { Fragment, useEffect, useRef, useState } from 'react'
import showToast from '../../utils/toast'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useCameraDevice, useCameraPermission, useMicrophonePermission, Camera as CameraVision } from 'react-native-vision-camera'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBoltLightning, faBullseye, faCamera, faCameraRotate, faImages, faVideo } from '@fortawesome/free-solid-svg-icons'
import { handleNavigate, handleReplaceScreen } from '../../utils/handleNavigate'
import { PropsNvI, Screens } from '../../navigation/navigation.interface'
import { CameraDevice } from './camera.screen.interface'
import { camera_style } from './camera.screen.style'
import { useIsFocused } from '@react-navigation/native'
import { useAppState } from '@react-native-community/hooks'
import { saveFilesInCameraRoll } from '../../utils/cameraRoll'

export default function Camera(navigationProps: PropsNvI) {

    const { hasPermission: hasPermissionCamera, requestPermission: requestPermissionCamera } = useCameraPermission()
    const { hasPermission: hasPermissionMicrophone, requestPermission: requestPermissionMicrophone } = useMicrophonePermission()
    const isFocused = useIsFocused()
    const appState = useAppState()

    const [isCameraActive, setIsCameraActive] = useState<boolean>(hasPermissionCamera && (isFocused && appState === "active"))
    const [currentCameraDevice, setCurrentCameraDevice] = useState<CameraDevice>("back")
    const [isPhoto, setIsPhoto] = useState<"photo" | "video">("photo")
    const [currentFps, setCurrentFps] = useState<number>(30)
    const [flashStatus, setFlashStatus] = useState<"on" | "off">("off")
    const [isHdrActive, setIsHdrActive] = useState<boolean>(false)

    const device = useCameraDevice(currentCameraDevice)
    const camera = useRef<CameraVision>(null)

    useEffect(() => {
        handleInitializeCamera()
    }, [])

    const handleRequestPermissionCamera = async () => {
        requestPermissionCamera()
            .then(resultRequestPermissionCamera => {
                setIsCameraActive(resultRequestPermissionCamera)
                if (!requestPermissionCamera) {
                    showToast(`We need camera permission`, "error")
                }
            })
            .catch(() => {
                showToast(`Error on request camera's permission, try again`, "error")
            })
    }

    const handleRequestPermissionMicrophone = async () => {
        requestPermissionMicrophone()
            .then((resultRequestPermissionMicrophone) => {
                if (resultRequestPermissionMicrophone) handleStartVideo()
                else showToast(`We need microphone permission`, "error")
            }).catch(() => {
                showToast(`Error on request microphone's permission, try again`, "error")
            })
    }

    const handleTakePhoto = async () => {
        const photo = await camera.current!.takePhoto({
            flash: flashStatus
        })
        saveFilesInCameraRoll(photo)
    }

    const verifyMicrophonePermission = () => {
        if (hasPermissionMicrophone) {
            handleStartVideo()
        } else {
            handleRequestPermissionMicrophone()
        }
    }

    const handleStartVideo = () => {
        camera.current!.startRecording({
            flash: flashStatus,
            onRecordingError(error) {
                showToast(`Error on recording video, try again`, "error")
            },
            onRecordingFinished(video) {
                saveFilesInCameraRoll(video)
            }
        })
    }

    const handleInitializeCamera = async () => {
        if (hasPermissionCamera) {
            setTimeout(() => {
                setIsCameraActive(true);
            }, 500)
        } else {
            handleRequestPermissionCamera()
        }
    }

    if (device == null || device == undefined) handleReplaceScreen(navigationProps, Screens.NDV)

    return (
        <Fragment>
            <CameraVision
                ref={camera}
                device={device!}
                isActive={isCameraActive}
                style={StyleSheet.absoluteFill}
                torch={flashStatus}
                photo={isPhoto === "photo" && !isHdrActive}
                video={isPhoto === "video" && !isHdrActive}
                videoHdr={isHdrActive && isPhoto === "video"}
                photoHdr={isHdrActive && isPhoto === "photo"}
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
                        onPress={() => {
                            if (isPhoto === "photo") {
                                handleTakePhoto()
                            } else if (isPhoto === "video") {
                                verifyMicrophonePermission()
                            }
                        }}
                    >
                        <FontAwesomeIcon color='white' size={60} icon={faBullseye} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsPhoto(isPhoto === "photo" ? "video" : "photo")}
                    >
                        <FontAwesomeIcon color='white' size={40} icon={isPhoto === "photo" ? faVideo : faCamera} />
                    </TouchableOpacity>
                </View>
            </View>
        </Fragment>
    )
}
