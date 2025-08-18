// import { API_URL } from "./brandService";

// interface LoginResponse {
//   token: string;
//   user: any;
// }

// export const loginUser = async (
//   email: string,
//   password: string
// ): Promise<LoginResponse> => {
//   const body = { email, password };

//   const response = await fetch(`${API_URL}/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Login failed");
//   }

//   return data;
// };

import axios from "axios";
import { API_URL } from "./brandService";
import { refreshFcmToken } from "../utils/firebase";
import { toast } from "react-toastify";

export interface User {
  _id: string;
  name: string;
  email: string;
  address: string;
  isVerified: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface FcmTokenResponse {
  success: boolean;
  message?: string;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Login failed";
    throw new Error(message);
  }
};

export const handleFcmToken = async (
  token: string,
  userId: string,
  address: string
): Promise<FcmTokenResponse> => {
  try {
    const fcmToast = toast.loading("Setting up push notifications...");
    const fcmToken = await refreshFcmToken();

    if (!fcmToken) {
      toast.update(fcmToast, {
        render: "Notifications permission not granted",
        type: "warning",
        isLoading: false,
        autoClose: 3000,
      });
      throw new Error("Notification permission denied");
    }

    toast.update(fcmToast, {
      render: "Registering device for notifications...",
      type: "info",
      isLoading: true,
    });

    const response = await axios.put<FcmTokenResponse>(
      `${API_URL}/user/${userId}/fcm-token`,
      { fcmToken, address },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    toast.update(fcmToast, {
      render: "Push notifications enabled!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to enable notifications";
    toast.error(message, { autoClose: 5000 });
    throw new Error(message);
  }
};
