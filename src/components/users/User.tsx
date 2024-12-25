import React from "react";
import {
  deleteUser,
  fetchUsersData,
  updateUserStatus,
} from "../../services/user";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Container,
  HeaderSection,
  Title,
  UserCount,
  SearchInput,
  AddUserButton,
  Table,
  TableHeader,
  TableRow,
  TableData,
} from "./User.Styles";
import axios from "axios";
// import Loader from "../../components/Loader/Loader";

interface User {
  _id: string;
  isBlocked: boolean;
  isActive: boolean;
  id: number;
  name: string;
  email: string;
  date_of_birth: string;
  points: number;
  action: string;
}

const User: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const [editingStatusUserId, setEditingStatusUserId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedUsers = await fetchUsersData();
        setUsers(fetchedUsers);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) return <div>Error loading users: {error.message}</div>;

  const toggleStatusButtons = (userId: string) => {
    setEditingStatusUserId(userId);
  };

  const handleStatusOptionChange = async (userId: string, status: string) => {
    const newStatus = status === "Active"; // Convert status to boolean (true for Active, false for Blocked)

    try {
      // Fetch the updated user with the new status
      const updatedUser = await updateUserStatus({ userId, newStatus });

      // Update the state by preserving other user fields and only updating the status
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id
            ? { ...user, isActive: updatedUser.isActive } // Preserve all fields but only update the status
            : user
        )
      );

      setEditingStatusUserId(null); // Close the status dropdown after the update
    } catch (err) {
      console.error("Error updating user status:", err);
      setError(new Error("Failed to update user status"));
    }
  };

  const handleDeleteUser = async (user: User) => {
    console.log(`Deleting user: ${user.name}`);

    try {
      const deletedUser = await deleteUser(user._id);

      setUsers((prevUsers) =>
        prevUsers.filter((existingUser) => existingUser._id !== deletedUser._id)
      );

      console.log("User deleted successfully", deletedUser);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(new Error("Failed to delete user"));
    }
  };

  return (
    <Container>
      {/* {loading && <Loader />} */}
      <HeaderSection>
        <div>
          <Title>All Users</Title>
          <UserCount>({users.length})</UserCount>{" "}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <SearchInput type="text" placeholder="Search users..." />
          <AddUserButton>Add User</AddUserButton>
        </div>
      </HeaderSection>

      <Table>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Date Of Birth</TableHeader>
            <TableHeader>Points</TableHeader>
            <TableHeader>Action</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableData>{index + 1}</TableData>
              <TableData>{user.name}</TableData>
              <TableData>{user.email}</TableData>
              <TableData>
                {new Date(user.date_of_birth).toISOString().split("T")[0]}
              </TableData>

              {/* Fixed typo in 'data_of_birth' */}
              <TableData>{user.points}</TableData>
              <TableData>
                {editingStatusUserId === user._id ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleStatusOptionChange(user._id, "Active")
                      }
                      style={{
                        backgroundColor: user.isActive ? "#1a8797" : "#1a8797",
                        color: "white",
                        padding: "7px 15px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Active
                    </button>
                    <button
                      onClick={() =>
                        handleStatusOptionChange(user._id, "Blocked")
                      }
                      style={{
                        backgroundColor: !user.isActive ? "#dc3545" : "#1a8797",
                        color: "white",
                        padding: "7px 10px",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    >
                      Block
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="btn btn-danger ms-2"
                      style={{
                        padding: "7px 9px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      onClick={() => toggleStatusButtons(user._id)}
                      style={{
                        backgroundColor: user.isActive ? "#1a8797" : "#dc3545",
                        color: "white",
                        padding: "7px 9px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {user.isActive ? "Active" : "Blocked"}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="btn btn-danger ms-2"
                      style={{
                        padding: "7px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default User;
