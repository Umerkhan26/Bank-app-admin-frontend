import axios from "axios";
import { API_URL } from "./brandService";

export interface IAdditionalItem {
  _id: string;
  title: string;
  description: string;
  points_required: string;
  start_date: string;
  end_date: string;
  image_url: string;
  active: boolean;
  enrolled_users: string[];
  brand?: string;
  qty?: number;
  redemptions: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaderboardUser {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  totalRedeems: number;
  lastRedeemedAt: string;
}

export const getAllAdditionalItems = async (): Promise<IAdditionalItem[]> => {
  try {
    const response = await axios.get(`${API_URL}/getAllAdditionalItems`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching additional items:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch additional items"
    );
  }
};

// Create additional item
export const createAdditionalItem = async (
  formData: FormData
): Promise<{ data: IAdditionalItem }> => {
  try {
    const response = await axios.post(`${API_URL}/additionalItems`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating additional item:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create additional item"
    );
  }
};

export const updateAdditionalItem = async (
  id: string,
  formData: FormData
): Promise<{ data: IAdditionalItem }> => {
  try {
    const response = await axios.put(
      `${API_URL}/updateAdditionalItems/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating additional item:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update additional item"
    );
  }
};

// Delete additional item
export const deleteAdditionalItem = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/deleteAdditionalItems/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error: any) {
    console.error("Error deleting additional item:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete additional item"
    );
  }
};

export interface AdditionalItemWithLeaderboard extends IAdditionalItem {
  leaderboard: LeaderboardUser[];
  totalItemRedeems: number;
}

export const fetchAdditionalItemsWithLeaderboard = async (): Promise<
  AdditionalItemWithLeaderboard[]
> => {
  try {
    const response = await axios.get(`${API_URL}/additional-items-leadboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching additional items leaderboard:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch additional items leaderboard"
    );
  }
};
