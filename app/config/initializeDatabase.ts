import { ref, set, get } from "firebase/database";
import { database } from "./firebaseConfig";

export const initializeDatabase = async () => {
  try {
    // Check if admin exists
    const adminRef = ref(database, 'users/GUFSrAaRaWWSnf3v34ekkbfdZoy1');
    const snapshot = await get(adminRef);

    // If admin doesn't exist, create it
    if (!snapshot.exists()) {
      await set(adminRef, {
        email: "astorre.vu@gmail.com",
        role: "admin"
      });
      console.log("Admin user initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}; 