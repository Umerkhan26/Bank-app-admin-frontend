import axios from "axios";
import { API_URL } from "./brandService";

export interface IBankPremium {
  _id: string;
  title: string;
  description: string;
  points_required: string;
  start_date: string;
  end_date: string;
  image_url?: string;
  active: boolean;
  brand?: string;
  enrolled_users?: string[];
  redemptions?: IRedemption[];
}

export interface IRedemption {
  user: string;
  code: string;
  status: "pending" | "delivered";
  redeemedAt: string;
}

export interface BankPremiumWithLeaderboard extends IBankPremium {
  enrolled_users_count?: number;
  redemption_count?: number;
}

export const getAllBankPremiums = async (): Promise<IBankPremium[]> => {
  try {
    const response = await axios.get(`${API_URL}/getBankPremiums`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.bankPremiums;
  } catch (error: any) {
    console.error("Error fetching bank premiums:", error);
    throw new Error("Failed to fetch bank premiums");
  }
};

// Create Bank Premium
export const createBankPremium = async (
  formData: FormData
): Promise<{ bankPremium: IBankPremium }> => {
  try {
    const response = await axios.post(`${API_URL}/bankPremiums`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating bank premium:", error);
    throw new Error("Failed to create bank premium");
  }
};

export const updateBankPremium = async (
  bankPremiumId: string,
  formData: FormData
): Promise<{ bankPremium: IBankPremium }> => {
  try {
    const response = await axios.put(
      `${API_URL}/updateBankPremiums/${bankPremiumId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating bank premium:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update bank premium"
    );
  }
};

// Delete Bank Premium
export const deleteBankPremium = async (
  bankPremiumId: string
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/deleteBankPremiums/${bankPremiumId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
  } catch (error: any) {
    console.error("Error deleting bank premium:", error);
    if (error.response?.status === 401) {
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error("Failed to delete bank premium");
  }
};

export const updateRedemptionStatus = async (
  code: string,
  status: "pending" | "delivered"
): Promise<any> => {
  try {
    const response = await axios.put(
      `${API_URL}/verifyCodeAndUpdateStatus`,
      { code, status }, // send status too
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating redemption status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update redemption status"
    );
  }
};
export const getBankPremiumsWithStats = async (): Promise<
  BankPremiumWithLeaderboard[]
> => {
  try {
    const response = await axios.get(
      `${API_URL}/get-all-bank-premiums-redeemed`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // Access the correct property
    const bankPremiums: IBankPremium[] = response.data.data;

    if (!Array.isArray(bankPremiums)) {
      console.warn("bankPremiums is not an array:", bankPremiums);
      return [];
    }

    // Transform data to include counts
    return bankPremiums.map((premium) => ({
      ...premium,
      enrolled_users_count: premium.enrolled_users?.length || 0,
      redemption_count: premium.redemptions?.length || 0,
    }));
  } catch (error: any) {
    console.error("Error fetching bank premiums:", error);
    throw new Error("Failed to fetch bank premiums");
  }
};
