import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FaHouse, FaPenClip, FaPlay, FaUser } from "react-icons/fa6";
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

const setScreenOptions = (title: string, Icon: any) => Object({
    title: title,
    tabBarActiveTintColor: "#646CFF",
    tabBarIcon: ({ color }: any) => <Icon color={color} size={20} />,
    tabBarLabelStyle: { fontSize: 12 }
});

export default function Navigation() {
    const { user } = useAuth();

    console.log(user);
    
    return (
        <NavigationContainer theme={DarkTheme}>
            <Tab.Navigator initialRouteName="home">
                <Tab.Screen name="home" component={Home} options={setScreenOptions("Accueil", FaHouse)} />
                <Tab.Screen name="create" component={Create} options={setScreenOptions("Créer", FaPenClip)} />
                <Tab.Screen name="join" component={Join} options={setScreenOptions("Rejoindre", FaPlay)} />
                <Tab.Screen name="auth" component={user ? Profil : Auth} options={setScreenOptions(user ? "Profil" : "Connexion", FaUser)} />

                <Tab.Screen name="lobby" component={Lobby} options={{tabBarButton: () => <></>}} />
                <Tab.Screen name="game" component={Game} options={{tabBarButton: () => <></>}} />
                <Tab.Screen name="results" component={Results} options={{tabBarButton: () => <></>}} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
