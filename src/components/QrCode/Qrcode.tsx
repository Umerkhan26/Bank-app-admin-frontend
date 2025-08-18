import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form } from "react-bootstrap";
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
  createqrcodeData,
  deleteQRCodeData,
  getqrcodeData,
  updateQRCodeData,
} from "../../services/qrcode";
import { getAllBrands } from "../../services/brandService";
import TableContainer from "../TabConatiner/TableConatiner";

const Qrcode: React.FC = () => {
  const [qrcode, setQrCodes] = useState<QRCode[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [qrcodeId, setqrcodeId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState<QRCode>({
    code: "",
    points: 0,
    isUsed: false,
    brand: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [brandData, qrCodeData] = await Promise.all([
          getAllBrands(),
          getqrcodeData(),
        ]);

        setBrands(brandData);
        if (qrCodeData?.qrCodes) {
          setQrCodes(qrCodeData.qrCodes);
        } else {
          toast.error("No QR codes available.");
        }
      } catch (err) {
        setError(err as Error);
        toast.error("Failed to load QR Codes or Brands.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return <div>Error loading data: {error.message}</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBrandChange = (
    selected: { value: string; label: string } | null
  ) => {
    setFormData((prev) => ({ ...prev, brand: selected?.value || "" }));
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { code, points, isUsed, brand } = formData;

    if (!code || points === undefined || isUsed === undefined || !brand) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    const payload: QRCode = {
      code,
      points: typeof points === "string" ? parseInt(points) : points,
      isUsed,
      brand,
    };

    try {
      let res: QRCodeResponse;
      if (isEditing && qrcodeId) {
        res = await updateQRCodeData(payload, qrcodeId);
        toast.success("QR Code updated!");
        setQrCodes((prev) =>
          prev.map((qr) => (qr._id === qrcodeId ? res.qrCode : qr))
        );
      } else {
        res = await createqrcodeData(payload);
        toast.success("QR Code created!");
        setQrCodes((prev) => [...prev, res.qrCode]);
      }

      setFormData({ code: "", points: 0, isUsed: false, brand: "" });
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
      points: qr.points,
      isUsed: qr.isUsed,
      brand: typeof qr.brand === "object" ? qr.brand._id : qr.brand,
    });
    setqrcodeId(qr._id ?? null);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteqrcode = async (qr: QRCode) => {
    try {
      await deleteQRCodeData(qr._id!);
      toast.success("QR Code deleted.");
      setQrCodes((prev) => prev.filter((item) => item._id !== qr._id));
    } catch {
      toast.error("Error deleting QR Code.");
    }
  };

  const columns = [
    {
      Header: "ID",
      accessor: (_: any, index: number) => index + 1,
      disableFilters: true,
      width: 50,
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
      Cell: ({ value }: { value: boolean }) => (value ? "Used" : "Not Used"),
      width: 100,
    },
    {
      Header: "Brand",
      accessor: "brand",
      Cell: ({ value }: { value: string | Brand | null }) => {
        if (value === null) return "N/A";

        // If it's a populated Brand object
        if (typeof value === "object" && "brandName" in value) {
          return value.brandName;
        }

        // If it's just an ID string, find in brands list
        const brand = brands.find((b) => b._id === value);
        return brand?.brandName || "N/A";
      },
      width: 150,
    },
    {
      Header: "Actions",
      accessor: "_id",
      Cell: ({ row }: { row: { original: QRCode } }) => (
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

  return (
    <Container>
      <HeaderSection>
        <div>
          <Title>All QR Codes</Title>
          <UserCount>({qrcode.length})</UserCount>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchInput type="text" placeholder="Search QR Codes..." />
            <AddUserButton
              onClick={() => {
                setIsEditing(false);
                setFormData({ code: "", points: 0, isUsed: false, brand: "" });
                handleShowModal();
              }}
            >
              Add QR Code
            </AddUserButton>
          </div>

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
                    value={brands
                      .map((b) => ({
                        value: b._id,
                        label: b.brandName,
                      }))
                      .find((opt) => opt.value === formData.brand)}
                    onChange={handleBrandChange}
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
        </div>
      </HeaderSection>

      <TableContainer
        columns={columns}
        data={qrcode}
        isPagination
        iscustomPageSize
        className="table-responsive"
      />
    </Container>
  );
};

export default Qrcode;
