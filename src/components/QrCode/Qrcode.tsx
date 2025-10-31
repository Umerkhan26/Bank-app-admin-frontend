import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, ProgressBar } from "react-bootstrap";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Select from "react-select";

import {
  Container,
  HeaderSection,
  Title,
  UserCount,
  SearchInput,
  AddUserButton,
} from "../users/User.Styles";

import { QRCode, QRCodeResponse, Brand } from "../../type";
import {
  bulkUploadQRCodesOptimized,
  listenToUploadProgress,
  createqrcodeData,
  deleteQRCodeData,
  getqrcodeData,
  updateQRCodeData,
} from "../../services/qrcode";
import { getAllBrands } from "../../services/brandService";
import TableContainer from "../TabConatiner/TableConatiner";
import { CellProps, Column } from "react-table";

const Qrcode: React.FC = () => {
  const [qrcode, setQrCodes] = useState<QRCode[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [qrcodeId, setqrcodeId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [formData, setFormData] = useState<QRCode>({
    code: "",
    points: 0,
    isUsed: false,
    brand: "",
    codeUrl: "",
  });

  // ✅ Upload progress states
  const [uploading, setUploading] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState("Starting upload...");
  const [totalProcessed, setTotalProcessed] = useState(0);

  const getAuthToken = (): string => {
    return localStorage.getItem("token") || "";
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [brandData, qrCodeData] = await Promise.all([
          getAllBrands(),
          getqrcodeData(currentPage, pageSize, debouncedSearch),
        ]);

        setBrands(brandData);
        if (qrCodeData?.qrCodes) {
          setQrCodes(qrCodeData.qrCodes);
          setTotalPages(qrCodeData.totalPages);
          setTotalCount(qrCodeData.totalCount);
          setCurrentPage(qrCodeData.currentPage);
        } else {
          toast.error("No QR codes available.");
        }
      } catch (error) {
        toast.error("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize, debouncedSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { code, points, isUsed, brand, codeUrl } = formData;

    if (!code || points === undefined || isUsed === undefined || !brand) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    const payload = {
      code,
      points: typeof points === "string" ? parseInt(points) : points,
      isUsed,
      brand: typeof brand === "object" && brand !== null ? brand._id : brand,
      codeUrl,
    };

    try {
      let res: QRCodeResponse;
      if (isEditing && qrcodeId) {
        res = await updateQRCodeData(payload, qrcodeId);
        toast.success("QR Code updated!");
        setQrCodes((prev) =>
          prev.map((qr) => (qr._id === qrcodeId ? res.updatedQRCode! : qr))
        );
      } else {
        res = await createqrcodeData(payload);
        toast.success("QR Code created!");
        const qrCodeData = await getqrcodeData(
          currentPage,
          pageSize,
          debouncedSearch
        );
        setQrCodes(qrCodeData.qrCodes);
        setTotalPages(qrCodeData.totalPages);
        setTotalCount(qrCodeData.totalCount);
      }

      setFormData({
        code: "",
        points: 0,
        isUsed: false,
        brand: "",
        codeUrl: "",
      });
      setIsEditing(false);
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || "Error submitting QR code.");
    }
    setLoading(false);
  };

  const handleEditQRCode = (qr: QRCode) => {
    setFormData({
      _id: qr._id,
      code: qr.code,
      codeUrl: qr.codeUrl || qr.code,
      points: qr.points,
      isUsed: qr.isUsed,
      brand: typeof qr.brand === "object" ? qr.brand.brandName : qr.brand,
    });
    setqrcodeId(qr._id ?? null);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteqrcode = async (qr: QRCode) => {
    try {
      await deleteQRCodeData(qr._id!);
      toast.success("QR Code deleted.");
      const qrCodeData = await getqrcodeData(
        currentPage,
        pageSize,
        debouncedSearch
      );
      setQrCodes(qrCodeData.qrCodes);
      setTotalPages(qrCodeData.totalPages);
      setTotalCount(qrCodeData.totalCount);
    } catch {
      toast.error("Error deleting QR Code.");
    }
  };

  // ✅ Updated CSV upload handler for optimized API + SSE progress
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = getAuthToken();
    if (!token) {
      toast.error("Authentication token required. Please log in.");
      return;
    }

    setUploading(true);
    setShowProgressModal(true);
    setProgressPercent(0);
    setProgressStatus("Reading CSV file...");
    setTotalProcessed(0);

    const unsubscribeProgress = listenToUploadProgress(
      (data) => {
        const percent = Math.min(100, Math.round(data.percent || 0));
        setProgressPercent(percent);
        setProgressStatus(
          `📊 Progress: ${percent}% | Batch: ${data.batch || 0} | Inserted: ${
            data.insertedCount || 0
          }, Skipped: ${data.skippedCount || 0}`
        );
        setTotalProcessed(data.total || 0);

        if (data.done) {
          unsubscribeProgress();
          setTimeout(() => {
            setShowProgressModal(false);
            setUploading(false);
            toast.success(
              `✅ Upload complete! Inserted: ${data.insertedCount}, Skipped: ${data.skippedCount}`
            );
            refreshQRCodeData();
          }, 800);
        }
      },
      (err) => {
        console.error("Progress stream error:", err);
        unsubscribeProgress();
        setShowProgressModal(false);
        setUploading(false);
        toast.error(
          "Upload progress stream disconnected. Please check the server or network."
        );
      }
    );

    try {
      const result = await bulkUploadQRCodesOptimized(file, token);
      console.log("Upload response:", result);
    } catch (error: any) {
      console.error("Upload error:", error);
      unsubscribeProgress();
      setShowProgressModal(false);
      setUploading(false);
      toast.error(error.message || "Error uploading CSV. Please try again.");
    }
  };
  const refreshQRCodeData = async () => {
    try {
      const qrCodeData = await getqrcodeData(
        currentPage,
        pageSize,
        debouncedSearch
      );
      if (qrCodeData?.qrCodes) {
        setQrCodes(qrCodeData.qrCodes);
        setTotalPages(qrCodeData.totalPages);
        setTotalCount(qrCodeData.totalCount);
      }
    } catch (error) {
      toast.error("Error refreshing QR codes.");
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const columns: Column<QRCode>[] = [
    {
      Header: "ID",
      id: "rowNumber",
      Cell: ({ row }: CellProps<QRCode>) =>
        (currentPage - 1) * pageSize + row.index + 1,
      width: 50,
    },
    {
      Header: "CodeUrl",
      accessor: "codeUrl",
      width: 150,
    },
    {
      Header: "Code",
      accessor: "code",
      width: 150,
    },
    {
      Header: "Points",
      accessor: "points",
      width: 100,
    },
    {
      Header: "Status",
      accessor: "isUsed",
      Cell: ({ value }: CellProps<QRCode, boolean>) =>
        value ? "Used" : "Not Used",
      width: 100,
    },
    {
      Header: "Brand",
      accessor: "brand",
      Cell: ({ value }: CellProps<QRCode, string | Brand>) => {
        if (value === null) return "N/A";
        if (typeof value === "object" && "brandName" in value) {
          return value.brandName;
        }
        const brand = brands.find((b) => b._id === value);
        return brand?.brandName || "N/A";
      },
      width: 150,
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: ({ row }: CellProps<QRCode>) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            className="btn btn-danger"
            onClick={() => handleDeleteqrcode(row.original)}
          >
            Delete
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleEditQRCode(row.original)}
          >
            Edit
          </button>
        </div>
      ),
      width: 150,
    },
  ];

  if (loading && !uploading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 100,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255,255,255,0.6)",
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

  return (
    <Container>
      <HeaderSection>
        <div>
          <Title>All QR Codes</Title>
          <UserCount>({totalCount})</UserCount>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <SearchInput
              type="text"
              placeholder="Search QR Codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AddUserButton
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  code: "",
                  codeUrl: "",
                  points: 0,
                  isUsed: false,
                  brand: "",
                });
                handleShowModal();
              }}
            >
              Add QR Code
            </AddUserButton>
            <label className="btn btn-success" style={{ marginLeft: "10px" }}>
              Import CSV
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleCSVUpload}
                disabled={uploading} // ✅ Disable during upload
              />
            </label>
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "14px",
              margin: "10px 0",
              padding: "5px 10px",
              backgroundColor: "#f5f5f5",
              borderRadius: "5px",
              display: "inline-block",
            }}
          ></div>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "#1a8797" }}>
                {isEditing ? "Edit QR Code" : "Add New QR Code"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter unique code"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Code URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="codeUrl"
                    value={formData.codeUrl}
                    onChange={handleChange}
                    placeholder="Enter QR code URL or image path"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Points</Form.Label>
                  <Form.Control
                    type="number"
                    name="points"
                    value={formData.points}
                    onChange={handleChange}
                    placeholder="Enter points"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Select
                    options={brands.map((brand) => ({
                      value: brand._id,
                      label: brand.brandName,
                    }))}
                    value={
                      formData.brand
                        ? { value: formData.brand, label: formData.brand }
                        : null
                    }
                    onChange={(selected) =>
                      setFormData((prev) => ({
                        ...prev,
                        brand: selected?.label || "",
                      }))
                    }
                    placeholder="Select a brand"
                    isSearchable
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isUsed"
                    label="Used"
                    checked={formData.isUsed}
                    onChange={handleChange}
                  />
                </Form.Group>
                <AddUserButton type="submit">
                  {loading ? (
                    <ClipLoader color="#fff" size={20} />
                  ) : isEditing ? (
                    "Update QR Code"
                  ) : (
                    "Save QR Code"
                  )}
                </AddUserButton>
              </Form>
            </Modal.Body>
          </Modal>

          {/* ✅ Progress Modal for large uploads */}
          <Modal
            show={showProgressModal}
            onHide={() => {}}
            backdrop="static"
            centered
          >
            <Modal.Header closeButton={false}>
              <Modal.Title style={{ color: "#1a8797" }}>
                Upload Progress
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex justify-content-center mb-3">
                {uploading && <ClipLoader size={30} color="#1a8797" />}
              </div>
              <ProgressBar
                animated
                striped
                variant="info"
                now={progressPercent}
                label={`${progressPercent}%`}
              />
              <p
                className="text-center mb-2"
                style={{ fontFamily: "monospace" }}
              >
                {progressStatus}
              </p>

              <p className="text-center mb-2">{progressStatus}</p>
              {totalProcessed > 0 && (
                <p className="text-center text-muted small">
                  Processing {totalProcessed.toLocaleString()} QR codes...
                </p>
              )}
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowProgressModal(false);
                    setUploading(false);
                  }}
                  disabled={!uploading}
                >
                  Cancel (data may be partial)
                </button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </HeaderSection>

      <TableContainer
        columns={columns}
        data={qrcode}
        isPagination
        iscustomPageSize
        className="table-responsive"
        pagination={{
          currentPage,
          totalPages,
          totalItems: totalCount,
          pageSize,
        }}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </Container>
  );
};

export default Qrcode;
