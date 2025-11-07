// import React, { useState, useEffect, useMemo } from "react";
// import { Column, Row } from "react-table";
// import {
//   fetchAdditionalItemsWithLeaderboard,
//   AdditionalItemWithLeaderboard,
// } from "../../services/additionalItemService";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   Container,
//   HeaderSection,
//   Title,
//   UserCount,
//   SearchInput,
// } from "../users/User.Styles";
// import TableContainer from "../TabConatiner/TableConatiner";
// import { ClipLoader } from "react-spinners";
// import { toast } from "react-toastify";

// interface LeaderboardRow {
//   itemTitle: string;
//   brandName: string;
//   userName: string;
//   userEmail: string;
//   totalRedeems: number;
//   lastRedeemedAt: string;
//   pointsRequired: number;
//   startDate: string;
//   endDate: string;
//   rank: number;
//   itemStatus: string;
// }

// const AdditionalItemsLeaderboard: React.FC = () => {
//   const [leaderboardData, setLeaderboardData] = useState<LeaderboardRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const items: AdditionalItemWithLeaderboard[] =
//           await fetchAdditionalItemsWithLeaderboard();
//         const rows: LeaderboardRow[] = [];

//         items.forEach((item) => {
//           const brandName =
//             typeof item.brand === "string"
//               ? item.brand
//               : item.brand?.brandName || "N/A";
//           const pointsRequired = Number(item.points_required || 0);
//           const startDate = item.start_date
//             ? new Date(item.start_date).toLocaleDateString()
//             : "-";
//           const endDate = item.end_date
//             ? new Date(item.end_date).toLocaleDateString()
//             : "-";
//           const itemStatus = item.active ? "Active" : "Inactive";

//           if (Array.isArray(item.leaderboard) && item.leaderboard.length > 0) {
//             item.leaderboard.forEach((user) => {
//               const totalRedeems = user.totalRedeems || 0;
//               if (totalRedeems > 0) {
//                 const lastRedeemedAt = user.lastRedeemedAt
//                   ? new Date(user.lastRedeemedAt).toLocaleString()
//                   : "-";

//                 rows.push({
//                   itemTitle: item.title,
//                   brandName,
//                   userName: user.fullName || user.username || "-",
//                   userEmail: user.email || "-",
//                   totalRedeems,
//                   lastRedeemedAt,
//                   pointsRequired,
//                   startDate,
//                   endDate,
//                   rank: 0, // Will be calculated later
//                   itemStatus,
//                 });
//               }
//             });
//           }
//         });

//         // Sort by totalRedeems and assign ranks
//         rows.sort((a, b) => b.totalRedeems - a.totalRedeems);
//         let currentRank = 1;
//         let previousRedeems = rows[0]?.totalRedeems;
//         rows.forEach((row, index) => {
//           if (index > 0 && row.totalRedeems < previousRedeems) {
//             currentRank = index + 1;
//             previousRedeems = row.totalRedeems;
//           }
//           row.rank = currentRank;
//         });

//         setLeaderboardData(rows);
//       } catch (err) {
//         setError(err as Error);
//         toast.error("Failed to fetch additional items leaderboard data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Filter data based on search term
//   const filteredData = useMemo(
//     () =>
//       leaderboardData.filter(
//         (item) =>
//           item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.brandName.toLowerCase().includes(searchTerm.toLowerCase())
//       ),
//     [leaderboardData, searchTerm]
//   );

//   const totalRedeemCount = filteredData.reduce(
//     (acc, item) => acc + item.totalRedeems,
//     0
//   );

//   const totalItems = filteredData.length;
//   const totalPages = Math.ceil(totalItems / pageSize);
//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const columns: Column<LeaderboardRow>[] = useMemo(
//     () => [
//       {
//         Header: "Rank",
//         accessor: "rank",
//         width: 40,
//         Cell: ({ value }: { value: number }) => (
//           <span
//             style={{
//               fontWeight: "bold",
//               color:
//                 value === 1
//                   ? "#FFD700"
//                   : value === 2
//                   ? "#C0C0C0"
//                   : value === 3
//                   ? "#CD7F32"
//                   : "inherit",
//             }}
//           >
//             {value === 1
//               ? "🥇"
//               : value === 2
//               ? "🥈"
//               : value === 3
//               ? "🥉"
//               : value}
//           </span>
//         ),
//       },
//       {
//         Header: "User",
//         accessor: "userName",
//         width: 80,
//         Cell: ({ value }: { value: string }) => (
//           <div
//             style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
//           >
//             {value}
//           </div>
//         ),
//       },
//       {
//         Header: "Email",
//         accessor: "userEmail",
//         width: 130,
//         Cell: ({ value }: { value: string }) => (
//           <div
//             style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
//           >
//             {value}
//           </div>
//         ),
//       },
//       {
//         Header: "Item",
//         accessor: "itemTitle",
//         width: 100,
//         Cell: ({ value }: { value: string }) => (
//           <div
//             style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
//           >
//             {value}
//           </div>
//         ),
//       },
//       {
//         Header: "Brand",
//         accessor: "brandName",
//         width: 60,
//         Cell: ({ value }: { value: string }) => (
//           <div
//             style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
//           >
//             {value}
//           </div>
//         ),
//       },
//       {
//         Header: "Redeems",
//         accessor: "totalRedeems",
//         width: 50,
//         Cell: ({ value }: { value: number }) => (
//           <span style={{ fontWeight: "bold", color: "#1a8797" }}>{value}</span>
//         ),
//       },
//       {
//         Header: "Last Redeemed",
//         accessor: "lastRedeemedAt",
//         width: 100,
//         Cell: ({ value }: { value: string }) => (
//           <div
//             style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
//           >
//             {value}
//           </div>
//         ),
//       },
//       {
//         Header: "Points Req.",
//         accessor: "pointsRequired",
//         width: 50,
//         Cell: ({ value }: { value: number }) => (
//           <span style={{ fontWeight: "bold" }}>{value}</span>
//         ),
//       },
//       {
//         Header: "Start",
//         accessor: "startDate",
//         width: 60,
//         Cell: ({ value }: { value: string }) => (
//           <div
//             style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
//           >
//             {value}
//           </div>
//         ),
//       },
//       {
//         Header: "End",
//         accessor: "endDate",
//         width: 60,
//         Cell: ({ value }: { value: string }) => (
//           <div
//             style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
//           >
//             {value}
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   if (loading) {
//     return (
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 100,
//           width: "100vw",
//           height: "100vh",
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
//       <Container>
//         <div
//           style={{
//             textAlign: "center",
//             padding: "2rem",
//             color: "red",
//             fontSize: "14px",
//           }}
//         >
//           Error loading data: {error.message}
//           <br />
//           <button
//             onClick={() => window.location.reload()}
//             style={{
//               marginTop: "10px",
//               padding: "8px 16px",
//               backgroundColor: "#1a8797",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             Try Again
//           </button>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container style={{ fontSize: "11px" }}>
//       <HeaderSection>
//         <div>
//           <Title style={{ fontSize: "14px" }}>
//             Additional Items Redeem Leaderboard
//           </Title>
//           <UserCount>({leaderboardData.length} user redemptions)</UserCount>
//         </div>
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <SearchInput
//             type="text"
//             placeholder="Search user, item or brand..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{ fontSize: "11px", padding: "8px 15px", width: "160px" }}
//           />
//         </div>
//       </HeaderSection>

//       {leaderboardData.length === 0 ? (
//         <div
//           style={{
//             textAlign: "center",
//             padding: "3rem",
//             color: "#6b7280",
//             fontSize: "14px",
//           }}
//         >
//           No redemption data available for additional items.
//         </div>
//       ) : (
//         <div style={{ width: "100%", overflowX: "auto" }}>
//           <TableContainer
//             columns={columns}
//             data={paginatedData}
//             isPagination={true}
//             iscustomPageSize={true}
//             pagination={{
//               currentPage,
//               totalPages,
//               totalItems,
//               pageSize,
//             }}
//             onPageChange={setCurrentPage}
//             onPageSizeChange={setPageSize}
//             showHeaderFilters={false}
//             rowProps={(row: Row<LeaderboardRow>) => ({
//               style: {
//                 backgroundColor: row.index % 2 === 0 ? "#f9f9f9" : "white",
//               },
//             })}
//             footerText={`Total Additional Items Redeemed: ${totalRedeemCount} times`}
//           />
//         </div>
//       )}
//     </Container>
//   );
// };

// export default AdditionalItemsLeaderboard;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Column, Row } from "react-table";
import {
  fetchAdditionalItemsWithLeaderboard,
  AdditionalItemWithLeaderboard,
  GetLeaderboardOptions,
} from "../../services/additionalItemService";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  HeaderSection,
  Title,
  UserCount,
  SearchInput,
} from "../users/User.Styles";
import TableContainer from "../TabConatiner/TableConatiner";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { debounce } from "lodash";

interface LeaderboardRow {
  itemTitle: string;
  brandName: string;
  userName: string;
  userEmail: string;
  totalRedeems: number;
  lastRedeemedAt: string;
  pointsRequired: number;
  startDate: string;
  endDate: string;
  rank: number;
  itemStatus: string;
}

const AdditionalItemsLeaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRedeemCount, setTotalRedeemCount] = useState(0);

  const loadData = useCallback(
    async (page: number, limit: number, search: string = "") => {
      try {
        setLoading(true);
        setError(null);

        const options: GetLeaderboardOptions = {
          page,
          limit,
          search: search || undefined,
        };

        const response = await fetchAdditionalItemsWithLeaderboard(options);
        console.log(" ddd", response);

        const rows: LeaderboardRow[] = [];

        response.data.forEach((item: AdditionalItemWithLeaderboard) => {
          const brandName =
            typeof item.brand === "string"
              ? item.brand
              : item.brand?.brandName || "N/A";
          const pointsRequired = Number(item.points_required || 0);
          const startDate = item.start_date
            ? new Date(item.start_date).toLocaleDateString()
            : "-";
          const endDate = item.end_date
            ? new Date(item.end_date).toLocaleDateString()
            : "-";
          const itemStatus = item.active ? "Active" : "Inactive";

          if (Array.isArray(item.leaderboard) && item.leaderboard.length > 0) {
            item.leaderboard.forEach((user) => {
              const totalRedeems = user.totalRedeems || 0;
              if (totalRedeems > 0) {
                const lastRedeemedAt = user.lastRedeemedAt
                  ? new Date(user.lastRedeemedAt).toLocaleString()
                  : "-";

                rows.push({
                  itemTitle: item.title,
                  brandName,
                  userName: user.fullName || user.username || "-",
                  userEmail: user.email || "-",
                  totalRedeems,
                  lastRedeemedAt,
                  pointsRequired,
                  startDate,
                  endDate,
                  rank: 0,
                  itemStatus,
                });
              }
            });
          }
        });

        // Sort by totalRedeems and assign ranks
        rows.sort((a, b) => b.totalRedeems - a.totalRedeems);
        let currentRank = 1;
        let previousRedeems = rows[0]?.totalRedeems;
        rows.forEach((row, index) => {
          if (index > 0 && row.totalRedeems < previousRedeems) {
            currentRank = index + 1;
            previousRedeems = row.totalRedeems;
          }
          row.rank = currentRank;
        });

        const redeemCount = rows.reduce(
          (acc, item) => acc + item.totalRedeems,
          0
        );

        setLeaderboardData(rows);
        setTotalItems(response.totalCount);
        setTotalPages(response.totalPages);
        setTotalRedeemCount(redeemCount);
      } catch (err) {
        setError(err as Error);
        toast.error("Failed to fetch additional items leaderboard data.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((search: string) => {
        setCurrentPage(1);
        loadData(1, pageSize, search);
      }, 500),
    [loadData, pageSize]
  );

  useEffect(() => {
    loadData(currentPage, pageSize);
  }, [loadData, currentPage, pageSize]);

  useEffect(() => {
    if (searchTerm !== undefined) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const columns: Column<LeaderboardRow>[] = useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "rank",
        width: 40,
        Cell: ({ value }: { value: number }) => (
          <span
            style={{
              fontWeight: "bold",
              color:
                value === 1
                  ? "#FFD700"
                  : value === 2
                  ? "#C0C0C0"
                  : value === 3
                  ? "#CD7F32"
                  : "inherit",
            }}
          >
            {value === 1
              ? "🥇"
              : value === 2
              ? "🥈"
              : value === 3
              ? "🥉"
              : value}
          </span>
        ),
      },
      {
        Header: "User",
        accessor: "userName",
        width: 80,
        Cell: ({ value }: { value: string }) => (
          <div
            style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            {value}
          </div>
        ),
      },
      {
        Header: "Email",
        accessor: "userEmail",
        width: 130,
        Cell: ({ value }: { value: string }) => (
          <div
            style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            {value}
          </div>
        ),
      },
      {
        Header: "Item",
        accessor: "itemTitle",
        width: 100,
        Cell: ({ value }: { value: string }) => (
          <div
            style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            {value}
          </div>
        ),
      },
      {
        Header: "Brand",
        accessor: "brandName",
        width: 60,
        Cell: ({ value }: { value: string }) => (
          <div
            style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            {value}
          </div>
        ),
      },
      {
        Header: "Redeems",
        accessor: "totalRedeems",
        width: 50,
        Cell: ({ value }: { value: number }) => (
          <span style={{ fontWeight: "bold", color: "#1a8797" }}>{value}</span>
        ),
      },
      {
        Header: "Last Redeemed",
        accessor: "lastRedeemedAt",
        width: 100,
        Cell: ({ value }: { value: string }) => (
          <div
            style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            {value}
          </div>
        ),
      },
      {
        Header: "Points Req.",
        accessor: "pointsRequired",
        width: 50,
        Cell: ({ value }: { value: number }) => (
          <span style={{ fontWeight: "bold" }}>{value}</span>
        ),
      },
      {
        Header: "Start",
        accessor: "startDate",
        width: 60,
        Cell: ({ value }: { value: string }) => (
          <div
            style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            {value}
          </div>
        ),
      },
      {
        Header: "End",
        accessor: "endDate",
        width: 60,
        Cell: ({ value }: { value: string }) => (
          <div
            style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            {value}
          </div>
        ),
      },
    ],
    []
  );

  if (loading && leaderboardData.length === 0) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 100,
          width: "100vw",
          height: "100vh",
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
      <Container>
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "red",
            fontSize: "14px",
          }}
        >
          Error loading data: {error.message}
          <br />
          <button
            onClick={() => loadData(currentPage, pageSize, searchTerm)}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#1a8797",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container style={{ fontSize: "11px" }}>
      <HeaderSection>
        <div>
          <Title style={{ fontSize: "14px" }}>
            Additional Items Redeem Leaderboard
          </Title>
          <UserCount>({totalItems} total redemptions)</UserCount>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <SearchInput
            type="text"
            placeholder="Search user, item or brand..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ fontSize: "11px", padding: "8px 15px", width: "160px" }}
          />
        </div>
      </HeaderSection>

      {leaderboardData.length === 0 && !loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          {searchTerm
            ? "No results found for your search."
            : "No redemption data available for additional items."}
        </div>
      ) : (
        <div style={{ width: "100%", overflowX: "auto" }}>
          <TableContainer
            columns={columns}
            data={leaderboardData}
            isPagination={true}
            iscustomPageSize={true}
            pagination={{
              currentPage,
              totalPages,
              totalItems,
              pageSize,
            }}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showHeaderFilters={false}
            rowProps={(row: Row<LeaderboardRow>) => ({
              style: {
                backgroundColor: row.index % 2 === 0 ? "#f9f9f9" : "white",
              },
            })}
            footerText={`Total Additional Items Redeemed: ${totalRedeemCount} times`}
          />
        </div>
      )}
    </Container>
  );
};

export default AdditionalItemsLeaderboard;
