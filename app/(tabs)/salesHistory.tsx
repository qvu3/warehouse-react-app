import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { fetchOrders } from "../config/databaseService";
import { useAuth } from "../config/AuthContext";
import { useRouter } from "expo-router";

const SalesHistoryPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { logout, userEmail } = useAuth();
  const router = useRouter();

  // Date picker states
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<"start" | "end">(
    "start"
  );

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersList = await fetchOrders();
      const completedOrders = ordersList.filter(
        (order) => order.status === "approved" || order.status === "rejected"
      );
      setOrders(completedOrders);
      setFilteredOrders(completedOrders);
    } catch (error) {
      Alert.alert("Error", "Could not fetch sales history");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleFilter = () => {
    let filtered = [...orders];

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime() + (24 * 60 * 60 * 1000 - 1); // End of the selected day

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.timestamp).getTime();
        return orderDate >= start && orderDate <= end;
      });
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    setFilteredOrders(filtered);
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedStatus("all");
    setFilteredOrders(orders);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowStartPicker(false);
      setShowEndPicker(false);
    }

    if (selectedDate) {
      if (datePickerMode === "start") {
        setStartDate(selectedDate.toISOString().split("T")[0]);
      } else {
        setEndDate(selectedDate.toISOString().split("T")[0]);
      }
    }
  };

  const showDatePicker = (mode: "start" | "end") => {
    if (Platform.OS === "android") {
      setDatePickerMode(mode);
      if (mode === "start") {
        setShowStartPicker(true);
      } else {
        setShowEndPicker(true);
      }
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Chọn ngày";
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.header}>Lịch sử bán hàng</Text> */}
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>Xin chào {userEmail}!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.dateInputContainer}>
          <View style={styles.dateInputWrapper}>
            <Text style={styles.dateLabel}>Từ ngày:</Text>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
              max={endDate || undefined}
            />
          </View>

          <View style={styles.dateInputWrapper}>
            <Text style={styles.dateLabel}>Đến ngày:</Text>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
              min={startDate || undefined}
            />
          </View>
        </View>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="status-select"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Đã từ chối</option>
        </select>

        <View style={styles.filterButtons}>
          <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
            <Text style={styles.buttonText}>Lọc</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.buttonText}>Đặt lại</Text>
          </TouchableOpacity>
        </View>
      </View>

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

        {filteredOrders.map((order) => (
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
  filterContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  dateInputContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },
  dateInputWrapper: {
    flex: 1,
  },
  dateLabel: {
    marginBottom: 5,
    fontSize: 14,
    color: "#666",
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 15,
  },
  filterButton: {
    flex: 1,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#ddd",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  greeting: {
    fontSize: 18,
  },
});

// Add these styles to your global CSS or style tag
const globalStyles = `
  .date-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  .status-select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    background-color: white;
    margin-bottom: 10px;
  }
`;

export default SalesHistoryPage;
