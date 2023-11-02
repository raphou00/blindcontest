import { StyleSheet } from "react-native";

export default StyleSheet.create({
    input: {
        width: 300,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        textAlign: "center",
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        borderBottomLeftRadius: 6,
        borderWidth: 1,
        borderColor: "#646CFF",
        borderStyle: "solid",
        backgroundColor: "#1A1A1A",
        color: "#F9F9F9",
        fontWeight: "bold",
        shadowOffset: {
          width: 3,
          height: 3
        },
        shadowRadius: 0,
        shadowColor: "#000",
        shadowOpacity: 1
    },
    button: {
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        borderBottomLeftRadius: 6,
        borderWidth: 1,
        borderColor: "#1A1A1A",
        borderStyle: "solid",
        shadowOffset: {
          width: 3,
          height: 3
        },
        shadowRadius: 0,
        shadowColor: "#000",
        shadowOpacity: 1,
        paddingTop: 6,
        paddingRight: 6,
        paddingBottom: 6,
        paddingLeft: 6,
        backgroundColor: "#646CFF",
        cursor: "pointer",
        transition: "all 0.1s",
        textAlign: "center"
    },
    buttonText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#F9F9F9"
    }
});