import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { StyleSheet, View, Text, Image, Pressable, ScrollView } from "react-native";
import socket from "../lib/socket";

type CategoryProps = {
    activeCategories: string[],
    setActiveCategories: Dispatch<SetStateAction<string[]>>
};

type CardCategoryProps = {
    id: string,
    name: string,
    image: string,
    activeCategories: string[],
    setActiveCategories: Dispatch<SetStateAction<string[]>>
};

function CardCategory({ id, name, image, activeCategories, setActiveCategories }: CardCategoryProps) {
    const [active, setActive] = useState<boolean>(false);

    const toggleCategory = () => {
        setActiveCategories((prev: string[]) => {
            if (!prev.includes(id)) prev.push(id);
            else prev.splice(prev.indexOf(id), 1);

            setActive(activeCategories.includes(id));

            return prev;
        });
    };

    return (
        <Pressable style={{ width: 130 }} onPress={toggleCategory}>
            <View style={{ ...styles.categoryCard, borderColor: active ? "#535bf2" : "#FFFFFF" }}>
                <Image style={styles.categoryCardImg} source={{ uri: image }} />
                <Text style={styles.categoryCardName}>{name}</Text>
            </View>
        </Pressable>
    );
}

export default function Category({ activeCategories, setActiveCategories }: CategoryProps) {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        socket.emit("categories");

        const categoriesListener = (data: { categories: any[] }) => setCategories(data.categories);
        socket.on("categories", categoriesListener);
    }, []);

    return (
        <ScrollView style={styles.categoryContainer}>
            {
                categories.map((e: any) => 
                    <CardCategory
                        key={e.id}
                        id={e.id}
                        name={e.name}
                        image={e.icons[0].url}
                        activeCategories={activeCategories} 
                        setActiveCategories={setActiveCategories}
                    />)
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    categoryContainer: {
        height: 250,
        width: 290,
        overflow: "scroll",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    categoryCard: {
        height: 100,
        width: 275,
        borderRadius: 6,
        borderWidth: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 5
    },
    categoryCardImg: {
        height: 50,
        width: 50,
        borderRadius: 6
    },
    categoryCardName: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16
    },
});
