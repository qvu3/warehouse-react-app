// databaseService.ts
import {
  ref,
  set,
  push,
  update,
  get,
  onValue,
  remove,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { database } from "./firebaseConfig";

type Item = {
  itemCode: string;
  quantity: number;
  timestamp: number;
};

type Order = {
  itemCode: string;
  quantity: number;
  recipient: string;
  address: string;
  phone: string;
  senderEmail: string;
  status: "pending" | "approved" | "rejected";
  timestamp: number;
};

// add item to warehouse
export async function addItem(itemCode: string, quantity: number) {
  const warehouseRef = ref(database, "warehouse");

  // Query to find if the itemCode already exists
  const existingItemQuery = query(
    warehouseRef,
    orderByChild("itemCode"),
    equalTo(itemCode)
  );
  const snapshot = await get(existingItemQuery);

  if (snapshot.exists()) {
    // If item with itemCode exists, update the quantity
    const itemKey = Object.keys(snapshot.val())[0]; // Get the key of the existing item
    const existingItem = snapshot.val()[itemKey];
    const updatedQuantity = existingItem.quantity + quantity;

    const itemRef = ref(database, `warehouse/${itemKey}`);
    await update(itemRef, { quantity: updatedQuantity });
  } else {
    // If item does not exist, create a new item
    const newItemRef = push(warehouseRef);
    await set(newItemRef, {
      itemCode,
      quantity,
      timestamp: Date.now(),
    });
  }
}
// delete item from warehouse
export async function deleteItem(itemCode: string, quantity: number) {
  const warehouseRef = ref(database, "warehouse");
  const existingItemQuery = query(
    warehouseRef,
    orderByChild("itemCode"),
    equalTo(itemCode)
  );

  const snapshot = await get(existingItemQuery);
  if (snapshot.exists()) {
    const itemKey = Object.keys(snapshot.val())[0];
    const existingItem = snapshot.val()[itemKey];

    if (existingItem.quantity < quantity) {
      throw new Error("Not enough items to delete");
    }

    const updatedQuantity = existingItem.quantity - quantity;
    const itemRef = ref(database, `warehouse/${itemKey}`);

    if (updatedQuantity === 0) {
      // If quantity becomes 0, remove the item completely
      await remove(itemRef);
    } else {
      // Otherwise update with new quantity
      await update(itemRef, { quantity: updatedQuantity });
    }
  } else {
    throw new Error("Item not found");
  }
}

// Get all items in the warehouse
export async function fetchWarehouseItems(): Promise<Item[]> {
  const warehouseRef = ref(database, "warehouse");
  try {
    const snapshot = await get(warehouseRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log("Raw data from Firebase:", data); // Log raw data to verify structure

      // Convert object data to array of Item objects
      const itemList = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...(value as Item), // Explicitly type value as Item
      }));
      return itemList;
    } else {
      console.log("No data found in 'warehouse' node.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching warehouse items:", error);
    return [];
  }
}

export async function createOrder(
  orderData: Omit<Order, "status" | "timestamp">
) {
  // First check if item exists and has enough quantity
  const warehouseRef = ref(database, "warehouse");
  const itemQuery = query(
    warehouseRef,
    orderByChild("itemCode"),
    equalTo(orderData.itemCode)
  );

  const snapshot = await get(itemQuery);
  if (!snapshot.exists()) {
    throw new Error("Item not found in warehouse");
  }

  const itemKey = Object.keys(snapshot.val())[0];
  const item = snapshot.val()[itemKey];

  if (item.quantity < orderData.quantity) {
    throw new Error("Not enough items in warehouse");
  }

  // Create the order
  const ordersRef = ref(database, "orders");
  const newOrderRef = push(ordersRef);

  await set(newOrderRef, {
    ...orderData,
    status: "pending",
    timestamp: Date.now(),
  });
}

export async function fetchOrders(): Promise<Order[]> {
  const ordersRef = ref(database, "orders");
  try {
    const snapshot = await get(ordersRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const ordersList = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...(value as Order),
      }));
      return ordersList;
    }
    return [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: "approved" | "rejected"
) {
  try {
    const orderRef = ref(database, `orders/${orderId}`);
    await update(orderRef, { status });

    if (status === "approved") {
      // Get the order details
      const orderSnapshot = await get(orderRef);
      if (!orderSnapshot.exists()) {
        throw new Error("Order not found");
      }

      const order = orderSnapshot.val();

      // Find the item in warehouse
      const warehouseRef = ref(database, "warehouse");
      const itemQuery = query(
        warehouseRef,
        orderByChild("itemCode"),
        equalTo(order.itemCode)
      );

      const warehouseSnapshot = await get(itemQuery);
      if (!warehouseSnapshot.exists()) {
        throw new Error("Item not found in warehouse");
      }

      // Get the warehouse item details
      const itemKey = Object.keys(warehouseSnapshot.val())[0];
      const warehouseItem = warehouseSnapshot.val()[itemKey];

      if (warehouseItem.quantity < order.quantity) {
        throw new Error("Not enough items in warehouse");
      }

      // Update warehouse quantity
      const updatedQuantity = warehouseItem.quantity - order.quantity;
      const itemRef = ref(database, `warehouse/${itemKey}`);

      if (updatedQuantity === 0) {
        // Remove item if quantity becomes 0
        await remove(itemRef);
      } else {
        // Update with new quantity
        await update(itemRef, { quantity: updatedQuantity });
      }
    }
  } catch (error: any) {
    console.error("Error updating order status:", error);
    throw new Error(error.message || "Failed to update order status");
  }
}
