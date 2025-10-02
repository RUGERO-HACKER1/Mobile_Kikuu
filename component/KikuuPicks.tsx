import { useCart } from "@/contexts/CartContext";
import React from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

const categories = [
  { name: "Mobile Phone", image: require("./image/download.jpg") },
  { name: "Women's Clothing", image: require("./image/download 10.png") },
  { name: "Women's Shoes", image: require("@/assets/images/download (3).jpg") },
  { name: "Beauty & Hair", image: require("@/assets/images/download (2).jpg") },
  { name: "Women's Bags", image: require("@/assets/images/download (1).jpg") },
  { name: "Watches & Jewelry", image: require("./image/download (14).jpg") },
  { name: "Men's Shoes & Bags", image: require("./image/download (13).jpg") },
  { name: "Men's Clothing", image: require("@/assets/images/download (2).jpg") },
  { name: "Electronics", image: require("@/assets/images/download (3).jpg") },
  { name: "Love Baby", image: require("@/assets/images/download (4).jpg") },
  { name: "Home", image: require("@/assets/images/download (5).jpg") },
  { name: "Today's Deal", image: require("./image/download (11).jpg") },
    { name: "Mobile Phone", image: require("./image/download.jpg") },
  { name: "Women's Clothing", image: require("./image/download 10.png") },
  { name: "Women's Shoes", image: require("@/assets/images/download (3).jpg") },
  { name: "Beauty & Hair", image: require("@/assets/images/download (2).jpg") },
  { name: "Women's Bags", image: require("@/assets/images/download (1).jpg") },
  { name: "Watches & Jewelry", image: require("./image/download (14).jpg") },
  { name: "Men's Shoes & Bags", image: require("./image/download (13).jpg") },
  { name: "Men's Clothing", image: require("@/assets/images/download (2).jpg") },
  { name: "Electronics", image: require("@/assets/images/download (3).jpg") },
  { name: "Love Baby", image: require("@/assets/images/download (4).jpg") },



];

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const itemMargin = 12;
const itemSize = screenWidth / numColumns - itemMargin * 2; 

export default function KikuuPicks() {
  const { addItem } = useCart();
  const toId = (name: string, index: number) => `${name}-${index}`;
  return (
    
    <ScrollView style={styles.container}>
    
      <Text style={styles.header}>🛒KiKUU Picks</Text>

      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.item} activeOpacity={0.8}>
            
            <Text style={styles.title}>{item.name}</Text>

        
            <Image source={item.image} style={styles.image} resizeMode="contain" />

            
            <TouchableOpacity
              onPress={() =>
                addItem(
                  {
                    id: toId(item.name, index),
                    name: item.name,
                    priceCents: 299900, // demo price
                    currency: "RWF",
                    image: item.image,
                  },
                  1
                )
              }
            >
              <Text style={styles.viewAll}>Add to Cart</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      
    </ScrollView>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 14,
    color: "#222",
    textAlign: "center",
  },
  item: {
    width: itemSize,
    height: itemSize,
    margin: itemMargin,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 5,
  },
  image: {
    width: "70%",
    height: "50%",
  },
  viewAll: {
    fontSize: 13,
    fontWeight: "500",
    color: "#007AFF",
  },
});
