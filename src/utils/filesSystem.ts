import { PhotoFile, VideoFile } from "react-native-vision-camera";
import RNFS from 'react-native-fs';
import showToast from "./toast";


export const getFilesInFolder = async () => {
    const projectFolderPath = `${RNFS.DocumentDirectoryPath}/images`;
    try {
        const files = await RNFS.readDir(projectFolderPath);
        return files;
    } catch (error) {
        console.error('Error reading files from project folder:', error);
        return [];
    }
};

export const saveFiles = async (file: PhotoFile | VideoFile) => {
    const projectFolderPath = `${RNFS.DocumentDirectoryPath}/images`;
    let fileName;

    if (file as PhotoFile) {
        fileName = `photo_${Date.now()}.jpg`;
    } else if (file as VideoFile) {
        fileName = `video_${Date.now()}.mp4`;
    } else {
        showToast('Unsupported file type', "error");
        return;
    }

    try {
        await RNFS.mkdir(projectFolderPath);
        await RNFS.copyFile(file.path, `${projectFolderPath}/${fileName}`);
    } catch (error) {
        showToast('Error saving file to project folder', "error");
    }
}