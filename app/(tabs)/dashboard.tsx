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

const DashboardPage = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* Replace "Xin chào bạn!" with the user's name */}
        <Text style={styles.greeting}>Xin chào bạn!</Text>
        <Text style={styles.header}>Thống kê doanh số bán hàng.</Text>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <TextInput style={styles.input} placeholder="Từ ngày" />
      <TextInput style={styles.input} placeholder="Đến ngày" />
      <TextInput style={styles.input} placeholder="Mã máy" />
      <TextInput style={styles.input} placeholder="Người bán" />
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Xem</Text>
      </TouchableOpacity>

      {/* Data Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Tên máy</Text>
          <Text style={styles.tableHeaderText}>Số lượng</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellText}>Máy phát điện A</Text>
          <Text style={styles.tableCellText}>40</Text>
        </View>
        {/* Add more rows as needed */}
      </View>
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
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  searchButtonText: { color: "#fff", fontSize: 16 },
  tableContainer: { borderWidth: 1, borderColor: "#ddd" },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f1f1f1",
    padding: 10,
  },
  tableHeaderText: { fontWeight: "bold" },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  tableCellText: { fontSize: 16 },
});

export default DashboardPage;
