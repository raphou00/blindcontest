import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAuth } from "./helpers/auth-provider";
import Home from "./screens/Home";
import Create from "./screens/Create";
import Join from "./screens/Join";
import Lobby from "./screens/Lobby";
import Game from "./screens/Game";
import Results from "./screens/Results";
import Auth from "./screens/Auth";
import Profil from "./screens/Profil";

const Tab = createBottomTabNavigator();

const setScreenOptions = (title: string, name: string) => Object({
    title: title,
    tabBarActiveTintColor: "#646CFF",
    tabBarIcon: ({ color }: any) => <FontAwesome5 name={name} color={color} size={20} solid />,
    tabBarLabelStyle: { fontSize: 12 }
});

export default function Navigation() {
    const { user } = useAuth();
    
    return (
        <NavigationContainer theme={DarkTheme}>
            <Tab.Navigator initialRouteName="home">
                <Tab.Screen name="home" component={Home} options={setScreenOptions("Accueil", "home")} />
                <Tab.Screen name="create" component={Create} options={setScreenOptions("Créer", "pen")} />
                <Tab.Screen name="join" component={Join} options={setScreenOptions("Rejoindre", "play")} />
                <Tab.Screen name="auth" component={user ? Profil : Auth} options={setScreenOptions(user ? "Profil" : "Connexion", "user")} />

                <Tab.Screen name="lobby" component={Lobby} options={{ title: "Joueurs", unmountOnBlur: true, tabBarButton: () => <></> }} />
                <Tab.Screen name="game" component={Game} options={{ title: "Jeu", tabBarButton: () => <></> }} />
                <Tab.Screen name="results" component={Results} options={{ title: "Résultats", tabBarButton: () => <></> }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
