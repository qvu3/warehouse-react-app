import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { fetchOrders } from "../config/databaseService";

const SalesHistoryPage = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersList = await fetchOrders();
      const filteredOrders = ordersList.filter(
        (order) => order.status === "approved" || order.status === "rejected"
      );
      setOrders(filteredOrders);
    } catch (error) {
      Alert.alert("Error", "Could not fetch sales history");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Lịch sử bán hàng</Text>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.itemCode]}>
            Mã sản phẩm
          </Text>
          <Text style={[styles.tableHeaderText, styles.quantity]}>
            Số lượng
          </Text>
          <Text style={[styles.tableHeaderText, styles.dateTime]}>
            Ngày & giờ
          </Text>
          <Text style={[styles.tableHeaderText, styles.saler]}>Người bán</Text>
          <Text style={[styles.tableHeaderText, styles.recipient]}>
            Người nhận
          </Text>
          <Text style={[styles.tableHeaderText, styles.status]}>
            Trạng thái
          </Text>
        </View>
        {orders.map((order: any) => (
          <View key={order.id} style={styles.tableRow}>
            <Text style={[styles.tableCellText, styles.itemCode]}>
              {order.itemCode}
            </Text>
            <Text style={[styles.tableCellText, styles.quantity]}>
              {order.quantity}
            </Text>
            <Text style={[styles.tableCellText, styles.dateTime]}>
              {new Date(order.timestamp).toLocaleString()}
            </Text>
            <Text style={[styles.tableCellText, styles.saler]}>
              {order.senderEmail}
            </Text>
            <Text style={[styles.tableCellText, styles.recipient]}>
              {order.recipient}
            </Text>
            <Text style={[styles.tableCellText, styles.status]}>
              {order.status}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCellText: {
    fontSize: 14,
  },
  // Fixed widths for each column
  itemCode: {
    width: "10%",
    paddingHorizontal: 5,
  },
  quantity: {
    width: "10%",
    paddingHorizontal: 5,
  },
  dateTime: {
    width: "25%",
    paddingHorizontal: 5,
  },
  saler: {
    width: "25%",
    paddingHorizontal: 5,
  },
  recipient: {
    width: "25%",
    paddingHorizontal: 5,
  },
  status: {
    width: "10%",
    paddingHorizontal: 5,
  },
});

export default SalesHistoryPage;
