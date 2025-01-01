import React from "react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

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
} from "../users/User.Styles";
// import Loader from "../../components/Loader/Loader";
import { QRCode, QRCodeResponse } from "../../type";
import {
  createqrcodeData,
  deleteQRCodeData,
  getqrcodeData,
  updateQRCodeData,
} from "../../services/qrcode";

type qrcodeData = {
  _id?: string;
  code: string;
  points: number;
  isUsed: boolean;
};

const Qrcode: React.FC = () => {
  const [qrcode, setQrCodes] = useState<QRCode[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [qrcodeId, setqrcodeId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<qrcodeData>({
    code: "",
    points: 0,
    isUsed: false,
  });

  //   useEffect(() => {
  //     const fetchqrcodes = async () => {
  //       try {
  //         const data = await getqrcodeData();
  //         console.log("Full API response:", data);
  //         if (data && data.qrCodes) {
  //           console.log("Fetched qrcodes:", data.qrCodes);
  //           setQrCodes(data.qrCodes);
  //         } else {
  //           toast.error("No QR codes available.");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching qrcodes:", error);
  //         toast.error("Error fetching qrcodes. Please try again later.");
  //       }
  //     };

  //     fetchqrcodes();
  //   }, []);

  useEffect(() => {
    const fetchqrcodes = async () => {
      try {
        const data = await getqrcodeData();
        console.log("Full API response:", data);
        if (data && data.qrCodes) {
          console.log("Fetched qrcodes:", data.qrCodes);
          setQrCodes(data.qrCodes);
        } else {
          toast.error("No QR codes available.");
        }
      } catch (error) {
        console.error("Error fetching qrcodes:", error);
        toast.error("Error fetching qrcodes. Please try again later.");
      }
    };

    fetchqrcodes();
  }, []);

  if (error) return <div>Error loading users: {error.message}</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     const { code, points, isUsed, _id } = formData;
  //     if (!code || points === undefined || isUsed === undefined) {
  //       toast.error("All fields are required!");
  //       return;
  //     }

  //     const pointsValue =
  //       typeof points === "string" ? parseInt(points, 10) : points;

  //     if (isNaN(pointsValue)) {
  //       toast.error("Points must be a valid number");
  //       return;
  //     }

  //     const qrcodeData: QRCode = {
  //       _id: _id || Math.random().toString(36).substr(2, 9),
  //       code,
  //       points: pointsValue,
  //       isUsed,
  //     };

  //     try {
  //       let qrcodeResponse: QRCodeResponse;

  //       if (isEditing && qrcodeId) {
  //         // Update QR Code
  //         qrcodeResponse = await updateQRCodeData(qrcodeData, qrcodeId);
  //         toast.success("QR Code updated successfully!");

  //         if (qrcodeResponse?.qrCode) {
  //           // Update the state directly
  //           setQrCodes((prevQrCodes) =>
  //             prevQrCodes.map((qr) =>
  //               qr._id === qrcodeId ? { ...qr, ...qrcodeResponse.qrCode } : qr
  //             )
  //           );
  //         }
  //       } else {
  //         // Create new QR Code
  //         qrcodeResponse = await createqrcodeData(qrcodeData);
  //         toast.success("QR Code created successfully!");

  //         if (qrcodeResponse?.qrCode) {
  //           setQrCodes((prevQrCodes) => [...prevQrCodes, qrcodeResponse.qrCode]);
  //         }
  //       }

  //       // Reset the form data
  //       setFormData({
  //         code: "",
  //         points: 0,
  //         isUsed: false,
  //         _id: "",
  //       });

  //       setIsEditing(false);
  //       handleCloseModal();
  //     } catch (error) {
  //       console.error("Error submitting QR code:", error);
  //       toast.error("Error submitting the QR code. Please try again later.");
  //     }
  //   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { code, points, isUsed, _id } = formData;
    if (!code || points === undefined || isUsed === undefined) {
      toast.error("All fields are required!");
      return;
    }

    const pointsValue =
      typeof points === "string" ? parseInt(points, 10) : points;

    if (isNaN(pointsValue)) {
      toast.error("Points must be a valid number");
      return;
    }

    const qrcodeData: QRCode = {
      _id: _id || Math.random().toString(36).substr(2, 9),
      code,
      points: pointsValue,
      isUsed,
    };

    try {
      let qrcodeResponse: QRCodeResponse;

      if (isEditing && qrcodeId) {
        // Update QR Code
        qrcodeResponse = await updateQRCodeData(qrcodeData, qrcodeId);
        toast.success("QR Code updated successfully!");

        if (qrcodeResponse?.qrCode) {
          setQrCodes((prevQrCodes) =>
            prevQrCodes.map((qr) =>
              qr._id === qrcodeId ? { ...qr, ...qrcodeResponse.qrCode } : qr
            )
          );
        }
      } else {
        // Create new QR Code
        qrcodeResponse = await createqrcodeData(qrcodeData);
        toast.success("QR Code created successfully!");

        if (qrcodeResponse?.qrCode) {
          setQrCodes((prevQrCodes) => [...prevQrCodes, qrcodeResponse.qrCode]);
        }
      }

      // Optional: Refetch to ensure consistency
      const updatedData = await getqrcodeData();
      if (updatedData?.qrCodes) {
        setQrCodes(updatedData.qrCodes);
      }

      // Reset the form data
      setFormData({
        code: "",
        points: 0,
        isUsed: false,
        _id: "",
      });

      setIsEditing(false);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting QR code:", error);
      toast.error("Error submitting the QR code. Please try again later.");
    }
  };

  const handleDeleteqrcode = async (qrcode: { _id: string }) => {
    try {
      const qrcodeId = qrcode._id;
      console.log("Deleting qrcode with ID:", qrcodeId);

      if (!qrcodeId) {
        console.error("qrcode ID is missing");
        return;
      }

      const deletedqrcode = await deleteQRCodeData(qrcodeId);
      console.log("Deleted qrcode:", deletedqrcode);

      toast.success("qrcode deleted successfully!");

      setQrCodes((prevqrcodes) =>
        prevqrcodes.filter((qrcode) => qrcode._id !== qrcodeId)
      );
    } catch (error) {
      console.error("Error deleting qrcode:", error);
      toast.error("Error deleting qrcode!");
    }
  };

  const handleEditQRCode = (qrcode) => {
    setFormData({
      code: qrcode.code,
      points: qrcode.points,
      isUsed: qrcode.isUsed,
      _id: qrcode._id,
    });
    setqrcodeId(qrcode._id);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <Container>
      {/* {loading && <Loader />} */}
      <ToastContainer />
      <HeaderSection>
        <div>
          <Title>All Qrcodes</Title>
          {/* <UserCount>({qrcode.length})</UserCount>{" "} */}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchInput type="text" placeholder="Search Qrcodes..." />
            <AddUserButton
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  code: "",
                  points: 0,
                  isUsed: false,
                });
                handleShowModal();
              }}
            >
              Add Qrcode
            </AddUserButton>
          </div>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "#1a8797" }}>
                {isEditing ? "Edit qrcode" : "Add New qrcode"}
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
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isUsed"
                    checked={formData.isUsed}
                    onChange={handleChange}
                    label="Used"
                  />
                </Form.Group>

                <AddUserButton variant="primary" type="submit">
                  {isEditing ? "Update QR code" : "Save QR code"}
                </AddUserButton>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </HeaderSection>

      <Table>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Code</TableHeader>
            <TableHeader>Points</TableHeader>
            <TableHeader>IsUsed</TableHeader>
            <TableHeader>Action</TableHeader>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(qrcode) &&
            qrcode.map((qrcode, index) => (
              <TableRow key={qrcode._id}>
                <TableData>{index + 1}</TableData>
                <TableData>{qrcode.code}</TableData>
                <TableData>{qrcode.points}</TableData>
                <TableData>{qrcode.isUsed ? "Used" : "Not Used"}</TableData>

                <TableData>
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() => handleDeleteqrcode(qrcode)}
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
                    <button
                      onClick={() => handleEditQRCode(qrcode)}
                      className="btn btn-secondary ms-2"
                      style={{
                        padding: "7px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Update
                    </button>
                  </div>
                </TableData>
              </TableRow>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Qrcode;
