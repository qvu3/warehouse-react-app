import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "../config/AuthContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, role } = useAuth();

  return (
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
          href: role !== "shipper" ? "/" : null,
          tabBarStyle: { display: role !== "shipper" ? "flex" : "none" },
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
          href: isAuthenticated ? null : "/login",
          tabBarStyle: { display: isAuthenticated ? "none" : "flex" },
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
          href: isAuthenticated ? null : "/register",
          tabBarStyle: { display: isAuthenticated ? "none" : "flex" },
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
          href: role === "admin" ? "/warehouse" : null,
          tabBarStyle: { display: role === "admin" ? "flex" : "none" },
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: "Bán hàng",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "cart" : "cart-outline"}
              color={color}
            />
          ),
          href: role === "admin" ? "/sales" : null,
          tabBarStyle: { display: role === "admin" ? "flex" : "none" },
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Đơn hàng",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "clipboard" : "clipboard-outline"}
              color={color}
            />
          ),
          href: role === "shipper" ? "/orders" : null,
          tabBarStyle: { display: role === "shipper" ? "flex" : "none" },
        }}
      />
      <Tabs.Screen
        name="salesHistory"
        options={{
          title: "Lịch sử bán hàng",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "list" : "list-outline"}
              color={color}
            />
          ),
          href: role === "admin" ? "/salesHistory" : null,
          tabBarStyle: { display: role === "admin" ? "flex" : "none" },
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Quản lý Users",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "people" : "people-outline"}
              color={color}
            />
          ),
          href: role === "admin" ? "/users" : null,
          tabBarStyle: { display: role === "admin" ? "flex" : "none" },
        }}
      />
    </Tabs>
  );
}
