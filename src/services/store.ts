import axios from "axios";
import { API_URL } from "./brandService";

export const createStoreData = async (storeData: any) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.post(`${API_URL}/createStore`, storeData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating store:", error);
    throw error;
  }
};

export const getStoresData = async () => {
  try {
    const response = await axios.get(`${API_URL}/getStore`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};

export const updateStoreData = async (
  storeData: {
    storeName: string;
    description: string;
    longitude: string;
    latitude: string;
  },
  storeId: string
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.put(
      `${API_URL}/updateStore/${storeId}`,
      storeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating store:", error);
    throw new Error("Error updating store");
  }
};

export const deleteStoreData = async (storeId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.delete(`${API_URL}/deleteStore/${storeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting store:", error);
    throw error;
  }
};
