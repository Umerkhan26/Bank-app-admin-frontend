import axios from "axios";
import { API_URL } from "../services/brandService";

// src/utils/fcmUtils.ts
export const persistFcmToken = async (userId: string, authToken: string) => {
  const storedToken = localStorage.getItem("fcmToken");
  if (!storedToken) return;

  try {
    await axios.post(
      `${API_URL}/update-fcm-token`,
      { userId, fcmToken: storedToken },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    localStorage.removeItem("fcmToken"); // Cleanup after success
  } catch (error) {
    console.error("Retry later - token not synced yet");
  }
};
