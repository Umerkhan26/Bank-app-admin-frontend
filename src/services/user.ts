import axios from "axios";
import { API_URL } from "./brandService";

// export const fetchUsersData = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/getAllUsers`);
//     return response.data.users;
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     throw error;
//   }
// };

export const fetchUsersData = async (
  page = 1,
  limit = 10,
  brandId?: string
) => {
  try {
    const response = await axios.get(`${API_URL}/getAllUsers`, {
      params: { page, limit, brandId },
    });

    // 👇 destructure correctly from API response
    const { users, totalCount, totalPages, currentPage } = response.data;

    return {
      users, // this is now the actual paginated array
      totalCount,
      totalPages,
      currentPage,
    };
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
