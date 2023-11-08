import { StyleSheet } from "react-native";

export default StyleSheet.create({
    input: {
        width: 300,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        textAlign: "center",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#646CFF",
        backgroundColor: "#1A1A1A",
        color: "#F9F9F9",
        fontWeight: "bold",
        shadowOffset: {
          width: 3,
          height: 3
        },
        shadowRadius: 6,
        shadowColor: "#000",
        shadowOpacity: 1
    },
    button: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#1A1A1A",
        shadowOffset: {
          width: 3,
          height: 3
        },
        shadowRadius: 6,
        shadowColor: "#000",
        shadowOpacity: 1,
        padding: 6,
        backgroundColor: "#646CFF",
        textAlign: "center"
    },
    buttonText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#F9F9F9"
    }
});