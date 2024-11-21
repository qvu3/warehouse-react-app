import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const OrderPage = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* TODO: Replace with user's name */}
        <Text style={styles.greeting}>Xin chào bạn!</Text>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <TextInput style={styles.input} placeholder="Mã máy" />
      <TextInput style={styles.input} placeholder="Số lượng" />
      <TextInput style={styles.input} placeholder="Người nhận" />
      <TextInput style={styles.input} placeholder="Địa chỉ" />
      <TextInput style={styles.input} placeholder="Số điện thoại" />
      <TouchableOpacity style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Gửi</Text>
      </TouchableOpacity>

      {/* Confirmation Message */}
      <Text style={styles.confirmationText}>
        Đơn hàng đã được gửi đến thủ kho thành công!
      </Text>
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

export default OrderPage;
