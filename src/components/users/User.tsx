// import React, { useState, useEffect } from "react";
// import { Column } from "react-table";
// import {
//   deleteUser,
//   fetchUsersData,
//   updateUserStatus,
// } from "../../services/user";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   Container,
//   HeaderSection,
//   Title,
//   UserCount,
//   SearchInput,
//   AddUserButton,
// } from "./User.Styles";
// import TableContainer from "../TabConatiner/TableConatiner";
// import { ClipLoader } from "react-spinners";
// import { toast } from "react-toastify";

// // Interface for User
// interface User {
//   _id: string;
//   isBlocked: boolean;
//   isActive: boolean;
//   id: number;
//   name: string;
//   email: string;
//   date_of_birth: string;
//   points: number;
//   brandPoints?: { brand: string; points: number; _id: string }[];
// }

// const User: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);
//   const [editingStatusUserId, setEditingStatusUserId] = useState<string | null>(
//     null
//   );
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const fetchedUsers = await fetchUsersData();
//         console.log("Fetched Users Response:", fetchedUsers);
//         setUsers(fetchedUsers);
//       } catch (err) {
//         setError(err as Error);
//         toast.error("Failed to fetch users.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   const toggleStatusButtons = (userId: string) => {
//     setEditingStatusUserId(userId);
//   };

//   const handleStatusOptionChange = async (userId: string, status: string) => {
//     const newStatus = status === "Active";
//     try {
//       const updatedUser = await updateUserStatus({ userId, newStatus });
//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user._id === updatedUser._id
//             ? { ...user, isActive: updatedUser.isActive }
//             : user
//         )
//       );
//       setEditingStatusUserId(null);
//       toast.success("User status updated!");
//     } catch (err) {
//       console.error("Error updating user status:", err);
//       toast.error("Failed to update user status");
//     }
//   };

//   const handleDeleteUser = async (user: User) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     try {
//       const deletedUser = await deleteUser(user._id);
//       setUsers((prevUsers) =>
//         prevUsers.filter((existingUser) => existingUser._id !== deletedUser._id)
//       );
//       toast.success("User deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       toast.error("Failed to delete user.");
//     }
//   };

//   // Filtered data
//   const filteredUsers = users.filter(
//     (user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (user.isActive ? "active" : "blocked").includes(searchTerm.toLowerCase())
//   );

//   // Pagination
//   const totalItems = filteredUsers.length;
//   const totalPages = Math.ceil(totalItems / pageSize);
//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const columns: Column<User>[] = React.useMemo(
//     () => [
//       {
//         Header: "ID",
//         accessor: "id",
//         Cell: ({ row }) => row.index + 1,
//         width: 50,
//       },
//       {
//         Header: "Name",
//         accessor: "name",
//         width: 150,
//       },
//       {
//         Header: "Email",
//         accessor: "email",
//         width: 250,
//       },
//       {
//         Header: "Date Of Birth",
//         accessor: "date_of_birth",
//         Cell: ({ value }) => new Date(value).toISOString().split("T")[0],
//         width: 120,
//       },
//       {
//         Header: "Points",
//         accessor: "points",
//         width: 80,
//         Cell: ({ row }) => {
//           const user = row.original;

//           if (typeof user.points === "number") return user.points;

//           if (Array.isArray(user.brandPoints)) {
//             const total = user.brandPoints.reduce(
//               (sum, bp) => sum + (bp.points || 0),
//               0
//             );
//             return total;
//           }

//           return 0;
//         },
//       },
//       {
//         Header: "Action",
//         accessor: "_id",
//         width: 200,
//         Cell: ({ row }) => (
//           <div style={{ display: "flex", alignItems: "center" }}>
//             {editingStatusUserId === row.original._id ? (
//               <div
//                 style={{ display: "flex", gap: "5px", alignItems: "center" }}
//               >
//                 <button
//                   onClick={() =>
//                     handleStatusOptionChange(row.original._id, "Active")
//                   }
//                   style={{
//                     backgroundColor: "#1a8797",
//                     color: "white",
//                     padding: "5px 15px",
//                     border: "none",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Active
//                 </button>
//                 <button
//                   onClick={() =>
//                     handleStatusOptionChange(row.original._id, "Blocked")
//                   }
//                   style={{
//                     backgroundColor: "#dc3545",
//                     color: "white",
//                     padding: "5px 10px",
//                     border: "none",
//                     cursor: "pointer",
//                     borderRadius: "5px",
//                   }}
//                 >
//                   Block
//                 </button>
//                 <button
//                   onClick={() => handleDeleteUser(row.original)}
//                   className="btn btn-danger ms-2"
//                   style={{
//                     padding: "5px 9px",
//                     border: "none",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Delete
//                 </button>
//               </div>
//             ) : (
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <button
//                   onClick={() => toggleStatusButtons(row.original._id)}
//                   style={{
//                     backgroundColor: row.original.isActive
//                       ? "#1a8797"
//                       : "#dc3545",
//                     color: "white",
//                     padding: "7px 9px",
//                     border: "none",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {row.original.isActive ? "Active" : "Blocked"}
//                 </button>
//                 <button
//                   onClick={() => handleDeleteUser(row.original)}
//                   className="btn btn-danger ms-2"
//                   style={{
//                     padding: "7px 10px",
//                     border: "none",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Delete
//                 </button>
//               </div>
//             )}
//           </div>
//         ),
//       },
//     ],
//     [editingStatusUserId]
//   );

//   if (loading) {
//     return (
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100vw",
//           height: "100vh",
//           backgroundColor: "rgba(255, 255, 255, 0.6)",
//           zIndex: 9999,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <ClipLoader size={40} color="#1a8797" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ color: "red", padding: "20px" }}>
//         Error: {error.message}
//       </div>
//     );
//   }

//   return (
//     <Container>
//       <HeaderSection>
//         <div>
//           <Title>All Users</Title>
//           <UserCount>({filteredUsers.length})</UserCount>
//         </div>
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <SearchInput
//             type="text"
//             placeholder="Search users..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//           <AddUserButton>Add User</AddUserButton>
//         </div>
//       </HeaderSection>

//       <div style={{ width: "100%", overflowX: "auto" }}>
//         <TableContainer
//           columns={columns}
//           data={paginatedUsers}
//           isPagination={true}
//           iscustomPageSize={true}
//           pagination={{
//             currentPage,
//             totalPages,
//             totalItems,
//             pageSize,
//           }}
//           onPageChange={setCurrentPage}
//           onPageSizeChange={setPageSize}
//           showHeaderFilters={false}
//         />
//       </div>
//     </Container>
//   );
// };

// export default User;

import React, { useState, useEffect } from "react";
import { Column } from "react-table";
import {
  deleteUser,
  exportUsersToCSV,
  fetchUsersData,
  updateUserStatus,
} from "../../services/user";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  HeaderSection,
  Title,
  UserCount,
  SearchInput,
  AddUserButton,
} from "./User.Styles";
import TableContainer from "../TabConatiner/TableConatiner";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

// Interface for User
interface User {
  _id: string;
  isBlocked: boolean;
  isActive: boolean;
  id: number;
  name: string;
  email: string;
  date_of_birth: string;
  points: number;
  brandPoints?: { brand: string; points: number; _id: string }[];
}

const User: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editingStatusUserId, setEditingStatusUserId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
const [debouncedSearch, setDebouncedSearch] = useState("");

  // const loadData = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await fetchUsersData(currentPage, pageSize);
  //     console.log("Fetched Users Response:", data);

  //     setUsers(data.users);
  //     setTotalPages(data.totalPages);
  //     setTotalItems(data.totalCount);
  //   } catch (err) {
  //     setError(err as Error);
  //     toast.error("Failed to fetch users.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearch(searchTerm);
    setCurrentPage(1); // reset to first page when searching
  }, 2000); // 500ms debounce delay

  return () => {
    clearTimeout(handler);
  };
}, [searchTerm]);
const loadData = async () => {
  try {
    setLoading(true);
    const data = await fetchUsersData(
      currentPage,
      pageSize,
      undefined,
      debouncedSearch
    );

    console.log("Fetched Users Response:", data);

    if (data.users.length === 0) {
      toast.info("No users found");
    }

    setUsers(data.users);
    setTotalPages(data.totalPages);
    setTotalItems(data.totalCount);
  } catch (err) {
    setError(err as Error);
    toast.error("Failed to fetch users.");
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  loadData();
}, [currentPage, pageSize, debouncedSearch]);

  const toggleStatusButtons = (userId: string) => {
    setEditingStatusUserId(userId);
  };

  const handleStatusOptionChange = async (userId: string, status: string) => {
    const newStatus = status === "Active";
    try {
      const updatedUser = await updateUserStatus({ userId, newStatus });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id
            ? { ...user, isActive: updatedUser.isActive }
            : user
        )
      );
      setEditingStatusUserId(null);
      toast.success("User status updated!");
    } catch (err) {
      console.error("Error updating user status:", err);
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const deletedUser = await deleteUser(user._id);
      setUsers((prevUsers) =>
        prevUsers.filter((existingUser) => existingUser._id !== deletedUser._id)
      );
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };
const handleExport = async () => {
  try {
    await exportUsersToCSV();
      toast.success("User CSV file downloaded successfully!");
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Failed to export users: ${error.message}`);
    } else {
      alert("Failed to export users.");
    }
  }
};

  // Client-side filter (applies to current page’s results only)
  // const filteredUsers = users.filter(
  //   (user) =>
  //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     (user.isActive ? "active" : "blocked").includes(searchTerm.toLowerCase())
  // );

  const columns: Column<User>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ row }) => row.index + 1,
        width: 50,
      },
      {
        Header: "Name",
        accessor: "name",
        width: 150,
      },
      {
        Header: "Email",
        accessor: "email",
        width: 250,
      },
      {
        Header: "Date Of Birth",
        accessor: "date_of_birth",
        Cell: ({ value }) => new Date(value).toISOString().split("T")[0],
        width: 120,
      },
      {
        Header: "Points",
        accessor: "points",
        width: 80,
        Cell: ({ row }) => {
          const user = row.original;

          if (typeof user.points === "number") return user.points;

          if (Array.isArray(user.brandPoints)) {
            const total = user.brandPoints.reduce(
              (sum, bp) => sum + (bp.points || 0),
              0
            );
            return total;
          }

          return 0;
        },
      },
      {
        Header: "Action",
        accessor: "_id",
        width: 200,
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            {editingStatusUserId === row.original._id ? (
              <div
                style={{ display: "flex", gap: "5px", alignItems: "center" }}
              >
                <button
                  onClick={() =>
                    handleStatusOptionChange(row.original._id, "Active")
                  }
                  style={{
                    backgroundColor: "#1a8797",
                    color: "white",
                    padding: "5px 15px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Active
                </button>
                <button
                  onClick={() =>
                    handleStatusOptionChange(row.original._id, "Blocked")
                  }
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  Block
                </button>
                <button
                  onClick={() => handleDeleteUser(row.original)}
                  className="btn btn-danger ms-2"
                  style={{
                    padding: "5px 9px",
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
                  onClick={() => toggleStatusButtons(row.original._id)}
                  style={{
                    backgroundColor: row.original.isActive
                      ? "#1a8797"
                      : "#dc3545",
                    color: "white",
                    padding: "7px 9px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {row.original.isActive ? "Active" : "Blocked"}
                </button>
                <button
                  onClick={() => handleDeleteUser(row.original)}
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
          </div>
        ),
      },
    ],
    [editingStatusUserId]
  );

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ClipLoader size={40} color="#1a8797" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", padding: "20px" }}>
        Error: {error.message}
      </div>
    );
  }

return (
  <Container>
    <HeaderSection>
      <div>
        <Title>All Users</Title>
        <UserCount>({totalItems})</UserCount>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <SearchInput
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <AddUserButton onClick={handleExport}>Download Users</AddUserButton>
      </div>
    </HeaderSection>

    {/* Always show the table, even if it's empty */}
    <div style={{ width: "100%", overflowX: "auto" }}>
      <TableContainer
        columns={columns}
        data={users} // 👈 empty array will show an empty table
        isPagination={true}
        iscustomPageSize={true}
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          pageSize,
        }}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        showHeaderFilters={false}
      />
    </div>
  </Container>
);
};

export default User;
