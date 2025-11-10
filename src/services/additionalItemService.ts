import axios from "axios";
import { API_URL } from "./brandService";

export interface IBrand {
  _id: string;
  brandName?: string;
}

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
  brand?: string | IBrand;
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
  totalRedeemCount: number;
  userRedeemCount: number;
  lastRedeemedAt: string;
}

export interface FetchAdditionalItemsResponse {
  data: IAdditionalItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
export const getAllAdditionalItems = async (
  page = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
): Promise<FetchAdditionalItemsResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    if (search.trim()) params.append("search", search.trim());

    const response = await axios.get(
      `${API_URL}/getAllAdditionalItems?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const apiData = response.data.data;

    return {
      data: apiData.data || [],
      totalCount: apiData.totalCount || 0,
      totalPages: apiData.totalPages || 1,
      currentPage: apiData.currentPage || 1,
    };
  } catch (error: any) {
    console.error("Error fetching additional items:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch additional items"
    );
  }
};

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
  totalRedeemCount: number;
}

export const fetchAdditionalItemsWithLeaderboard = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<{
  data: AdditionalItemWithLeaderboard[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const response = await axios.get(`${API_URL}/additional-items-leadboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: { page, limit, search },
    });

    return response.data; // ✅ Matches your backend structure
  } catch (error: any) {
    console.error("Error fetching additional items leaderboard:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch additional items leaderboard"
    );
  }
};
