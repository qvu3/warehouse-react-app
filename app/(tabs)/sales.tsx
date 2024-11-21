import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuth } from "../config/AuthContext";
import { useRouter } from "expo-router";
import { createOrder, fetchWarehouseItems } from "../config/databaseService";

const SalesPage = () => {
  const [itemCode, setItemCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [recipient, setRecipient] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { logout, userEmail } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleSubmit = async () => {
    if (!itemCode || !quantity || !recipient || !address || !phone) {
      Alert.alert("Error", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      await createOrder({
        itemCode,
        quantity: parseInt(quantity),
        recipient,
        address,
        phone,
        senderEmail: userEmail || "",
      });

      // Clear form and show confirmation
      setItemCode("");
      setQuantity("");
      setRecipient("");
      setAddress("");
      setPhone("");
      setShowConfirmation(true);

      // Hide confirmation after 3 seconds
      setTimeout(() => setShowConfirmation(false), 3000);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>Xin chào {userEmail}!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Mã máy"
        value={itemCode}
        onChangeText={setItemCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Số lượng"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Người nhận"
        value={recipient}
        onChangeText={setRecipient}
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
        <Text style={styles.sendButtonText}>Gửi</Text>
      </TouchableOpacity>

      {showConfirmation && (
        <Text style={styles.confirmationText}>
          Đơn hàng đã được gửi đến thủ kho thành công!
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  greeting: { fontSize: 18 },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  logoutButtonText: { fontSize: 16 },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  navButton: { padding: 10, backgroundColor: "#ddd", borderRadius: 5 },
  activeButton: { backgroundColor: "#bbb" },
  navButtonText: { fontSize: 16 },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  sendButtonText: { color: "#fff", fontSize: 16 },
  confirmationText: {
    color: "green",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default SalesPage;
