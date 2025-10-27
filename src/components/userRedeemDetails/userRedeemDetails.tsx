import React, { useState, useEffect, useMemo } from "react";
import { Column, Row } from "react-table";
import {
  fetchCampaignsWithLeaderboard,
  CampaignWithLeaderboard,
} from "../../services/campaign";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  HeaderSection,
  Title,
  UserCount,
  SearchInput,
} from "./User.Styles";
import TableContainer from "../TabConatiner/TableConatiner";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

interface LeaderboardRow {
  campaignTitle: string;
  brandName: string;
  userName: string;
  userEmail: string;
  totalRedeems: number;
  lastRedeemedAt: string;
  pointsRequired: number;
  startDate: string;
  endDate: string;
  rank: number; // New field for rank
}

const UserRedeemDetails: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const campaigns: CampaignWithLeaderboard[] =
          await fetchCampaignsWithLeaderboard();
        const rows: LeaderboardRow[] = [];
        console.log("Fetched campaigns:", campaigns);

        campaigns.forEach((campaign) => {
          const brandName =
            typeof campaign.brand === "string"
              ? campaign.brand
              : campaign.brand?.brandName || "N/A";
          const pointsRequired = Number(campaign.points_required || 0);
          const startDate = campaign.start_date
            ? new Date(campaign.start_date).toLocaleDateString()
            : "-";
          const endDate = campaign.end_date
            ? new Date(campaign.end_date).toLocaleDateString()
            : "-";

          if (
            Array.isArray(campaign.leaderboard) &&
            campaign.leaderboard.length > 0
          ) {
            campaign.leaderboard.forEach((user) => {
              const totalRedeems = user.totalRedeems || 0;
              if (totalRedeems > 0) {
                const lastRedeemedAt = user.lastRedeemedAt
                  ? new Date(user.lastRedeemedAt).toLocaleString()
                  : "-";

                rows.push({
                  campaignTitle: campaign.title,
                  brandName,
                  userName: user.fullName || user.username || "-",
                  userEmail: user.email || "-",
                  totalRedeems,
                  lastRedeemedAt,
                  pointsRequired,
                  startDate,
                  endDate,
                  rank: 0, // Will be calculated later
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

        setLeaderboardData(rows);
      } catch (err) {
        setError(err as Error);
        toast.error("Failed to fetch leaderboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter
  const filteredData = useMemo(
    () =>
      leaderboardData.filter(
        (item) =>
          item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brandName.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [leaderboardData, searchTerm]
  );

  const totalRedeemCount = filteredData.reduce(
    (acc, item) => acc + item.totalRedeems,
    0
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<LeaderboardRow>[] = useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "rank",
        width: 50,
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
      { Header: "User", accessor: "userName", width: 100 },
      { Header: "Email", accessor: "userEmail", width: 120 },
      { Header: "Campaign", accessor: "campaignTitle", width: 100 },
      { Header: "Brand", accessor: "brandName", width: 80 },
      {
        Header: "Redeems",
        accessor: "totalRedeems",
        width: 50,
        Cell: ({ value }: { value: number }) => (
          <span style={{ fontWeight: "bold", color: "#1a8797" }}>{value}</span>
        ),
      },
      { Header: "Last Redeemed", accessor: "lastRedeemedAt", width: 100 },
      { Header: "Points Req.", accessor: "pointsRequired", width: 50 },
      { Header: "Start", accessor: "startDate", width: 70 },
      { Header: "End", accessor: "endDate", width: 70 },
    ],
    []
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
        <ClipLoader size={25} color="#1a8797" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <Container style={{ fontSize: "11px" }}>
      <HeaderSection>
        <div>
          <Title style={{ fontSize: "14px" }}>User Redeem Leaderboard</Title>
          <UserCount>({leaderboardData.length})</UserCount>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <SearchInput
            type="text"
            placeholder="Search user, campaign or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontSize: "11px", padding: "8px 15px", width: "160px" }}
          />
        </div>
      </HeaderSection>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <TableContainer
          columns={columns}
          data={paginatedData}
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
          rowProps={(row: Row<LeaderboardRow>) => ({
            style: {
              backgroundColor: row.index % 2 === 0 ? "#f9f9f9" : "white",
            },
          })}
          footerText={`Total Campaigns Redeem: ${totalRedeemCount} items `}
        />
      </div>
    </Container>
  );
};

export default UserRedeemDetails;
