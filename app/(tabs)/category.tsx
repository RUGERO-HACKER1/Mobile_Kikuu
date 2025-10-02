import React, { useState } from "react";
import { View, Text, SafeAreaView,TouchableOpacity, TextInput , FlatList, Image, StyleSheet } from "react-native";

const categories = [
  { id: "1", name: "Recommend" },
  { id: "2", name: "Clothing" },
  { id: "3", name: "Shoes" },
  { id: "4", name: "Luggage" },
  { id: "5", name: "Watch" },
  { id: "6", name: "Kids" },
  { id: "7", name: "Beauty" },


];

const products = {
  Recommend: [
    { id: "111", name: "Wishlist", image: require("./image/download (1).jpg") },
    { id: "211", name: "Wholesale", image: require("./image/download (10).jpg") },
    { id: "311", name: "Bargain Zone", image: require("./image/download (10).png") },
    { id: "1444", name: "New arrival", image: require("./image/download (11).jpg") },
    { id: "244", name: "Dress", image: require("./image/download (11).png") },
    { id: "344", name: "Tops", image: require("./image/download (12).jpg") },
    { id: "144", name: "Sneakers", image: require("./image/download (13).jpg") },
    { id: "2556", name: "Ear Phones", image: require("./image/download (14).jpg") },
    { id: "366", name: "Mobile Phones", image: require("./image/download (2).jpg") },
    { id: "001", name: "Womens's Clothing", image: require("./image/download (3).jpg") },
    { id: "286", name: "Women's Shoes", image: require("./image/download (4).jpg") },
    { id: "376", name: "Beauty & Hair", image: require("./image/download (5).jpg") },
    { id: "127", name: "Watches & Jewelry", image: require("./image/download (9).png") },
    { id: "247", name: "Men's Shoes & Bags", image: require("./image/download.jpg") },
    { id: "463", name: "Men's Clothing", image: require("./image/download (1).jpg") },
    { id: "124", name: "Electronics", image: require("./image/download (10).jpg") },
    { id: "2059", name: "Love Baby", image: require("./image/download (10).png") },
    { id: "3585", name: "Home", image: require("./image/download (11).jpg") },
        { id: "15858", name: "Wishlist", image: require("./image/download (1).jpg") },
    { id: "258", name: "Wholesale", image: require("./image/download (10).jpg") },
    { id: "3558", name: "Bargain Zone", image: require("./image/download (10).png") },
    { id: "15757", name: "New arrival", image: require("./image/download (11).jpg") },
    { id: "2855", name: "Dress", image: require("./image/download (11).png") },
    { id: "35858", name: "Tops", image: require("./image/download (12).jpg") },
    { id: "18585", name: "Sneakers", image: require("./image/download (13).jpg") },
    { id: "28585", name: "Ear Phones", image: require("./image/download (14).jpg") },
    { id: "385", name: "Mobile Phones", image: require("./image/download (2).jpg") },
    { id: "1446", name: "Womens's Clothing", image: require("./image/download (3).jpg") },
    { id: "2535", name: "Women's Shoes", image: require("./image/download (4).jpg") },
    { id: "3353", name: "Beauty & Hair", image: require("./image/download (5).jpg") },
    { id: "15336", name: "Watches & Jewelry", image: require("./image/download (9).png") },
    { id: "26363", name: "Men's Shoes & Bags", image: require("./image/download.jpg") },
    { id: "3536", name: "Men's Clothing", image: require("./image/download (1).jpg") },
    { id: "16363", name: "Electronics", image: require("./image/download (10).jpg") },
    { id: "2388", name: "Love Baby", image: require("./image/download (10).png") },
    { id: "3837", name: "Home", image: require("./image/download (11).jpg") },
        { id: "18383", name: "Wishlist", image: require("./image/download (1).jpg") },
    { id: "23838", name: "Wholesale", image: require("./image/download (10).jpg") },
    { id: "669753", name: "Bargain Zone", image: require("./image/download (10).png") },
    { id: "64571", name: "New arrival", image: require("./image/download (11).jpg") },
    { id: "7656652", name: "Dress", image: require("./image/download (11).png") },
    { id: "65353", name: "Tops", image: require("./image/download (12).jpg") },
    { id: "906541", name: "Sneakers", image: require("./image/download (13).jpg") },
    { id: "84322", name: "Ear Phones", image: require("./image/download (14).jpg") },
    { id: "54783", name: "Mobile Phones", image: require("./image/download (2).jpg") },
    { id: "000971", name: "Womens's Clothing", image: require("./image/download (3).jpg") },
    { id: "953342", name: "Women's Shoes", image: require("./image/download (4).jpg") },
    { id: "786553", name: "Beauty & Hair", image: require("./image/download (5).jpg") },
    { id: "9997861", name: "Watches & Jewelry", image: require("./image/download (9).png") },
    { id: "7654592", name: "Men's Shoes & Bags", image: require("./image/download.jpg") },
    { id: "98763", name: "Men's Clothing", image: require("./image/download (1).jpg") },
    { id: "32231", name: "Electronics", image: require("./image/download (10).jpg") },
    { id: "66642", name: "Love Baby", image: require("./image/download (10).png") },
    { id: "76673", name: "Home", image: require("./image/download (11).jpg") },
        { id: "09761", name: "Wishlist", image: require("./image/download (1).jpg") },
    { id: "276665", name: "Wholesale", image: require("./image/download (10).jpg") },
    { id: "3454534", name: "Bargain Zone", image: require("./image/download (10).png") },
    { id: "174323", name: "New arrival", image: require("./image/download (11).jpg") },
    { id: "209854", name: "Dress", image: require("./image/download (11).png") },
    { id: "343345", name: "Tops", image: require("./image/download (12).jpg") },
    { id: "10098", name: "Sneakers", image: require("./image/download (13).jpg") },
    { id: "23234", name: "Ear Phones", image: require("./image/download (14).jpg") },
    { id: "38990", name: "Mobile Phones", image: require("./image/download (2).jpg") },
    { id: "14532", name: "Womens's Clothing", image: require("./image/download (3).jpg") },
    { id: "2787675", name: "Women's Shoes", image: require("./image/download (4).jpg") },
    { id: "35653", name: "Beauty & Hair", image: require("./image/download (5).jpg") },
    { id: "1765656", name: "Watches & Jewelry", image: require("./image/download (9).png") },
    { id: "24334", name: "Men's Shoes & Bags", image: require("./image/download.jpg") },
    { id: "38976", name: "Men's Clothing", image: require("./image/download (1).jpg") },
    { id: "76554", name: "Electronics", image: require("./image/download (10).jpg") },
    { id: "24323", name: "Love Baby", image: require("./image/download (10).png") },
    { id: "3787", name: "Home", image: require("./image/download (11).jpg") },
        { id: "177534", name: "Wishlist", image: require("./image/download (1).jpg") },
    { id: "2765656", name: "Wholesale", image: require("./image/download (10).jpg") },
    { id: "30987", name: "Bargain Zone", image: require("./image/download (10).png") },
    { id: "154347", name: "New arrival", image: require("./image/download (11).jpg") },
    { id: "29776", name: "Dress", image: require("./image/download (11).png") },
    { id: "31246", name: "Tops", image: require("./image/download (12).jpg") },
    { id: "109983", name: "Sneakers", image: require("./image/download (13).jpg") },
    { id: "28765", name: "Ear Phones", image: require("./image/download (14).jpg") },
    { id: "33234", name: "Mobile Phones", image: require("./image/download (2).jpg") },
    { id: "1766", name: "Womens's Clothing", image: require("./image/download (3).jpg") },
    { id: "20987", name: "Women's Shoes", image: require("./image/download (4).jpg") },
    { id: "3863", name: "Beauty & Hair", image: require("./image/download (5).jpg") },
    { id: "198988", name: "Watches & Jewelry", image: require("./image/download (9).png") },
    { id: "222332", name: "Men's Shoes & Bags", image: require("./image/download.jpg") },
    { id: "3656545", name: "Men's Clothing", image: require("./image/download (1).jpg") },
    { id: "17666", name: "Electronics", image: require("./image/download (10).jpg") },
    { id: "278777", name: "Love Baby", image: require("./image/download (10).png") },
    { id: "3899", name: "Home", image: require("./image/download (11).jpg") },
    
  ],
  Clothing: [
            { id: "334441", name: "Polo shirt", image: require("./image/download (14).jpg") },
    { id: "99892", name: "Blouse", image: require("./image/download (2).jpg") },
    { id: "88883", name: "Coat", image: require("./image/download (3).jpg") },
        { id: "44421", name: "Sweater", image: require("./image/download (4).jpg") },
    { id: "23332", name: "Hoodie", image: require("./image/download (5).jpg") },
    { id: "7653", name: "Jacket", image: require("./image/download (9).png") },
      { id: "7878781", name: "Shorts", image: require("./image/download.jpg") },
    { id: "78882", name: "Crop top", image: require("./image/download (1).jpg") },
    { id: "23223", name: "Trousers / Pants", image: require("./image/download (10).jpg") },
    { id: "55531", name: "Skirt", image: require("./image/download (10).png") },
    { id: "55552", name: "Leggings", image: require("./image/download (11).jpg") },
    { id: "45453", name: "Joggers", image: require("./image/download (11).png") },
    { id: "77884", name: "T-Shirts", image: require("./image/download (1).jpg") },
    { id: "454545", name: "Jeans", image: require("./image/download (10).jpg") },
        { id: "98781", name: "Dresses", image: require("./image/download (10).png") },
    { id: "89882", name: "Sneakers", image: require("./image/download (11).jpg") },
    { id: "39898", name: "Backpacks", image: require("./image/download (11).png") },
        { id: "666901", name: "Shirt (formal)", image: require("./image/download (12).jpg") },
    { id: "565662", name: "Tank top", image: require("./image/download (13).jpg") },
    { id: "2323343", name: "Today's Deal", image: require("./image/download (2).jpg") },
  ],
  Shoes: [
    { id: "7886", name: "Sandals", image: require("./image/download (1).jpg") },
    { id: "8887", name: "Boots", image: require("./image/download (10).jpg") },
        { id: "787881", name: "Dresses", image: require("./image/download (10).png") },
    { id: "8882", name: "Sneakers", image: require("./image/download (13).jpg") },
    { id: "7777", name: "Backpacks", image: require("./image/download (11).png") },
    { id: "31246", name: "Tops", image: require("./image/download (12).jpg") },
    { id: "109983", name: "Sneakers", image: require("./image/download (13).jpg") },
    { id: "28765", name: "Ear Phones", image: require("./image/download (14).jpg") },
    { id: "33234", name: "Mobile Phones", image: require("./image/download (2).jpg") },
    { id: "1766", name: "Womens's Clothing", image: require("./image/download (3).jpg") },
    { id: "20987", name: "Women's Shoes", image: require("./image/download (4).jpg") },
    { id: "3863", name: "Beauty & Hair", image: require("./image/download (5).jpg") },
    { id: "198988", name: "Watches & Jewelry", image: require("./image/download (9).png") },
    { id: "222332", name: "Men's Shoes & Bags", image: require("./image/download.jpg") },
    { id: "3656545", name: "Men's Clothing", image: require("./image/download (1).jpg") },
    { id: "17666", name: "Electronics", image: require("./image/download (10).jpg") },
    { id: "278777", name: "Love Baby", image: require("./image/download (10).png") },
    { id: "3899", name: "Home", image: require("./image/download (11).jpg") },
    { id: "2342", name: "Sneakers", image: require("./image/download (10).jpg") },
    { id: "3234", name: "Backpacks", image: require("./image/download (11).png") },
        { id: "1476", name: "Dresses", image: require("./image/download (13).jpg") },
    { id: "2342", name: "Sneakers", image: require("./image/download (14).jpg") },
    { id: "567753", name: "Backpacks", image: require("./image/download (9).png") },
  ],
    Luggage: [
              { id: "55544551", name: "Dresses", image: require("./image/download (3).jpg") },
    { id: "54552", name: "Sneakers", image: require("./image/download (4).jpg") },
    { id: "3334455", name: "Backpacks", image: require("./image/download (5).jpg") },
        { id: "123451", name: "Dresses", image: require("./image/download (9).png") },
    { id: "23456", name: "Sneakers", image: require("./image/download.jpg") },
    { id: "3334556", name: "Backpacks", image: require("./image/download9.jpg") },
        { id: "13345", name: "Dresses", image: require("./image/download (1).jpg") },
    { id: "2342", name: "Sneakers", image: require("./image/download (10).jpg") },
    { id: "3234", name: "Backpacks", image: require("./image/download (11).png") },
        { id: "1476", name: "Dresses", image: require("./image/download (13).jpg") },
    { id: "2342", name: "Sneakers", image: require("./image/download (14).jpg") },
    { id: "567753", name: "Backpacks", image: require("./image/download (9).png") },
    { id: "7886", name: "Sandals", image: require("./image/download (1).jpg") },
    { id: "8887", name: "Boots", image: require("./image/download (10).jpg") },
        { id: "787881", name: "Dresses", image: require("./image/download (10).png") },
    { id: "8882", name: "Sneakers", image: require("./image/download (13).jpg") },
    { id: "7777", name: "Backpacks", image: require("./image/download (11).png") },
        { id: "55441", name: "Dresses", image: require("./image/download (12).jpg") },
    { id: "45552", name: "Sneakers", image: require("./image/download (14).jpg") },
    { id: "55443", name: "Backpacks", image: require("./image/download (2).jpg") },
  ],
      Kids: [
    { id: "7886", name: "Sandals", image: require("./image/download (1).jpg") },
    { id: "8887", name: "Boots", image: require("./image/download (10).jpg") },
        { id: "787881", name: "Dresses", image: require("./image/download (10).png") },
    { id: "8882", name: "Sneakers", image: require("./image/download (13).jpg") },
    { id: "7777", name: "Backpacks", image: require("./image/download (11).png") },
        { id: "55441", name: "Dresses", image: require("./image/download (12).jpg") },
    { id: "45552", name: "Sneakers", image: require("./image/download (14).jpg") },
    { id: "55443", name: "Backpacks", image: require("./image/download (2).jpg") },
        { id: "55544551", name: "Dresses", image: require("./image/download (3).jpg") },
    { id: "54552", name: "Sneakers", image: require("./image/download (4).jpg") },
    { id: "3334455", name: "Backpacks", image: require("./image/download (5).jpg") },
        { id: "123451", name: "Dresses", image: require("./image/download (9).png") },
    { id: "23456", name: "Sneakers", image: require("./image/download.jpg") },
    { id: "3334556", name: "Backpacks", image: require("./image/download9.jpg") },
        { id: "13345", name: "Dresses", image: require("./image/download (1).jpg") },
    { id: "2342", name: "Sneakers", image: require("./image/download (10).jpg") },
    { id: "3234", name: "Backpacks", image: require("./image/download (11).png") },
        { id: "1476", name: "Dresses", image: require("./image/download (13).jpg") },
    { id: "2342", name: "Sneakers", image: require("./image/download (14).jpg") },
    { id: "567753", name: "Backpacks", image: require("./image/download (9).png") },
  ],
      Watch: [
            { id: "3334455", name: "Backpacks", image: require("./image/download (5).jpg") },
        { id: "123451", name: "Dresses", image: require("./image/download (9).png") },
    { id: "23456", name: "Sneakers", image: require("./image/download.jpg") },
    { id: "3334556", name: "Backpacks", image: require("./image/download9.jpg") },
        { id: "13345", name: "Dresses", image: require("./image/download (1).jpg") },
    { id: "2342", name: "Sneakers", image: require("./image/download (10).jpg") },
    { id: "3234", name: "Backpacks", image: require("./image/download (11).png") },
        { id: "1476", name: "Dresses", image: require("./image/download (13).jpg") },
    { id: "2342", name: "Sneakers", image: require("./image/download (14).jpg") },
    { id: "567753", name: "Backpacks", image: require("./image/download (9).png") },
    { id: "7886", name: "Sandals", image: require("./image/download (11).jpg") },
    { id: "8887", name: "Boots", image: require("./image/download (12).jpg") },
        { id: "787881", name: "Dresses", image: require("./image/download.jpg") },
    { id: "8882", name: "Sneakers", image: require("./image/download (13).jpg") },
    { id: "7777", name: "Backpacks", image: require("./image/download (11).png") },
        { id: "55441", name: "Dresses", image: require("./image/download (12).jpg") },
    { id: "45552", name: "Sneakers", image: require("./image/download (14).jpg") },
    { id: "55443", name: "Backpacks", image: require("./image/download (2).jpg") },
        { id: "55544551", name: "Dresses", image: require("./image/download (3).jpg") },
    { id: "54552", name: "Sneakers", image: require("./image/download (4).jpg") },
  ],
      Beauty: [
    { id: "7886", name: "Sandals", image: require("./image/download9.jpg") },
    { id: "8887", name: "Boots", image: require("./image/download (5).jpg") },
        { id: "787881", name: "Dresses", image: require("./image/download (3).jpg") },
    { id: "8882", name: "Sneakers", image: require("./image/download (13).jpg") },
    { id: "7777", name: "Backpacks", image: require("./image/download (11).png") },
        { id: "55441", name: "Dresses", image: require("./image/download (12).jpg") },
    { id: "45552", name: "Sneakers", image: require("./image/download (14).jpg") },
    { id: "55443", name: "Backpacks", image: require("./image/download (2).jpg") },
        { id: "3334455", name: "Backpacks", image: require("./image/download (5).jpg") },
        { id: "123451", name: "Dresses", image: require("./image/download (9).png") },
    { id: "23456", name: "Sneakers", image: require("./image/download.jpg") },
    { id: "3334556", name: "Backpacks", image: require("./image/download9.jpg") },
        { id: "13345", name: "Dresses", image: require("./image/download (1).jpg") },
    { id: "2342", name: "Sneakers", image: require("./image/download (10).jpg") },
    { id: "3234", name: "Backpacks", image: require("./image/download (11).png") },
        { id: "1476", name: "Dresses", image: require("./image/download (13).jpg") },
    { id: "2342", name: "Sneakers", image: require("./image/download (14).jpg") },
    { id: "567753", name: "Backpacks", image: require("./image/download (9).png") },
        { id: "55544551", name: "Dresses", image: require("./image/download (3).jpg") },
    { id: "54552", name: "Sneakers", image: require("./image/download (4).jpg") },
  ],
};

export default function CategoriesScreen() {
  const [selected, setSelected] = useState("Recommend");
  const [searchQuery, setSearchQuery] = useState("");


  const filteredProducts = (products[selected] || []).filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>

        <View style={styles.sidebar}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryItem,
                selected === cat.name && styles.activeCategory,
              ]}
              onPress={() => setSelected(cat.name)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selected === cat.name && styles.activeText,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>


        <View style={styles.productsContainer}>

          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#e2980eff"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

  
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={({ item }) => (
              <View style={styles.productBox}>
                <Image source={item.image} style={styles.productImage} />
                <Text style={styles.productText}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flex: 1, backgroundColor: "#fff" },


  sidebar: { width: 120, backgroundColor: "#f7f7f7", paddingTop: 10 },
  categoryItem: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
  categoryText: { fontSize: 14, color: "#333" },
  activeCategory: { backgroundColor: "#fff" },
  activeText: { color: "orange", fontWeight: "bold" },

  
  productsContainer: { flex: 1, padding: 10 },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  productBox: {
    flex: 1,
    alignItems: "center",
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2, 
    shadowColor: "#000", 
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  productImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 8,
  },
  productText: { marginTop: 6, fontSize: 8, fontWeight: "500", color: "#333" },
});