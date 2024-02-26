import { PhotoFile } from "react-native-vision-camera";
import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import showToast from "./toast";

export const getFilesInCameraRoll = async (amount: number) => {
    try {
        const response = await CameraRoll.getPhotos({
            first: amount,
            assetType: "Photos",
            groupTypes: "Album",
            groupName: "Camera Vision",
        })
        return response.edges
    } catch (error) {
        console.error('Error reading files from project folder:', error);
        return [];
    }
};

export const saveFilesInCameraRoll = async (file:PhotoFile) => {
    try {
        await CameraRoll.saveAsset(`file://${file.path}`, {
            type: "photo",
            album: "Camera Vision"
        })
    } catch (error) {
        showToast('Error saving file to project folder', "error");
    }
}