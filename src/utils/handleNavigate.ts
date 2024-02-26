import { PropsNvI, Screens } from "../navigation/navigation.interface"

export const handleNavigate = ({ navigation }: PropsNvI, route: Screens, data?: any) => {
    navigation.navigate(route, data ? data : null)
}

export const handleReplaceScreen = ({ navigation }: PropsNvI, route: Screens, data?: any) => {
    navigation.replace(route, data ? data : null)
}