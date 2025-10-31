import axios from "axios";
import { API_URL } from "./brandService";

export const createPromotionData = async (formData: FormData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.post(`${API_URL}/createPromotion`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating promotion:", error);
    throw error;
  }
};

export const getPromotionsData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.get(`${API_URL}/getPromotions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};

export const updatePromotionData = async (
  formData: FormData,
  promotionId: string
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.put(
      `${API_URL}/updatePromotion/${promotionId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating campaign:", error);
    throw error;
  }
};

export const deletePromotionData = async (promotionId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  if (!/^[0-9a-fA-F]{24}$/.test(promotionId)) {
    throw new Error("Invalid campaign ID format");
  }

  try {
    const response = await axios.delete(
      `${API_URL}/deletePromotion/${promotionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw error;
  }
};
