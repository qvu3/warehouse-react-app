import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../config/AuthContext";
import { useRouter } from "expo-router";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      router.replace("/warehouse");
    } else {
      alert("Đăng nhập thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Xin hãy đăng nhập để sử dụng!</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Hãy nhập email của bạn"
          onChangeText={setEmail}
          onSubmitEditing={() => {
            passwordInputRef.current?.focus();
          }}
          returnKeyType="next"
          blurOnSubmit={false}
        />

        <Text style={styles.label}>Mật khẩu:</Text>
        <TextInput
          ref={passwordInputRef}
          style={styles.input}
          value={password}
          placeholder="Hãy nhập mật khẩu của bạn"
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleLogin}
          returnKeyType="done"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.buttonText}>Tạo tài khoản</Text>
        </TouchableOpacity>
      </View>
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
  loginButton: {
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

export default LoginPage;
