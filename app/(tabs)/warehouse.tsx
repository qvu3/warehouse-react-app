import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { addItem, fetchWarehouseItems } from "../config/databaseService";

const WarehousePage = () => {
  const [itemCode, setItemCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [action, setAction] = useState("");
  const [items, setItems] = useState<any[]>([]);

  const handleAction = async () => {
    if (action === "add") {
      if (itemCode && quantity) {
        try {
          addItem(itemCode, parseInt(quantity));
          alert("Thêm máy thành công!");
        } catch (error) {
          alert("Có lỗi xảy ra khi thêm máy!");
        }
      } else {
        alert("Vui lòng nhập mã máy và số lượng!");
      }
    } else if (action === "view") {
      // Fetch and display all items in warehouse
      try {
        const itemList = await fetchWarehouseItems();
        if (itemList.length > 0) {
          setItems(itemList);
          console.log("Items to render:", itemList); // Confirm items are set in state
        } else {
          Alert.alert("No Items", "No items found in the warehouse");
          setItems([]);
        }
      } catch (error) {
        Alert.alert("Error", "Could not fetch items from the warehouse");
        console.error("Error fetching items:", error);
      }
    } else {
      Alert.alert(
        "Action Not Implemented",
        "This action is not implemented yet"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>Xin chào bạn!</Text>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Input fields */}
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
      {/* <TextInput style={styles.input} placeholder="Từ ngày" />
      <TextInput style={styles.input} placeholder="Đến ngày" /> */}

      {/* Action Dropdown */}
      <Picker
        style={styles.dropdown}
        selectedValue={action}
        onValueChange={(itemValue) => setAction(itemValue)}
      >
        <Picker.Item label="Hành động" value="" />
        <Picker.Item label="Thêm máy" value="add" />
        <Picker.Item label="Xóa máy" value="delete" />
        <Picker.Item label="Kiểm tra số lượng" value="view" />
        <Picker.Item label="Hàng nhập" value="inbound" />
        <Picker.Item label="Hàng xuất" value="outbound" />
      </Picker>

      <TouchableOpacity style={styles.goButton} onPress={handleAction}>
        <Text style={styles.goButtonText}>Đi</Text>
      </TouchableOpacity>

      {/* Display Items in Warehouse */}
      {items.length > 0 ? (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Mã máy</Text>
            <Text style={styles.tableHeaderText}>Số lượng</Text>
          </View>
          {items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCellText}>{item.itemCode}</Text>
              <Text style={styles.tableCellText}>{item.quantity}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.tableCellText}>
          No items available in the warehouse.
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
  logoutButton: { backgroundColor: "#ddd", padding: 5, borderRadius: 5 },
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
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  goButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  goButtonText: { color: "#fff", fontSize: 16 },
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

export default WarehousePage;
