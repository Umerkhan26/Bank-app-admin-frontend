import axios from "axios";
import { API_URL } from "./brandService";

// export const fetchUsersData = async (page: number, limit: number) => {
//   try {
//     const response = await axios.get(`${API_URL}/getAllUsers`, {
//       params: { page, limit },
//     });
//     return response.data; // contains { users, totalCount, totalPages, currentPage }
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     throw error;
//   }
// };

export const fetchUsersData = async (
  page: number,
  limit: number,
  brandId?: string,
  search?: string
) => {
  try {
    const response = await axios.get(`${API_URL}/getAllUsers`, {
      params: { page, limit, brandId, search },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const updateUserStatus = async ({
  userId,
  newStatus,
}: {
  userId: string;
  newStatus: boolean;
}) => {
  try {
    const response = await axios.put(`${API_URL}/user/${userId}/status`, {
      isActive: newStatus,
    });
    return response.data.user;
  } catch (error) {
    console.error("Failed to update user status:", error);
    throw new Error("Failed to update user status");
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/user/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw new Error("Failed to delete user");
  }
};

// ✅ Export users to CSV
export const exportUsersToCSV = async () => {
  try {
    const response = await axios.get(`${API_URL}/export-users-csv`, {
      responseType: "blob", // Important: tell axios you expect a file
    });

    // Create a URL for the blob and trigger download
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv"); // file name
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true;
  } catch (error) {
    console.error("Error exporting users to CSV:", error);
    throw new Error("Error exporting users to CSV");
  }
};
