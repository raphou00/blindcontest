// Importation des types nécessaires de React Navigation
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";

// Définition des types pour les paramètres de la pile de navigation
type RootStackParamList = {
    [e: string]: {
        room?: string,
        host?: boolean,
        name?: string
    };
};

// Définition des types pour la navigation et les routes
type ScreenNavigationProp = BottomTabNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList>;

// Définition des types pour les props de composant avec la navigation et la route
type ScreenProps = {
    navigation: ScreenNavigationProp;
    route: ScreenRouteProp;
};

// Exportation du type ScreenProps pour une utilisation dans d'autres fichiers
export type { ScreenProps };
