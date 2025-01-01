import axios from "axios";

export const createPromotionData = async (formData: FormData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/api/createPromotion",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Ensure correct Content-Type
        },
      }
    );
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
    const response = await axios.get(
      "http://localhost:3000/api/getPromotions",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
      `http://localhost:3000/api/updatePromotion/${promotionId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("API response for update:", response);
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

  console.log("Deleting campaign with ID:", promotionId); // Log the campaign ID

  // Validate the campaignId format (should be a 24-character hex string)
  if (!/^[0-9a-fA-F]{24}$/.test(promotionId)) {
    throw new Error("Invalid campaign ID format");
  }

  try {
    const response = await axios.delete(
      `http://localhost:3000/api/deletePromotion/${promotionId}`,
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
