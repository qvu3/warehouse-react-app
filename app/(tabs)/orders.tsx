import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "../config/AuthContext";
import { useRouter } from "expo-router";
import { fetchOrders, updateOrderStatus } from "../config/databaseService";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { logout, userEmail } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersList = await fetchOrders();
      // Filter out approved orders
      const pendingOrders = ordersList.filter(
        (order) => order.status !== "approved" && order.status !== "rejected"
      );
      setOrders(pendingOrders);
    } catch (error) {
      Alert.alert("Error", "Could not fetch orders");
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders(); // Reload orders after update
      Alert.alert("Success", `Order ${newStatus} successfully`);
    } catch (error) {
      Alert.alert("Error", "Failed to update order status");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>Xin chào {userEmail}!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={styles.noOrdersContainer}>
          <Text style={styles.noOrdersText}>Hiện không có đơn hàng nào.</Text>
        </View>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderTitle}>Order #{order.id.slice(-6)}</Text>
              <Text style={styles.orderStatus}>{order.status}</Text>
            </View>

            <View style={styles.orderDetails}>
              <Text>Mã máy: {order.itemCode}</Text>
              <Text>Số lượng: {order.quantity}</Text>
              <Text>Người nhận: {order.recipient}</Text>
              <Text>Địa chỉ: {order.address}</Text>
              <Text>SĐT: {order.phone}</Text>
              <Text>Người gửi: {order.senderEmail}</Text>
            </View>

            {order.status === "pending" && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleStatusUpdate(order.id, "approved")}
                >
                  <Text style={styles.actionButtonText}>Duyệt</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleStatusUpdate(order.id, "rejected")}
                >
                  <Text style={styles.actionButtonText}>Từ chối</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: "#ddd",
    padding: 8,
    borderRadius: 5,
  },
  logoutButtonText: {
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderStatus: {
    fontSize: 14,
    color: "#666",
  },
  orderDetails: {
    gap: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#f44336",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  noOrdersText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default OrdersPage;
