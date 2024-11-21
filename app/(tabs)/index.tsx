import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../config/AuthContext";

const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {isAuthenticated
            ? "Chào mừng bạn đã đến với cửa hàng!"
            : "Chào mừng bạn đến với cửa hàng! Xin vui lòng đăng nhập để sử dụng."}
        </Text>
        <TouchableOpacity
          style={isAuthenticated ? styles.logoutButton : styles.loginButton}
          onPress={isAuthenticated ? handleLogout : () => router.push("/login")}
        >
          <Text style={styles.buttonText}>
            {isAuthenticated ? "Đăng xuất" : "Đăng nhập"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contact Section */}
      <View style={styles.contactContainer}>
        <Text style={styles.contactText}>Địa chỉ liên hệ:</Text>
        <Text style={styles.contactText}>Số điện thoại:</Text>
        <Text style={styles.contactText}>Email:</Text>
        <Text style={styles.contactText}>Website:</Text>
      </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  loginButtonText: {
    fontSize: 16,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  navButtonText: {
    fontSize: 16,
  },
  carouselContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  carousel: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  carouselImage: {
    width: 150,
    height: 100,
    marginHorizontal: 10,
    backgroundColor: "#eee",
  },
  carouselButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
  },
  carouselButtonText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
  },
  reasonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  reasonBox: {
    alignItems: "center",
    width: 80,
  },
  reasonImage: {
    width: 80,
    height: 80,
    backgroundColor: "#eee",
    marginBottom: 5,
  },
  reasonText: {
    textAlign: "center",
    fontSize: 14,
  },
  offerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d9534f",
    textAlign: "center",
    marginVertical: 20,
  },
  contactContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 5,
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default HomePage;
