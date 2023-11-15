import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
    [e: string]: {
        room?: string,
        host?: boolean
    };
};
  
type ScreenNavigationProp = BottomTabNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList>;
  
type ScreenProps = {
    navigation: ScreenNavigationProp;
    route: ScreenRouteProp;
};

export type { ScreenProps };