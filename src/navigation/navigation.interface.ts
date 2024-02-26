import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type ObjectI = {
    [key: string]: any
}

export type PropsNvI = NativeStackScreenProps<ObjectI, string>;

export enum Screens{
    "CMV"="Camera Vision",
    "NDV"="No Device",
    "PTS"="Pictures"
}