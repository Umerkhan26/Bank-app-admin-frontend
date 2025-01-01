import axios from "axios";

export const fetchUsersData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/getAllUsers");
    return response.data.users;
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
    const response = await axios.put(
      `http://localhost:3000/api/user/${userId}/status`,
      { isActive: newStatus }
    );
    // Ensure the full updated user object is returned
    return response.data.user; // Make sure the full user object is returned from backend
  } catch (error) {
    console.error("Failed to update user status:", error);
    throw new Error("Failed to update user status");
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/user/${userId}`
    );
    return response.data.user; // Returning the deleted user information
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw new Error("Failed to delete user");
  }
};
