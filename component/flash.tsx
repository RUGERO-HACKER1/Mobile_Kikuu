import { useCart } from "@/contexts/CartContext";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Sample Flash Sale Products
const flashSaleItems = [
  {
    id: "1",
    name: "Wireless Earbuds",
    price: "4,947 RWF",
    image: require("./image/immm.jpg"),
  },
  {
    id: "2",
    name: "Mini Sewing Machine",
    price: "4,791 RWF",
    image: require("./image/imm.jpg"),
  },
  {
    id: "3",
    name: "Powerful Subwoofer",
    price: "7,207 RWF",
    image: require("./image/im.jpg"),
  },
  {
    id: "4",
    name: "Skin Care Product",
    price: "4,389 RWF",
    image: require("./image/iimmm.jpg"),
  },
  {
    id: "5",
    name: "Skin Care Product",
    price: "4,389 RWF",
    image: require("./image/iimm.jpg"),
  },
  {
    id: "6",
    name: "Skin Care Product",
    price: "4,389 RWF",
    image: require("./image/iim.jpg"),
  },
    {
    id: "7",
    name: "Wireless Earbuds",
    price: "4,947 RWF",
    image: require("./image/download (1).jpg"),
  },
  {
    id: "8",
    name: "Mini Sewing Machine",
    price: "4,791 RWF",
    image: require("./image/download (10).jpg"),
  },
  {
    id: "9",
    name: "Powerful Subwoofer",
    price: "7,207 RWF",
    image: require("./image/umage.jpg"),
  },
  {
    id: "10",
    name: "Skin Care Product",
    price: "4,389 RWF",
    image: require("./image/ummage.jpg"),
  },
  {
    id: "11",
    name: "Skin Care Product",
    price: "4,389 RWF",
    image: require("./image/download (13).jpg"),
  },
  {
    id: "12",
    name: "Skin Care Product",
    price: "4,389 RWF",
    image: require("./image/uumage.jpg"),
  },
];

// Countdown Timer Component
const CountdownTimer = ({ initialSeconds }: { initialSeconds: number }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Convert to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return <Text style={styles.timer}>{formatTime(timeLeft)}</Text>;
};

export default function FlashSale() {
  const { addItem } = useCart();
  const parsePriceToCents = (price: string) => {
    // expects like "4,947 RWF" -> cents assuming no decimals
    const numeric = parseInt(price.replace(/[^0-9]/g, ""), 10);
    return numeric * 100;
  };
  return (
    <View style={styles.container}>
      {/* Flash Sale Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🔥 Flash Sale</Text>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-46%</Text>
        </View>
        <CountdownTimer initialSeconds={15 * 3600 + 20 * 60 + 35} />
      </View>

      {/* Horizontal Scroll of Products */}
      <FlatList
        data={flashSaleItems}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={item.image} style={styles.productImage} />
            <Text style={styles.price}>{item.price}</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() =>
                addItem(
                  {
                    id: item.id,
                    name: item.name,
                    priceCents: parsePriceToCents(item.price),
                    currency: "RWF",
                    image: item.image,
                  },
                  1
                )
              }
            >
              <Text style={styles.addBtnText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: "red",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  discountText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  timer: {
    backgroundColor: "#333",
    color: "#fff",
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  productCard: {
    marginRight: 12,
    alignItems: "center",
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
  },
  addBtn: {
    marginTop: 6,
    backgroundColor: "#4f46e5",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
