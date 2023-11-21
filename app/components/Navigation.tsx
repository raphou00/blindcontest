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

const Tab = createBottomTabNavigator<any>();

const setScreenOptions = (title: string, name: string) => ({
    title: title,
    tabBarActiveTintColor: "slateblue",
    tabBarIcon: ({ color }: any) => <FontAwesome5 name={name} color={color} size={20} solid />,
    tabBarLabelStyle: { fontSize: 12 },
});

export default function Navigation() {
    const { user } = useAuth();

    return (
        <NavigationContainer theme={DarkTheme}>
            <Tab.Navigator initialRouteName="home">
                <Tab.Screen name="home" component={Home} options={setScreenOptions("Accueil", "home")} />
                <Tab.Screen name="join" component={Join} options={setScreenOptions("Rejoindre", "play")} />
                <Tab.Screen name="create" component={Create} options={setScreenOptions("Créer", "pen")} />
                <Tab.Screen name="auth" component={user ? Profil : Auth} options={setScreenOptions(user ? "Profil" : "Connexion", "user")} />

                <Tab.Screen name="lobby" component={Lobby} options={{ title: "Joueurs", tabBarButton: () => <></> }} />
                <Tab.Screen name="game" component={Game} options={{ title: "Jeu", tabBarButton: () => <></> }} />
                <Tab.Screen name="results" component={Results} options={{ title: "Résultats", tabBarButton: () => <></> }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
