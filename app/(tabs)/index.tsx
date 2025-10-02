import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import KikuuPicks from "@/component/KikuuPicks";
import Kikuu from "@/component/Kikuu";
import Flash from "@/component/flash";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Kikuu />
      <Flash />
      <KikuuPicks />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
