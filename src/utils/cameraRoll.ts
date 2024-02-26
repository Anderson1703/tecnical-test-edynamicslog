import { PhotoFile, VideoFile } from "react-native-vision-camera";
import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import showToast from "./toast";

type File = PhotoFile | VideoFile;

export const getFilesInCameraRoll = async (amount: number) => {
    try {
        const response = await CameraRoll.getPhotos({
            first: amount,
            assetType: "All",
            groupTypes: "Album",
            groupName: "Camera Vision",
        })
        return response.edges
    } catch (error) {
        console.error('Error reading files from project folder:', error);
        return [];
    }
};

export const saveFilesInCameraRoll = async (file:File) => {
    let typeFile: "photo" | "video";

    if (file.path.endsWith('.jpg') || file.path.endsWith('.png')) {
        typeFile = "photo";
    } else if (file.path.endsWith('.mp4')) {
        typeFile = "video";
    } else {
        showToast('Unsupported file type', "error");
        return;
    }

    try {
        await CameraRoll.saveAsset(`file://${file.path}`, {
            type: typeFile,
            album: "Camera Vision"
        })
    } catch (error) {
        showToast('Error saving file to project folder', "error");
    }
}