import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";

export default function My_Kikuu() {
  const navigation = useNavigation();

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentIdentifier, setPaymentIdentifier] = useState("");

  const handlePaymentSelect = (method) => {
    if (selectedMethod && selectedMethod.id === method.id) {
      setSelectedMethod(null);
    } else {
      setSelectedMethod(method);
      setAmount("");
      setPaymentIdentifier("");
    }
  };

  const handlePaymentSubmit = () => {
    if (!amount || !paymentIdentifier) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    Alert.alert(
      "Payment Submitted",
      `Method: ${selectedMethod.name}\nAmount: $${amount}\nIdentifier: ${paymentIdentifier}`
    );

    setSelectedMethod(null);
    setAmount("");
    setPaymentIdentifier("");
    Keyboard.dismiss();
  };

  const renderPaymentInputs = () => {
    if (!selectedMethod) return null;

    let keyboardType = "default";
    let placeholder = "Enter details";

    if (["mobile", "mpesa"].includes(selectedMethod.id)) {
      keyboardType = "phone-pad";
      placeholder = "Enter Mobile Number";
    } else if (["visa", "card"].includes(selectedMethod.id)) {
      keyboardType = "numeric";
      placeholder = "Enter Card Number";
    }

    return (
      <View style={styles.paymentInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#888" // Added for placeholder color
        />
        {["mobile", "mpesa", "visa", "card"].includes(selectedMethod.id) && (
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            keyboardType={keyboardType}
            value={paymentIdentifier}
            onChangeText={setPaymentIdentifier}
            placeholderTextColor="#888" // Added for placeholder color
          />
        )}
        <TouchableOpacity style={styles.payButton} onPress={handlePaymentSubmit}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.language}>🌐 English</Text>
            <TouchableOpacity onPress={() => navigation.navigate("profile")}>
              <Text style={styles.loginBtn}>LOGIN / REGISTER</Text>
            </TouchableOpacity>
          </View>

          {/* My Orders */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Orders</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.iconRow}>
              <View style={styles.iconItemGrid}>
                <MaterialIcons name="payment" size={24} color="#007AFF" /> {/* Changed icon color */}
                <Text style={styles.iconLabelGrid}>Pending Payment</Text>
              </View>
              <View style={styles.iconItemGrid}>
                <FontAwesome5 name="shipping-fast" size={24} color="#007AFF" /> {/* Changed icon color */}
                <Text style={styles.iconLabelGrid}>In Transit</Text>
              </View>
              <View style={styles.iconItemGrid}>
                <Ionicons name="chatbubble-ellipses" size={24} color="#007AFF" /> {/* Changed icon color */}
                <Text style={styles.iconLabelGrid}>Pending Feedback</Text>
              </View>
              <View style={styles.iconItemGrid}>
                <MaterialIcons name="assignment-return" size={24} color="#007AFF" /> {/* Changed icon color */}
                <Text style={styles.iconLabelGrid}>Return & Refund</Text>
              </View>
            </View>
          </View>

          {/* --- IMPROVED Payment Methods Section --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <View style={styles.paymentContainer}>
              {[
                { id: "mobile", name: "Mobile Money", icon: <Ionicons name="wallet" size={22} color="#4CAF50" />}, // Green wallet
                { id: "visa", name: "Visa / Mastercard", icon: <FontAwesome name="cc-visa" size={22} color="#1565C0" />}, // Darker blue
                { id: "bank", name: "Bank Transfer", icon: <FontAwesome name="bank" size={22} color="#6A1B9A" />}, // Purple bank
                { id: "card", name: "Credit / Debit Card", icon: <MaterialIcons name="credit-card" size={22} color="#FF5722" />}, // Orange card
                { id: "btc", name: "Bitcoin (BTC)", icon: <FontAwesome5 name="bitcoin" size={22} color="#FFC107" />}, // Amber bitcoin
                { id: "usdt", name: "USDT (Tether)", icon: <FontAwesome5 name="coins" size={22} color="#009688" />}, // Teal coins
                { id: "paypal", name: "PayPal", icon: <FontAwesome5 name="paypal" size={22} color="#00457C" />}, // Dark blue paypal
                { id: "mpesa", name: "M-Pesa (Kenya & East Africa)", icon: <MaterialIcons name="payments" size={22} color="#388E3C" />}, // Dark green mpesa
              ].map((method) => (
                <View key={method.id}>
                  <TouchableOpacity
                    style={[
                      styles.paymentItem,
                      selectedMethod?.id === method.id && styles.selectedItem,
                    ]}
                    onPress={() => handlePaymentSelect(method)}
                  >
                    {method.icon}
                    <Text
                      style={[
                        styles.paymentText,
                        selectedMethod?.id === method.id && styles.selectedText,
                      ]}
                    >
                      {method.name}
                    </Text>
                  </TouchableOpacity>

                  {selectedMethod?.id === method.id && renderPaymentInputs()}
                </View>
              ))}
            </View>
          </View>

          {/* Quick Access Section remains the same, but let's update its icon colors too */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.iconColumn}>
              <TouchableOpacity style={styles.iconItemColumn}>
                <Ionicons name="heart" size={24} color="#E91E63" /> {/* Pink */}
                <Text style={styles.iconLabelColumn}>Wish List</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconItemColumn}>
                <Ionicons name="storefront" size={24} color="#00BCD4" /> {/* Cyan */}
                <Text style={styles.iconLabelColumn}>Store Followed</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconItemColumn}>
                <Ionicons name="time" size={24} color="#FF9800" /> {/* Amber */}
                <Text style={styles.iconLabelColumn}>Recently Viewed</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconItemColumn}>
                <Ionicons name="notifications" size={24} color="#9C27B0" /> {/* Purple */}
                <Text style={styles.iconLabelColumn}>Address Management</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconItemColumn}>
                <Ionicons name="menu" size={24} color="#795548" /> {/* Brown */}
                <Text style={styles.iconLabelColumn}>Service Center</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconItemColumn}>
                <Ionicons name="logo-instagram" size={24} color="#C2185B" /> {/* Dark Pink */}
                <Text style={styles.iconLabelColumn}>Invite Friend</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconItemColumn}>
                <Ionicons name="pause" size={24} color="#607D8B" /> {/* Blue Grey */}
                <Text style={styles.iconLabelColumn}>Friend's Code</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconItemColumn}>
                <Ionicons name="camera" size={24} color="#FFEB3B" /> {/* Yellow */}
                <Text style={styles.iconLabelColumn}>New Arrival</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconItemColumn}>
                <Ionicons name="cash" size={24} color="#4CAF50" /> {/* Green */}
                <Text style={styles.iconLabelColumn}>WholeSale</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconItemColumn}>
                <MaterialIcons name="card-membership" size={24} color="#2196F3" /> {/* Blue */}
                <Text style={styles.iconLabelColumn}>Tops</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconItemColumn}>
                <Ionicons name="wallet" size={24} color="#8BC34A" /> {/* Light Green */}
                <Text style={styles.iconLabelColumn}>Bargain Zone</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconItemColumn}>
                <Ionicons name="pricetag" size={24} color="#FFC107" /> {/* Amber */}
                <Text style={styles.iconLabelColumn}>Dress</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconItemColumn}>
                <Ionicons name="compass" size={24} color="#009688" /> {/* Teal */}
                <Text style={styles.iconLabelColumn}>Sneakers</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 16 },

  // Header (keeping original orange for brand identity, but you can change header.backgroundColor)
  header: {
    backgroundColor: "#ff7f50", // Original orange
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  language: { fontSize: 16, color: "#fff", fontWeight: "600" },
  loginBtn: { fontSize: 16, color: "#fff", fontWeight: "600" },

  // Sections
  section: { marginTop: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" }, // Changed title color
  viewAll: { fontSize: 14, color: "#007AFF", fontWeight: "600" },

  // My Orders
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  iconItemGrid: { alignItems: "center", width: "22%", marginVertical: 10 },
  iconLabelGrid: { fontSize: 12, textAlign: "center", marginTop: 4, color: "#555" }, // Changed label color

  // Quick Access
  iconColumn: { flexDirection: "column", alignItems: "flex-start" },
  iconItemColumn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
    width: "100%",
  },
  iconLabelColumn: { fontSize: 14, marginLeft: 12, color: "#333" },

  // Payment Methods
  paymentContainer: { marginTop: 10 },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  // When a payment item is selected
  selectedItem: {
    backgroundColor: "#E3F2FD", // Lighter blue background for selected item
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3", // Blue border for selection
  },
  paymentText: { marginLeft: 12, fontSize: 14, color: "#333" },
  selectedText: { color: "#2196F3", fontWeight: "700" }, // Blue text for selected item

  // --- NEW/MODIFIED STYLES for the input fields ---
  paymentInputContainer: {
    padding: 16,
    backgroundColor: "#F0F4F8", // Light grey-blue background for input area
    borderBottomWidth: 1,
    borderColor: "#D3DCE6", // Slightly darker border
    paddingTop: 8, // Adjust spacing
  },
  input: {
    backgroundColor: "#FFFFFF", // White background for inputs
    borderWidth: 1,
    borderColor: "#B0BEC5", // Muted grey border
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: "#333", // Input text color
  },
  payButton: {
    backgroundColor: "#4CAF50", // A nice green for the pay button
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8, // Add some space above the button
  },
  payButtonText: {
    color: "#FFFFFF", // White text for the button
    fontSize: 16,
    fontWeight: "bold",
  },
});