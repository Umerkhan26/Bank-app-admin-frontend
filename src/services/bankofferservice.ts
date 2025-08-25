import axios from "axios";
import { API_URL } from "./brandService";

export const createBankOfferData = async (formData: any) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authorization token is missing");
  }
  try {
    const response = await axios.post(`${API_URL}/bank-offers`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating bank offer:", error);
    throw error;
  }
};

export const getBankOffersData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authorization token is missing");
  }
  try {
    const response = await axios.get(`${API_URL}/get-bank-offers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bank offers:", error);
    throw error;
  }
};

export const updateBankOfferData = async (formData: any, offerId: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authorization token is missing");
  }
  try {
    const response = await axios.put(
      `${API_URL}/update-bank-offer/${offerId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating bank offer:", error);
    throw error;
  }
};

export const deleteBankOfferData = async (offerId: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authorization token is missing");
  }
  try {
    const response = await axios.delete(
      `${API_URL}/delete-bank-offers/${offerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting bank offer:", error);
    throw error;
  }
};
