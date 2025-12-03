import axios from "axios";
import { API_URL } from "./brandService";

export const fetchCampaignsData = () => {
  const campaigns = [
    {
      id: 1,
      title: "Summer Campaign",
      description: "Promoting summer discounts on all courses",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      isActive: true,
    },
    {
      id: 2,
      title: "Winter Campaign",
      description: "Winter sale on educational materials",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      image: "https://randomuser.me/api/portraits/men/8.jpg",
      isActive: false,
    },
    {
      id: 3,
      title: "Holiday Promo",
      description: "Discounted packages for holiday season",
      startDate: "2024-12-01",
      endDate: "2024-12-25",
      image: "https://randomuser.me/api/portraits/women/9.jpg",
      isActive: true,
    },
    {
      id: 4,
      title: "New Year Campaign",
      description: "Celebrate the new year with new course enrollments",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      isActive: false,
    },
    {
      id: 5,
      title: "Back to School Sale",
      description: "Discounts for all students heading back to school",
      startDate: "2024-08-01",
      endDate: "2024-09-30",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      isActive: true,
    },
    {
      id: 6,
      title: "Spring Break Promo",
      description: "Spring break discounts on all courses",
      startDate: "2025-03-01",
      endDate: "2025-03-31",
      image: "https://randomuser.me/api/portraits/men/19.jpg",
      isActive: true,
    },
  ];
  return campaigns;
};

export interface CampaignData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  pointsRequired: number;
  status: string;
  image: string | null;
  imagePreview: string | null;
  isBlocked: boolean;
  isActive: boolean;
  action: string;
  id: number;
}

export const createCampaignData = async (formData: FormData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.post(`${API_URL}/campaigns`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
};

export const CampaignsData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.get(`${API_URL}/getCampaigns`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.campaigns;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};

export const updateCampaignData = async (
  formData: FormData,
  campaignId: string
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.put(
      `${API_URL}/updateCampaigns/${campaignId}`,
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

export const deleteCampaignData = async (campaignId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  if (!/^[0-9a-fA-F]{24}$/.test(campaignId)) {
    throw new Error("Invalid campaign ID format");
  }

  try {
    const response = await axios.delete(`${API_URL}//campaigns/${campaignId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw error;
  }
};

export interface LeaderboardUser {
  userId: string;
  username?: string;
  fullName?: string;
  email?: string;
  totalRedeems?: number;
  lastRedeemedAt?: string;
  redemptionCount?: number;
}
export interface CampaignWithLeaderboard {
  _id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  image: string | null;
  isActive: boolean;
  brand: string | { _id: string; brandName: string };
  leaderboard: LeaderboardUser[];
  points_required: number;
}

export const fetchCampaignsWithLeaderboard = async (): Promise<
  CampaignWithLeaderboard[]
> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.get(`${API_URL}/campaign-with-user-history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // should return array of CampaignWithLeaderboard
  } catch (error) {
    console.error("Error fetching campaigns with leaderboard:", error);
    throw error;
  }
};

export const downloadCampaignRedeemsCSV = async (campaignId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.get(
      `${API_URL}/campaign/${campaignId}/redeems/export`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `campaign_${campaignId}_redeems.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading CSV:", error);
    throw error;
  }
};
