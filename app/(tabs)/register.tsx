import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../config/AuthContext";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    const success = await register(email, password);
    if (success) {
      router.push("/dashboard"); // Redirect to the index page after successful registration
    } else {
      Alert.alert(
        "Đăng ký thất bại",
        "Đã xảy ra lỗi khi đăng ký tài khoản. Vui lòng thử lại!"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tạo tài khoản</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
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
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  registerButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  createAccountButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default RegisterPage;
