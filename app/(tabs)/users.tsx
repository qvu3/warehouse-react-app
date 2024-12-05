import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ref, get, update, onValue } from "firebase/database";
import { database } from "../config/firebaseConfig";
import { useAuth } from "../config/AuthContext";
import { Picker } from "@react-native-picker/picker";

type User = {
  id: string;
  email: string;
  role: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { userEmail, role } = useAuth();

  useEffect(() => {
    if (role !== "admin") {
      setLoading(false);
      return;
    }

    const usersRef = ref(database, "users");

    // Set up real-time listener
    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            const usersData = Object.entries(snapshot.val()).map(
              ([key, value]: [string, any]) => ({
                id: key,
                ...value,
              })
            );
            setUsers(usersData);
          } else {
            setUsers([]);
          }
        } catch (error) {
          console.error("Error processing users data:", error);
          Alert.alert("Error", "Failed to process users data");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching users:", error);
        Alert.alert("Error", "Failed to fetch users");
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, [role]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setLoading(true);
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, { role: newRole });
      Alert.alert("Success", "User role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
      Alert.alert("Error", "Failed to update user role");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  if (role !== "admin") {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Access Denied: Admin privileges required
        </Text>
        <Text style={styles.subText}>Current role: {role || "none"}</Text>
        <Text style={styles.subText}>Email: {userEmail}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Quản lý người dùng</Text>
        <Text style={styles.subHeader}>Logged in as: {userEmail}</Text>
      </View>

      {users.map((user) => (
        <View key={user.id} style={styles.userContainer}>
          <Text style={styles.emailText}>{user.email}</Text>
          <Text style={styles.roleText}>Current Role: {user.role}</Text>
          <Picker
            selectedValue={user.role}
            style={styles.picker}
            onValueChange={(value) => handleRoleChange(user.id, value)}
          >
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Admin" value="admin" />
            <Picker.Item label="Sales" value="sales" />
            <Picker.Item label="Shipper" value="shipper" />
          </Picker>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  userContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "500",
  },
  roleText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  picker: {
    marginTop: 5,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});

export default UsersPage;
