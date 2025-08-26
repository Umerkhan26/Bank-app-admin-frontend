// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Modal, Form } from "react-bootstrap";
// import { toast } from "react-toastify";
// import { ClipLoader } from "react-spinners";
// import Select from "react-select";

// import {
//   Container,
//   HeaderSection,
//   Title,
//   UserCount,
//   SearchInput,
//   AddUserButton,
// } from "../users/User.Styles";

// import { QRCode, QRCodeResponse, Brand } from "../../type";
// import {
//   bulkUploadQRCodes,
//   createqrcodeData,
//   deleteQRCodeData,
//   getqrcodeData,
//   updateQRCodeData,
// } from "../../services/qrcode";
// import { getAllBrands } from "../../services/brandService";
// import TableContainer from "../TabConatiner/TableConatiner";
// import { CellProps, Column } from "react-table";

// const Qrcode: React.FC = () => {
//   const [qrcode, setQrCodes] = useState<QRCode[]>([]);
//   const [brands, setBrands] = useState<Brand[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [qrcodeId, setqrcodeId] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   const [searchTerm, setSearchTerm] = useState("");

//   const [formData, setFormData] = useState<QRCode>({
//     code: "",
//     points: 0,
//     isUsed: false,
//     brand: "",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [brandData, qrCodeData] = await Promise.all([
//           getAllBrands(),
//           getqrcodeData(),
//         ]);

//         console.log("all qrcode", qrCodeData);

//         setBrands(brandData);
//         if (qrCodeData?.qrCodes) {
//           setQrCodes(qrCodeData.qrCodes);
//         } else {
//           toast.error("No QR codes available.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleBrandChange = (
//     selected: { value: string; label: string } | null
//   ) => {
//     setFormData((prev) => ({ ...prev, brand: selected?.value || "" }));
//   };

//   const handleCloseModal = () => setShowModal(false);
//   const handleShowModal = () => setShowModal(true);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const { code, points, isUsed, brand } = formData;

//     if (!code || points === undefined || isUsed === undefined || !brand) {
//       toast.error("All fields are required.");
//       setLoading(false);
//       return;
//     }

//     const payload = {
//       code,
//       points: typeof points === "string" ? parseInt(points) : points,
//       isUsed,
//       brand: typeof brand === "object" && brand !== null ? brand._id : brand,
//     };

//     try {
//       let res: QRCodeResponse;
//       if (isEditing && qrcodeId) {
//         res = await updateQRCodeData(payload, qrcodeId);
//         toast.success("QR Code updated!");
//         setQrCodes((prev) =>
//           prev.map((qr) => (qr._id === qrcodeId ? res.qrCode : qr))
//         );
//       } else {
//         res = await createqrcodeData(payload);
//         toast.success("QR Code created!");
//         setQrCodes((prev) => [...prev, res.qrCode]);
//       }

//       setFormData({ code: "", points: 0, isUsed: false, brand: "" });
//       setIsEditing(false);
//       handleCloseModal();
//     } catch (error: any) {
//       toast.error(error.message || "Error submitting QR code.");
//     }
//     setLoading(false);
//   };

//   const handleEditQRCode = (qr: QRCode) => {
//     setFormData({
//       _id: qr._id,
//       code: qr.code,
//       points: qr.points,
//       isUsed: qr.isUsed,
//       brand: typeof qr.brand === "object" ? qr.brand._id : qr.brand,
//     });
//     setqrcodeId(qr._id ?? null);
//     setIsEditing(true);
//     setShowModal(true);
//   };

//   const handleDeleteqrcode = async (qr: QRCode) => {
//     try {
//       await deleteQRCodeData(qr._id!);
//       toast.success("QR Code deleted.");
//       setQrCodes((prev) => prev.filter((item) => item._id !== qr._id));
//     } catch {
//       toast.error("Error deleting QR Code.");
//     }
//   };

//   // ✅ CSV Import
//   // ✅ CSV Import using bulkUploadQRCodes API
//   const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setLoading(true);
//     try {
//       const result = await bulkUploadQRCodes(file); // call your API function

//       // Check backend response
//       if (result && result.message) {
//         toast.success(result.message); // show "X QR codes inserted successfully"
//       } else {
//         toast.error("No QR codes inserted.");
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Error uploading CSV.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredQRCodes = qrcode.filter((qr) =>
//     qr.code.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const columns: Column<QRCode>[] = [
//     {
//       Header: "ID",
//       id: "rowNumber", // 👈 give it a unique id
//       Cell: ({ row }: CellProps<QRCode>) => row.index + 1,
//       width: 50,
//     },
//     {
//       Header: "Code",
//       accessor: "code",
//       width: 150,
//     },
//     {
//       Header: "Points",
//       accessor: "points",
//       width: 100,
//     },
//     {
//       Header: "Status",
//       accessor: "isUsed",
//       Cell: ({ value }: CellProps<QRCode, boolean>) =>
//         value ? "Used" : "Not Used",
//       width: 100,
//     },
//     {
//       Header: "Brand",
//       accessor: "brand",
//       Cell: ({ value }: CellProps<QRCode, string | Brand>) => {
//         if (value === null) return "N/A";
//         if (typeof value === "object" && "brandName" in value) {
//           return value.brandName;
//         }
//         const brand = brands.find((b) => b._id === value);
//         return brand?.brandName || "N/A";
//       },
//       width: 150,
//     },
//     {
//       Header: "Actions",
//       id: "actions", // 👈 needs an id because no accessor
//       Cell: ({ row }: CellProps<QRCode>) => (
//         <div style={{ display: "flex", gap: "5px" }}>
//           <button
//             className="btn btn-danger"
//             onClick={() => handleDeleteqrcode(row.original)}
//           >
//             Delete
//           </button>
//           <button
//             className="btn btn-secondary"
//             onClick={() => handleEditQRCode(row.original)}
//           >
//             Edit
//           </button>
//         </div>
//       ),
//       width: 150,
//     },
//   ];

//   if (loading) {
//     return (
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100vw",
//           height: "100vh",
//           backgroundColor: "rgba(255,255,255,0.6)",
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
//   return (
//     <Container>
//       <HeaderSection>
//         <div>
//           <Title>All QR Codes</Title>
//           <UserCount>({qrcode.length})</UserCount>
//         </div>
//         <div>
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <SearchInput
//               type="text"
//               placeholder="Search QR Codes..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <AddUserButton
//               onClick={() => {
//                 setIsEditing(false);
//                 setFormData({ code: "", points: 0, isUsed: false, brand: "" });
//                 handleShowModal();
//               }}
//             >
//               Add QR Code
//             </AddUserButton>

//             {/* ✅ CSV Import Button */}
//             <label className="btn btn-success" style={{ marginLeft: "10px" }}>
//               Import CSV
//               <input
//                 type="file"
//                 accept=".csv"
//                 hidden
//                 onChange={handleCSVUpload}
//               />
//             </label>
//           </div>
//           <div
//             style={{
//               fontFamily: "monospace",
//               fontSize: "14px",
//               margin: "10px 0",
//               padding: "5px 10px",
//               backgroundColor: "#f5f5f5",
//               borderRadius: "5px",
//               display: "inline-block",
//             }}
//           >
//             Total QR Codes: {qrcode.length} | Used:{" "}
//             {qrcode.filter((q) => q.isUsed).length} | Unused:{" "}
//             {qrcode.filter((q) => !q.isUsed).length}
//           </div>
//           {/* Existing Modal */}
//           <Modal show={showModal} onHide={handleCloseModal}>
//             <Modal.Header closeButton>
//               <Modal.Title style={{ color: "#1a8797" }}>
//                 {isEditing ? "Edit QR Code" : "Add New QR Code"}
//               </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <Form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Code</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="code"
//                     value={formData.code}
//                     onChange={handleChange}
//                     placeholder="Enter unique code"
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Points</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="points"
//                     value={formData.points}
//                     onChange={handleChange}
//                     placeholder="Enter points"
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Brand</Form.Label>
//                   <Select
//                     options={brands.map((brand) => ({
//                       value: brand._id,
//                       label: brand.brandName,
//                     }))}
//                     value={brands
//                       .map((b) => ({
//                         value: b._id,
//                         label: b.brandName,
//                       }))
//                       .find((opt) => opt.value === formData.brand)}
//                     onChange={handleBrandChange}
//                     placeholder="Select a brand"
//                     isSearchable
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Check
//                     type="checkbox"
//                     name="isUsed"
//                     label="Used"
//                     checked={formData.isUsed}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>

//                 <AddUserButton type="submit">
//                   {loading ? (
//                     <ClipLoader color="#fff" size={20} />
//                   ) : isEditing ? (
//                     "Update QR Code"
//                   ) : (
//                     "Save QR Code"
//                   )}
//                 </AddUserButton>
//               </Form>
//             </Modal.Body>
//           </Modal>
//         </div>
//       </HeaderSection>

//       <TableContainer
//         columns={columns}
//         data={filteredQRCodes} // now only matching QR codes appear
//         // data={qrcode}
//         isPagination
//         iscustomPageSize
//         className="table-responsive"
//       />
//     </Container>
//   );
// };

// export default Qrcode;

// components/Qrcode.tsx
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
  bulkUploadQRCodes,
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
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [usedCount, setUsedCount] = useState(0);
  const [unusedCount, setUnusedCount] = useState(0);

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
          getqrcodeData(currentPage, pageSize),
        ]);

        console.log("all qrcode", qrCodeData);

        setBrands(brandData);
        if (qrCodeData?.qrCodes) {
          setQrCodes(qrCodeData.qrCodes);
          setTotalPages(qrCodeData.totalPages);
          setTotalCount(qrCodeData.totalCount);
          setUsedCount(qrCodeData.usedCount);
          setUnusedCount(qrCodeData.unusedCount);
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
  }, [currentPage, pageSize]);

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

    const payload = {
      code,
      points: typeof points === "string" ? parseInt(points) : points,
      isUsed,
      brand: typeof brand === "object" && brand !== null ? brand._id : brand,
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
        const qrCodeData = await getqrcodeData(currentPage, pageSize);
        setQrCodes(qrCodeData.qrCodes);
        setTotalPages(qrCodeData.totalPages);
        setTotalCount(qrCodeData.totalCount);
        setUsedCount(qrCodeData.usedCount);
        setUnusedCount(qrCodeData.unusedCount);
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
      // Refresh data to reflect deletion
      const qrCodeData = await getqrcodeData(currentPage, pageSize);
      setQrCodes(qrCodeData.qrCodes);
      setTotalPages(qrCodeData.totalPages);
      setTotalCount(qrCodeData.totalCount);
      setUsedCount(qrCodeData.usedCount);
      setUnusedCount(qrCodeData.unusedCount);
    } catch {
      toast.error("Error deleting QR Code.");
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const result = await bulkUploadQRCodes(file);
      if (result && result.message) {
        toast.success(result.message);
        // Refresh data to reflect bulk upload
        const qrCodeData = await getqrcodeData(currentPage, pageSize);
        setQrCodes(qrCodeData.qrCodes);
        setTotalPages(qrCodeData.totalPages);
        setTotalCount(qrCodeData.totalCount);
        setUsedCount(qrCodeData.usedCount);
        setUnusedCount(qrCodeData.unusedCount);
      } else {
        toast.error("No QR codes inserted.");
      }
    } catch (error: any) {
      toast.error(error.message || "Error uploading CSV.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const filteredQRCodes = qrcode.filter((qr) =>
    qr.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<QRCode>[] = [
    {
      Header: "ID",
      id: "rowNumber",
      Cell: ({ row }: CellProps<QRCode>) =>
        (currentPage - 1) * pageSize + row.index + 1, // Adjust row number for pagination
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

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
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
                setFormData({ code: "", points: 0, isUsed: false, brand: "" });
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
          >
            Total QR Codes: {totalCount} | Used: {usedCount} | Unused:{" "}
            {unusedCount}
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
        data={filteredQRCodes}
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
