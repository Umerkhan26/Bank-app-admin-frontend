// import React from "react";

// interface EnrolledUsersModalProps {
//   showModal: boolean;
//   handleClose: () => void;
//   enrolledUsers: string[];
// }

// const EnrolledUsersModal: React.FC<EnrolledUsersModalProps> = ({
//   showModal,
//   handleClose,
//   enrolledUsers,
// }) => {
//   return (
//     showModal && (
//       <div style={modalStyles.overlay}>
//         <div style={modalStyles.modal}>
//           <h3>Enrolled Users</h3>
//           {enrolledUsers.length > 0 ? (
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr>
//                   <th style={{ border: "1px solid #ddd", padding: "8px" }}>
//                     #
//                   </th>
//                   <th style={{ border: "1px solid #ddd", padding: "8px" }}>
//                     User ID
//                   </th>
//                   <th style={{ border: "1px solid #ddd", padding: "8px" }}>
//                     Name
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {enrolledUsers.map((user, index) => (
//                   <tr key={index}>
//                     <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                       {index + 1}
//                     </td>
//                     <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                       {typeof user === "string" ? user : user.id}
//                     </td>
//                     <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                       {typeof user === "string" ? "N/A" : user.name}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No enrolled users</p>
//           )}
//           <button onClick={handleClose} style={modalStyles.closeButton}>
//             Close
//           </button>
//         </div>
//       </div>
//     )
//   );
// };

// const modalStyles = {
//   overlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modal: {
//     backgroundColor: "white",
//     padding: "20px",
//     borderRadius: "5px",
//     maxWidth: "400px",
//     width: "100%",
//   },
//   closeButton: {
//     backgroundColor: "#1a8797",
//     color: "white",
//     padding: "7px 15px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     marginTop: "10px",
//   },
// };

// export default EnrolledUsersModal;

import React from "react";
import { useLocation } from "react-router-dom"; // Adjust the path as needed
import TableContainer from "../TabConatiner/TableConatiner";
import { Column } from "react-table";

interface IUser {
  id: string;
  name: string;
  disableFilters: string;
}

const EnrolledUsersPage: React.FC = () => {
  const location = useLocation();
  const { enrolledUsers = [] } = location.state || {};

  // Define columns for the table
  const columns: Column<IUser>[] = [
    {
      Header: "#",
      id: "rowNumber",
      Cell: ({ row }) => row.index + 1,
      // disableFilters: true,
      width: 50,
    },
    {
      Header: "User ID",
      accessor: (user: any) => (typeof user === "string" ? user : user.id),
      width: 150,
    },
    {
      Header: "Name",
      accessor: (user: any) => (typeof user === "string" ? "N/A" : user.name),
      width: 200,
    },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1
        style={{ textAlign: "center", marginBottom: "20px", color: "#1a8797" }}
      >
        Enrolled Users
      </h1>
      {enrolledUsers.length > 0 ? (
        <TableContainer
          columns={columns}
          data={enrolledUsers}
          isPagination={true}
          iscustomPageSize={true}
          className="table-responsive"
        />
      ) : (
        <p style={{ textAlign: "center", color: "#555" }}>No enrolled users</p>
      )}
    </div>
  );
};

export default EnrolledUsersPage;
