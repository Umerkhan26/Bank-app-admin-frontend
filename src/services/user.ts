import axios from "axios";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    active: true,
    role: "Admin",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    active: false,
    role: "Teacher",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    active: true,
    role: "Student",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 4,
    name: "Bob Brown",
    email: "bob@example.com",
    active: true,
    role: "Student",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    active: true,
    role: "Admin",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: 6,
    name: "Diana Prince",
    email: "diana@example.com",
    active: true,
    role: "Teacher",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    id: 7,
    name: "Ethan Hunt",
    email: "ethan@example.com",
    active: false,
    role: "Student",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: 8,
    name: "Fiona Gallagher",
    email: "fiona@example.com",
    active: true,
    role: "Student",
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: 9,
    name: "George Clooney",
    email: "george@example.com",
    active: false,
    role: "Admin",
    profilePic: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    id: 10,
    name: "Hannah Montana",
    email: "hannah@example.com",
    active: true,
    role: "Teacher",
    profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  {
    id: 11,
    name: "Ian Malcolm",
    email: "ian@example.com",
    active: true,
    role: "Student",
    profilePic: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: 12,
    name: "Jack Sparrow",
    email: "jack@example.com",
    active: true,
    role: "Student",
    profilePic: "https://randomuser.me/api/portraits/men/12.jpg",
  },
];

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

export default users;
