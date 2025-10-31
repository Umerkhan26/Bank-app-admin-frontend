import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../TabConatiner/TableConatiner";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  Container,
  HeaderSection,
  Title,
  PremiumCount,
  SearchInput,
  AddUserButton,
} from "./BankPremiumRedeem.Styles";
import {
  exportBankPremiumsCSV,
  getBankPremiumsWithStats,
  updateRedemptionStatus,
} from "../../services/bankPremiumService";
import { Column } from "react-table";

interface BankPremiumRow {
  id: string;
  title: string;
  code: string;
  status: string;
  redeemedAt: string;
  bankPremiumId: string;
  userName: string;
  userEmail: string;
  userAddress: string;
  userParish: string;
  totalRedemptions: number;
}
type RedemptionStatus = "pending" | "delivered";

const BankPremiumRedeem: React.FC = () => {
  const [bankPremiums, setBankPremiums] = useState<BankPremiumRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 👇 renamed `currentPage` from backend response to `serverCurrentPage`
        const {
          data,
          totalCount,
          totalPages,
          currentPage: serverCurrentPage,
        } = await getBankPremiumsWithStats(currentPage, pageSize);

        const rows: BankPremiumRow[] = data.map((p: any) => ({
          id: p.code,
          title: p.title,
          code: p.code,
          status: p.status,
          redeemedAt: new Date(p.redeemedAt).toLocaleString(),
          bankPremiumId: p.bankPremiumId,
          userName: p.user?.name || "-",
          userEmail: p.user?.email || "-",
          userAddress: p.user?.address || "-",
          userParish: p.user?.parish || "-",
          totalRedemptions: p.stats?.totalRedemptions || 0,
        }));

        setBankPremiums(rows);
        setTotalPages(totalPages);
        setTotalItems(totalCount);

        // optional: sync current page with backend if needed
        if (serverCurrentPage !== currentPage) {
          setCurrentPage(serverCurrentPage);
        }
      } catch (err: any) {
        setError(err);
        toast.error(err.message || "Failed to fetch bank premiums.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, pageSize]);

  const columns: Column<BankPremiumRow>[] = [
    {
      Header: "#",
      accessor: (_row: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
      width: 30,
    },
    { Header: "Title", accessor: "title", width: 150 },
    { Header: "Code", accessor: "code", width: 90 },
    { Header: "Redeemed At", accessor: "redeemedAt", width: 150 },
    { Header: "User Name", accessor: "userName", width: 70 },
    { Header: "Email", accessor: "userEmail", width: 120 },
    // { Header: "Total Redemptions", accessor: "totalRedemptions", width: 80 },
    { Header: "Parish", accessor: "userParish", width: 100 },
    {
      Header: "Status",
      accessor: "status",
      width: 100,
      Cell: ({ row }: any) => {
        const currentStatus = row.original.status;
        return (
          <select
            value={currentStatus}
            onChange={async (e) => {
              const newStatus = e.target.value as RedemptionStatus;

              if (newStatus !== "pending" && newStatus !== "delivered") {
                toast.error("Invalid status selected");
                return;
              }
              try {
                await updateRedemptionStatus(row.original.code, newStatus);
                setBankPremiums((prev) =>
                  prev.map((item) =>
                    item.code === row.original.code
                      ? { ...item, status: newStatus }
                      : item
                  )
                );
                toast.success(`Status updated to "${newStatus}"`);
              } catch (err: any) {
                toast.error(err.message || "Failed to update status");
              }
            }}
            style={{ fontSize: "11px", padding: "3px" }}
          >
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
          </select>
        );
      },
    },
  ];

  const handleExport = async () => {
    try {
      await exportBankPremiumsCSV();
      toast.success("CSV downloaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to export CSV");
    }
  };

  if (loading)
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 100,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255,255,255,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <ClipLoader size={40} color="#1a8797" />
      </div>
    );

  if (error)
    return (
      <Container>
        <div
          style={{
            color: "red",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#ffe6e6",
            borderRadius: "4px",
            border: "1px solid #ffcccc",
          }}
        >
          Error loading data: {error.message}
        </div>
      </Container>
    );

  return (
    <Container style={{ fontSize: "11px" }}>
      <HeaderSection>
        <div>
          <Title style={{ fontSize: "14px" }}>Bank Premium Redemptions</Title>
          <PremiumCount>({bankPremiums.length} premiums)</PremiumCount>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SearchInput
            type="text"
            placeholder="Search by title/code/user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontSize: "11px", padding: "8px 15px", width: "180px" }}
          />
          <AddUserButton onClick={handleExport}>Download CSV</AddUserButton>
        </div>
      </HeaderSection>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <TableContainer
          columns={columns}
          data={bankPremiums}
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

export default BankPremiumRedeem;
