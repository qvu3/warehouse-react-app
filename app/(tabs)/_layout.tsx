import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "../config/AuthContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            title: "Đăng nhập",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "code-slash" : "code-slash-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="warehouse"
          options={{
            title: "Kho hàng",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "cube" : "cube-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="order"
          options={{
            title: "Gửi hàng",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "cube" : "cube-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Thống kê",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "cube" : "cube-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            title: "Đăng ký",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "cube" : "cube-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
