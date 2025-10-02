import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const countries = [
  { name: "Rwanda", code: "+250", flag: "🇷🇼" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Burundi", code: "+250", flag: "🇷🇼" },
  { name: "DRC", code: "+254", flag: "🇰🇪" },
  { name: "Egypt", code: "+256", flag: "🇺🇬" },
  { name: "Algeria", code: "+255", flag: "🇹🇿" },
  { name: "Senegal", code: "+234", flag: "🇳🇬" },
  { name: "Ghana", code: "+27", flag: "🇿🇦" },
  { name: "England", code: "+1", flag: "🇺🇸" },
  { name: "Spain", code: "+91", flag: "🇮🇳" },
    { name: "Rwanda", code: "+250", flag: "🇷🇼" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Burundi", code: "+250", flag: "🇷🇼" },
  { name: "DRC", code: "+254", flag: "🇰🇪" },
  { name: "Egypt", code: "+256", flag: "🇺🇬" },
  { name: "Algeria", code: "+255", flag: "🇹🇿" },
  { name: "Senegal", code: "+234", flag: "🇳🇬" },
  { name: "Ghana", code: "+27", flag: "🇿🇦" },
  { name: "England", code: "+1", flag: "🇺🇸" },
  { name: "Spain", code: "+91", flag: "🇮🇳" },
];

export default function Profile() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = () => {
    if (isRegister) {
      alert(`Creating account with: ${selectedCountry.code} ${phone}`);
    } else {
      alert(`Logging in with: ${selectedCountry.code} ${phone}`);
    }

    // After successful register or login, show only the standalone dashboard
    router.replace("/dashboards");


  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Banner */}
        {isRegister && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>🎁 To receive new user gifts</Text>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setIsRegister(true)}>
            <Text style={[styles.tabText, isRegister && styles.activeTab]}>
              Register
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsRegister(false)}>
            <Text style={[styles.tabText, !isRegister && styles.activeTab]}>
              Login In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Country Row */}
        <View style={styles.countryRow}>
          <Text style={styles.country}>
            {selectedCountry.flag} {selectedCountry.name}
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.change}>CHANGE</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.code}>{selectedCountry.code}</Text>

        {/* Phone Input */}
        <Text style={styles.label}>Phone Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        {/* Password Input */}
        <Text style={styles.label}>
          {isRegister ? "Set Password:" : "Password:"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Forgot Password */}
        {!isRegister && (
          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot password &gt;</Text>
          </TouchableOpacity>
        )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>
            {isRegister ? "CREATE ACCOUNT" : "LOGIN IN"}
          </Text>
        </TouchableOpacity>

        {/* Terms or Register Prompt */}
        {isRegister ? (
          <Text style={styles.terms}>
            By registration, you agree to the{" "}
            <Text style={styles.link}>Terms of Service</Text>.
          </Text>
        ) : (
          <Text style={styles.registerPrompt}>
            New to KiKUU? <Text style={styles.link}>Click to Register</Text>
          </Text>
        )}
      </View>

      {/* Country Picker Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Country</Text>
          <FlatList
            data={countries}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => selectCountry(item)}
              >
                <Text style={styles.countryText}>
                  {item.flag} {item.name} ({item.code})
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  banner: {
    backgroundColor: "#ffe5e5",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  bannerText: {
    color: "#d0021b",
    fontWeight: "600",
    textAlign: "center",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tabText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#777",
  },
  activeTab: {
    color: "#d0021b",
    borderBottomWidth: 2,
    borderColor: "#d0021b",
    paddingBottom: 4,
  },
  countryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  country: {
    fontSize: 16,
    fontWeight: "600",
  },
  change: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  code: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginTop: 4,
    marginBottom: 10,
  },
  forgot: {
    fontSize: 13,
    color: "#007AFF",
    textAlign: "right",
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#d0021b",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginVertical: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  terms: {
    fontSize: 12,
    textAlign: "center",
    color: "#555",
    marginTop: 6,
  },
  registerPrompt: {
    fontSize: 13,
    textAlign: "center",
    color: "#555",
    marginTop: 6,
  },
  link: {
    color: "#007AFF",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  countryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  countryText: {
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 20,
    alignItems: "center",
  },
  closeText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
