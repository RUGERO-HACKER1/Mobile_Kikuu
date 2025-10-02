import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function KikuuHome() {
  const categories = [
    { name: "Wish List", img: require("./image/download 10.png") },
    { name: "Wholesale", img: require("./image/download (10).jpg") },
    { name: "Bargain Zone", img: require("./image/download (11).jpg") },
    { name: "New Arrival", img: require("./image/download (12).jpg") },
    { name: "Dress", img: require("./image/download (13).jpg") },
    { name: "Tops", img: require("./image/download (14).jpg") },
    { name: "Sneakers", img: require("./image/download (3).jpg") },
    { name: "Earphones", img: require("./image/download (4).jpg") },
  ];

  // 🔄 Banner Images
  const banners = [
    require("./image/ima3.jpg"),
    require("./image/ima2.jpg"),
    require("./image/images.jpg"),
  ];

  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (index + 1) % banners.length;
      setIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 1000); // ⏱️ 1 second

    return () => clearInterval(timer);
  }, [index]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* 🔍 Search Bar */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Feel Free To Search WhatEver You Want 🗣️🔍"
            placeholderTextColor="#888"
          />
          <Image source={require("./image/download2.png")} style={styles.flag} />
        </View>

        {/* 🖼️ Auto-sliding Banner */}
        <FlatList
          ref={flatListRef}
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Image source={item} style={styles.banner} resizeMode="cover" />
          )}
        />

        {/* 🔘 Categories Grid */}
        <View style={styles.categoryGrid}>
          {categories.map((cat, i) => (
            <TouchableOpacity key={i} style={styles.categoryItem}>
              <Image source={cat.img} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🎉 Promo Banner */}
        <Image
          source={require("./image/im1.jpg")}
          style={styles.promoBanner}
          resizeMode="cover"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 14,
  },
  flag: {
    width: 28,
    height: 20,
    marginLeft: 10,
    borderRadius: 4,
  },
  banner: {
    width: width, // full screen width
    height: 160,
    marginTop: 10,
    borderRadius: 10,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 15,
  },
  categoryItem: {
    width: "22%",
    alignItems: "center",
    marginVertical: 12,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  promoBanner: {
    width: "100%",
    height: 140,
    marginTop: 10,
    borderRadius: 12,
  },
});
