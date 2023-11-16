import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAuth } from "./AuthProvider";
import Home from "../screens/Home";
import Create from "../screens/Create";
import Join from "../screens/Join";
import Lobby from "../screens/Lobby";
import Game from "../screens/Game";
import Results from "../screens/Results";
import Auth from "../screens/Auth";
import Profil from "../screens/Profil";

// Création d'un navigateur à onglets basé sur la bibliothèque react-navigation
const Tab = createBottomTabNavigator<any>();

// Fonction utilitaire pour définir les options d'écran pour les onglets
const setScreenOptions = (title: string, name: string) => ({
    title: title,
    tabBarActiveTintColor: "slateblue",
    tabBarIcon: ({ color }: any) => <FontAwesome5 name={name} color={color} size={20} solid />,
    tabBarLabelStyle: { fontSize: 12 },
});

export default function Navigation() {
    const { user } = useAuth();

    return (
        // Conteneur de navigation
        <NavigationContainer theme={DarkTheme}>
            {/* Navigateur à onglets */}
            <Tab.Navigator initialRouteName="home">
                {/* Onglets avec leurs écrans correspondants et options spécifiques */}
                <Tab.Screen name="home" component={Home} options={setScreenOptions("Accueil", "home")} />
                <Tab.Screen name="join" component={Join} options={setScreenOptions("Rejoindre", "play")} />
                <Tab.Screen name="create" component={Create} options={setScreenOptions("Créer", "pen")} />
                <Tab.Screen name="auth" component={user ? Profil : Auth} options={setScreenOptions(user ? "Profil" : "Connexion", "user")} />

                {/* Ces écrans ont des options spécifiques et ne sont pas accessibles directement depuis les onglets */}
                <Tab.Screen name="lobby" component={Lobby} options={{ title: "Joueurs", tabBarButton: () => <></> }} />
                <Tab.Screen name="game" component={Game} options={{ title: "Jeu", tabBarButton: () => <></> }} />
                <Tab.Screen name="results" component={Results} options={{ title: "Résultats", tabBarButton: () => <></> }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
