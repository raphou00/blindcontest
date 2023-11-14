import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
    [e: string]: any;
};
  
type ScreenNavigationProp = BottomTabNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList>;
  
type ScreenProps = {
    navigation: ScreenNavigationProp;
    route: ScreenRouteProp;
};

export type { ScreenProps };