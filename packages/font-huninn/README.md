# JF Open Huninn

This is a map from JustFont Open Huninn (open 粉圓) used for Expo platform.

```javascript
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-openfonts";
import { JFOpenHuninn_400Regular } from "@expo-openfonts/huninn";

export default function App() {
  const { loaded } = useFonts({
    map: {
      JFOpenHuninn_400Regular
    }
  });

  if (!loaded) {
    return <AppLoading />
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

      <Text style={{ fontFamily: 'JFOpenHuninn_400Regular' }}>
        JustFont OpenHuninn
      </Text>

    </View>);
}

```