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
