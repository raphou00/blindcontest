import { StyleSheet, View, Text, Pressable } from "react-native";
import supabase from "../lib/supabase";
import { useAuth } from "../components/AuthProvider";
import Layout from "../components/Layout";
import gstyles from "../components/Styles";

export default function Profil() {
    // Utilisation du hook useAuth pour obtenir les informations sur l'utilisateur connecté
    const { user } = useAuth();

    // Fonction pour gérer la déconnexion de l'utilisateur
    const logOut = async () => {
        await supabase.auth.signOut();
    }

    return (
        // Utilisation du composant Layout pour la mise en page générale
        <Layout>
            {/* Conteneur avec un espacement vertical de 50 unités entre chaque élément */}
            <View style={{ gap: 50 }}>
                {/* Section pour afficher les points de l'utilisateur */}
                <View style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Titre avec la taille de police de 30 unités */}
                    <Text style={{ ...gstyles.buttonText, fontSize: 30 }}>Points</Text>
                    
                    {/* Conteneur pour afficher les points avec un style personnalisé */}
                    <View style={styles.point}>
                        {/* Texte pour afficher les points de l'utilisateur avec une taille de police de 100 unités */}
                        <Text style={styles.pointText}>{user?.user_metadata.point}</Text>
                    </View>
                </View>

                {/* Section pour afficher l'adresse e-mail de l'utilisateur */}
                <View>
                    {/* Titre avec un style personnalisé pour indiquer l'adresse e-mail */}
                    <Text style={{ ...gstyles.buttonText, textAlign: "left", padding: 5 }}>E-Mail</Text>
                    
                    {/* Champ de saisie désactivé pour afficher l'adresse e-mail de l'utilisateur */}
                    <Text style={gstyles.input}>{user?.email}</Text>
                </View>

                {/* Bouton de déconnexion avec une largeur de 300 unités et un style personnalisé */}
                <Pressable onPress={logOut} style={{ ...gstyles.button, width: 300 }}>
                    {/* Texte du bouton de déconnexion */}
                    <Text style={gstyles.buttonText}>Déconnexion</Text>
                </Pressable>
            </View>
        </Layout>
    );
}

// Styles pour le composant Profil
const styles = StyleSheet.create({
    point: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 100,
        borderColor: "slateblue",
        height: 200,
        width: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    pointText: {
        fontSize: 100,
        fontWeight: "bold",
        color: "slateblue",
    }
});
