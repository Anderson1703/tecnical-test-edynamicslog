import Toast from 'react-native-root-toast'

export default function showToast(message:string, type:"success" | "error") {
  return Toast.show(message, {
    duration: Toast.durations.LONG,
    textColor: type==="success"?"green":"red"
  });
}
