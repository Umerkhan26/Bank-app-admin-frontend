import axios from "axios";

export const createStoreData = async (storeData: any) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/api/createStore",
      storeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating store:", error);
    throw error;
  }
};

export const getStoresData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.get("http://localhost:3000/api/getStore", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
    const token = localStorage.getItem("token"); // Retrieve token from local storage

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.put(
      `http://localhost:3000/api/updateStore/${storeId}`,
      storeData, // Send data as JSON
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to request header
        },
      }
    );

    return response.data; // Assuming the backend sends updated store data in response
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
    const response = await axios.delete(
      `http://localhost:3000/api/deleteStore/${storeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting store:", error);
    throw error;
  }
};
