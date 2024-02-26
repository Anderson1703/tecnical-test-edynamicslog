import { RootSiblingParent } from 'react-native-root-siblings';
import Router from './src/navigation/router.navigation';

export default function App() {
  return (
    <RootSiblingParent>
      <Router />
    </RootSiblingParent>
  );
}
