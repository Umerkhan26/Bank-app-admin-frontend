// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Modal, Form, Tabs, Tab } from "react-bootstrap";
// import { toast } from "react-toastify";
// import Select from "react-select";
// import Papa from "papaparse"; // <-- CSV parsing
// import {
//   Container,
//   HeaderSection,
//   Title,
//   UserCount,
//   SearchInput,
//   AddUserButton,
// } from "../users/User.Styles";
// import { StoreApiResponse, Stores } from "../../type";
// import {
//   createStoreData,
//   deleteStoreData,
//   getStoresData,
//   updateStoreData,
// } from "../../services/store";
// import { getAllBrands } from "../../services/brandService";
// import TableContainer from "../TabConatiner/TableConatiner";
// import { Column } from "react-table";
// import { ClipLoader } from "react-spinners";

// interface Brand {
//   _id: string;
//   brandName: string;
// }

// type storeData = {
//   storeName: string;
//   description: string;
//   latitude: number | null;
//   longitude: number | null;
//   brand: string;
// };

// const Store: React.FC = () => {
//   const [store, setStores] = useState<Stores[]>([]);
//   const [brands, setBrands] = useState<Brand[]>([]);
//   const [error, setError] = useState<null | Error>(null);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [storeId, setStoreId] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   const [formData, setFormData] = useState<storeData>({
//     storeName: "",
//     description: "",
//     latitude: null,
//     longitude: null,
//     brand: "",
//   });

//   const [activeTab, setActiveTab] = useState("manual");
//   const [csvFile, setCsvFile] = useState<File | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [storesData, brandsData] = await Promise.all([
//           getStoresData(),
//           getAllBrands(),
//         ]);
//         setStores(storesData.stores);
//         setBrands(brandsData);
//       } catch (error) {
//         setError(
//           error instanceof Error ? error : new Error("Failed to fetch data")
//         );
//         toast.error("Error fetching data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleBrandChange = (
//     selectedOption: { value: string; label: string } | null
//   ) => {
//     setFormData((prev) => ({ ...prev, brand: selectedOption?.value || "" }));
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleShowModal = () => {
//     setShowModal(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);

//     const { storeName, description, longitude, latitude, brand } = formData;
//     if (!storeName || !description || !longitude || !latitude || !brand) {
//       toast.error("All fields are required!");
//       setIsSaving(false);
//       return;
//     }

//     const storeData = {
//       storeName,
//       description,
//       longitude: longitude.toString(),
//       latitude: latitude.toString(),
//       brand,
//     };

//     try {
//       let storeResponse: StoreApiResponse;

//       if (isEditing && storeId) {
//         storeResponse = await updateStoreData(storeData, storeId);
//         toast.success("Store updated successfully!");
//         setStores((prevStores) =>
//           prevStores.map((store) =>
//             store._id === storeId ? { ...storeResponse.store } : store
//           )
//         );
//       } else {
//         storeResponse = await createStoreData(storeData);
//         toast.success("Store created successfully!");
//         setStores((prevStores) => [...prevStores, storeResponse.store]);
//       }

//       setFormData({
//         storeName: "",
//         description: "",
//         longitude: null,
//         latitude: null,
//         brand: "",
//       });

//       setIsEditing(false);
//       handleCloseModal();
//     } catch (error) {
//       toast.error("Error submitting the store. Please try again later.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // --- CSV Upload Handler ---
//   const handleCSVUpload = () => {
//     if (!csvFile) {
//       toast.error("Please select a CSV file first!");
//       return;
//     }

//     Papa.parse(csvFile, {
//       header: true,
//       skipEmptyLines: true,
//       complete: async (results) => {
//         const rows: any[] = results.data;
//         if (!rows.length) {
//           toast.error("CSV file is empty!");
//           return;
//         }

//         setIsSaving(true);
//         try {
//           for (const row of rows) {
//             if (
//               !row.storeName ||
//               !row.description ||
//               !row.latitude ||
//               !row.longitude ||
//               !row.brand
//             ) {
//               continue; // skip invalid row
//             }

//             const storeData = {
//               storeName: row.storeName,
//               description: row.description,
//               latitude: row.latitude,
//               longitude: row.longitude,
//               brand: row.brand,
//             };

//             const storeResponse = await createStoreData(storeData);
//             setStores((prev) => [...prev, storeResponse.store]);
//           }
//           toast.success("CSV imported successfully!");
//           handleCloseModal();
//         } catch (error) {
//           toast.error("Error importing CSV data!");
//         } finally {
//           setIsSaving(false);
//         }
//       },
//     });
//   };

//   const handleDeleteStore = async (store: { _id: string }) => {
//     if (!window.confirm("Are you sure you want to delete this store?")) return;

//     try {
//       setIsDeleting(true);
//       setDeletingId(store._id);
//       await deleteStoreData(store._id);
//       toast.success("Store deleted successfully!");
//       setStores((prevStores) => prevStores.filter((s) => s._id !== store._id));
//     } catch (error) {
//       toast.error("Error deleting store!");
//     } finally {
//       setIsDeleting(false);
//       setDeletingId(null);
//     }
//   };

//   const handleEditStore = (store: Stores) => {
//     setFormData({
//       storeName: store.storeName,
//       description: store.description,
//       longitude: store.location?.longitude || null,
//       latitude: store.location?.latitude || null,
//       brand:
//         typeof store.brand === "object" ? store.brand._id : store.brand || "",
//     });
//     setStoreId(store._id);
//     setIsEditing(true);
//     setShowModal(true);
//   };

//   const columns: Column<Stores>[] = [
//     {
//       Header: "ID",
//       accessor: (_row, index) => index + 1,
//       width: 50,
//     },
//     {
//       Header: "Name",
//       accessor: "storeName",
//       width: 150,
//     },
//     {
//       Header: "Description",
//       accessor: "description",
//       width: 150,
//     },
//     {
//       Header: "Latitude",
//       accessor: (row) =>
//         row.location?.latitude !== undefined ? row.location.latitude : "N/A",
//       width: 100,
//     },
//     {
//       Header: "Longitude",
//       accessor: (row) =>
//         row.location?.longitude !== undefined ? row.location.longitude : "N/A",
//       width: 100,
//     },
//     {
//       Header: "Brand",
//       accessor: (row) =>
//         typeof row.brand === "object" && row.brand !== null
//           ? row.brand
//           : row.brand ?? "N/A",
//       width: 150,
//     },
//     {
//       Header: "Actions",
//       accessor: "_id",
//       width: 150,
//       Cell: ({ row }) => (
//         <div style={{ display: "flex", gap: "5px" }}>
//           <button
//             onClick={() => handleDeleteStore(row.original)}
//             className="btn btn-danger"
//             disabled={isDeleting}
//           >
//             {isDeleting && deletingId === row.original._id ? (
//               <ClipLoader size={15} color="#fff" />
//             ) : (
//               "Delete"
//             )}
//           </button>
//           <button
//             onClick={() => handleEditStore(row.original)}
//             className="btn btn-secondary"
//             disabled={isDeleting || isSaving}
//           >
//             Edit
//           </button>
//         </div>
//       ),
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

//   return (
//     <div style={{ position: "relative" }}>
//       {(isSaving || isDeleting) && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(255, 255, 255, 0.6)",
//             zIndex: 9999,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <ClipLoader size={40} color="#1a8797" />
//         </div>
//       )}

//       <Container>
//         <HeaderSection>
//           <div>
//             <Title>All Stores</Title>
//             <UserCount>({store.length})</UserCount>
//           </div>
//           <div>
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <SearchInput type="text" placeholder="Search stores..." />
//               <AddUserButton
//                 onClick={() => {
//                   setIsEditing(false);
//                   setFormData({
//                     storeName: "",
//                     description: "",
//                     latitude: null,
//                     longitude: null,
//                     brand: "",
//                   });
//                   handleShowModal();
//                 }}
//                 disabled={isSaving || isDeleting}
//               >
//                 Add Store
//               </AddUserButton>
//             </div>

//             <Modal show={showModal} onHide={handleCloseModal}>
//               <Modal.Header closeButton>
//                 <Modal.Title style={{ color: "#1a8797" }}>
//                   {isEditing ? "Edit Store" : "Add New Store"}
//                 </Modal.Title>
//               </Modal.Header>

//               <Modal.Body>
//                 <Tabs
//                   activeKey={activeTab}
//                   onSelect={(k) => setActiveTab(k || "manual")}
//                 >
//                   {/* Manual Entry Form */}
//                   <Tab eventKey="manual" title="Manual Entry">
//                     <Form onSubmit={handleSubmit}>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Name</Form.Label>
//                         <Form.Control
//                           type="text"
//                           name="storeName"
//                           value={formData.storeName}
//                           onChange={handleChange}
//                           placeholder="Enter store name"
//                           disabled={isSaving}
//                         />
//                       </Form.Group>

//                       <Form.Group className="mb-3">
//                         <Form.Label>Description</Form.Label>
//                         <Form.Control
//                           as="textarea"
//                           name="description"
//                           value={formData.description}
//                           onChange={handleChange}
//                           rows={3}
//                           placeholder="Enter store description"
//                           disabled={isSaving}
//                         />
//                       </Form.Group>

//                       <Form.Group className="mb-3">
//                         <Form.Label>Latitude</Form.Label>
//                         <Form.Control
//                           type="number"
//                           name="latitude"
//                           value={formData.latitude || ""}
//                           onChange={handleChange}
//                           placeholder="Enter latitude"
//                           min="-90"
//                           max="90"
//                           step="0.000001"
//                           disabled={isSaving}
//                         />
//                       </Form.Group>

//                       <Form.Group className="mb-3">
//                         <Form.Label>Longitude</Form.Label>
//                         <Form.Control
//                           type="number"
//                           name="longitude"
//                           value={formData.longitude || ""}
//                           onChange={handleChange}
//                           placeholder="Enter longitude"
//                           min="-180"
//                           max="180"
//                           step="0.000001"
//                           disabled={isSaving}
//                         />
//                       </Form.Group>

//                       <Form.Group className="mb-3">
//                         <Form.Label>Brand</Form.Label>
//                         <Select
//                           options={brands.map((brand) => ({
//                             value: brand._id,
//                             label: brand.brandName,
//                           }))}
//                           value={brands
//                             .map((brand) => ({
//                               value: brand._id,
//                               label: brand.brandName,
//                             }))
//                             .find(
//                               (option) => option.value === formData.brand
//                             )}
//                           onChange={handleBrandChange}
//                           isSearchable
//                           placeholder="Select a brand"
//                           isDisabled={isSaving}
//                         />
//                       </Form.Group>

//                       <AddUserButton type="submit" disabled={isSaving}>
//                         {isSaving ? (
//                           <ClipLoader size={15} color="#fff" />
//                         ) : isEditing ? (
//                           "Update Store"
//                         ) : (
//                           "Save Store"
//                         )}
//                       </AddUserButton>
//                     </Form>
//                   </Tab>

//                   {/* CSV Upload Form */}
//                   <Tab eventKey="csv" title="Import via CSV">
//                     <Form.Group className="mb-3">
//                       <Form.Label>Upload CSV</Form.Label>
//                       <Form.Control
//                         type="file"
//                         accept=".csv"
//                         onChange={(e) =>
//                           setCsvFile(e.target.files?.[0] || null)
//                         }
//                         disabled={isSaving}
//                       />
//                       <small>
//                         <a
//                           href="/sample-stores.csv"
//                           download
//                           style={{ color: "#1a8797" }}
//                         >
//                           Download Sample CSV
//                         </a>
//                       </small>
//                     </Form.Group>

//                     <AddUserButton
//                       type="button"
//                       onClick={handleCSVUpload}
//                       disabled={isSaving}
//                     >
//                       {isSaving ? (
//                         <ClipLoader size={15} color="#fff" />
//                       ) : (
//                         "Upload CSV"
//                       )}
//                     </AddUserButton>
//                   </Tab>
//                 </Tabs>
//               </Modal.Body>
//             </Modal>
//           </div>
//         </HeaderSection>

//         <TableContainer
//           columns={columns}
//           data={store}
//           isPagination={true}
//           iscustomPageSize={true}
//           className="table-responsive"
//         />
//       </Container>
//     </div>
//   );
// };

// export default Store;

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Tabs, Tab } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";
import Papa from "papaparse";
import {
  Container,
  HeaderSection,
  Title,
  UserCount,
  SearchInput,
  AddUserButton,
} from "../users/User.Styles";
import { StoreApiResponse, Stores } from "../../type";
import {
  createStoreData,
  deleteStoreData,
  getStoresData,
  updateStoreData,
} from "../../services/store";
import { getAllBrands } from "../../services/brandService";
import TableContainer from "../TabConatiner/TableConatiner";
import { Column } from "react-table";
import { ClipLoader } from "react-spinners";

interface Brand {
  _id: string;
  brandName: string;
}

type storeData = {
  storeName: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  brand: string;
};

const Store: React.FC = () => {
  const [store, setStores] = useState<Stores[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formData, setFormData] = useState<storeData>({
    storeName: "",
    description: "",
    latitude: null,
    longitude: null,
    brand: "",
  });

  const [activeTab, setActiveTab] = useState("manual");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [storesData, brandsData] = await Promise.all([
          getStoresData(),
          getAllBrands(),
        ]);
        setStores(storesData.stores);
        setBrands(brandsData);
      } catch {
        toast.error("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBrandChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setFormData((prev) => ({ ...prev, brand: selectedOption?.value || "" }));
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const { storeName, description, longitude, latitude, brand } = formData;
    if (!storeName || !description || !longitude || !latitude || !brand) {
      toast.error("All fields are required!");
      setIsSaving(false);
      return;
    }

    const storeData = {
      storeName,
      description,
      longitude: longitude.toString(),
      latitude: latitude.toString(),
      brand,
    };

    try {
      let storeResponse: StoreApiResponse;

      if (isEditing && storeId) {
        storeResponse = await updateStoreData(storeData, storeId);
        toast.success("Store updated successfully!");
        setStores((prevStores) =>
          prevStores.map((store) =>
            store._id === storeId ? { ...storeResponse.store } : store
          )
        );
      } else {
        storeResponse = await createStoreData(storeData);
        toast.success("Store created successfully!");
        setStores((prevStores) => [...prevStores, storeResponse.store]);
      }

      setFormData({
        storeName: "",
        description: "",
        longitude: null,
        latitude: null,
        brand: "",
      });

      setIsEditing(false);
      handleCloseModal();
    } catch (error) {
      toast.error("Error submitting the store. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCSVUpload = () => {
    if (!csvFile) {
      toast.error("Please select a CSV file first!");
      return;
    }

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows: any[] = results.data;
        if (!rows.length) {
          toast.error("CSV file is empty!");
          return;
        }

        setIsSaving(true);
        try {
          for (const row of rows) {
            if (
              !row.storeName ||
              !row.description ||
              !row.latitude ||
              !row.longitude ||
              !row.brand
            ) {
              continue; // skip invalid row
            }

            const storeData = {
              storeName: row.storeName,
              description: row.description,
              latitude: row.latitude,
              longitude: row.longitude,
              brand: row.brand,
            };

            const storeResponse = await createStoreData(storeData);
            setStores((prev) => [...prev, storeResponse.store]);
          }
          toast.success("CSV imported successfully!");
          handleCloseModal();
        } catch (error) {
          toast.error("Error importing CSV data!");
        } finally {
          setIsSaving(false);
        }
      },
    });
  };

  const handleDeleteStore = async (store: { _id: string }) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    try {
      setIsDeleting(true);
      setDeletingId(store._id);
      await deleteStoreData(store._id);
      toast.success("Store deleted successfully!");
      setStores((prevStores) => prevStores.filter((s) => s._id !== store._id));
    } catch (error) {
      toast.error("Error deleting store!");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const handleEditStore = (store: Stores) => {
    setFormData({
      storeName: store.storeName,
      description: store.description,
      longitude: store.location?.longitude || null,
      latitude: store.location?.latitude || null,
      brand:
        typeof store.brand === "object" ? store.brand._id : store.brand || "",
    });
    setStoreId(store._id);
    setIsEditing(true);
    setShowModal(true);
  };

  // --- Filtering and Pagination ---
  const filteredData = store.filter(
    (item) =>
      item.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof item.brand === "string"
        ? item.brand.toLowerCase().includes(searchTerm.toLowerCase())
        : item.brand?.brandName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()))
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<Stores>[] = [
    {
      Header: "ID",
      accessor: (_row, index) => index + 1,
      width: 50,
    },
    {
      Header: "Name",
      accessor: "storeName",
      width: 150,
    },
    {
      Header: "Description",
      accessor: "description",
      width: 150,
    },
    {
      Header: "Latitude",
      accessor: (row) =>
        row.location?.latitude !== undefined ? row.location.latitude : "N/A",
      width: 100,
    },
    {
      Header: "Longitude",
      accessor: (row) =>
        row.location?.longitude !== undefined ? row.location.longitude : "N/A",
      width: 100,
    },
    {
      Header: "Brand",
      accessor: (row) =>
        typeof row.brand === "object" && row.brand !== null
          ? row.brand.brandName
          : row.brand ?? "N/A",
      width: 150,
    },
    {
      Header: "Actions",
      accessor: "_id",
      width: 150,
      Cell: ({ row }) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={() => handleDeleteStore(row.original)}
            className="btn btn-danger"
            disabled={isDeleting}
          >
            {isDeleting && deletingId === row.original._id ? (
              <ClipLoader size={15} color="#fff" />
            ) : (
              "Delete"
            )}
          </button>
          <button
            onClick={() => handleEditStore(row.original)}
            className="btn btn-secondary"
            disabled={isDeleting || isSaving}
          >
            Edit
          </button>
        </div>
      ),
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
    <div style={{ position: "relative" }}>
      {(isSaving || isDeleting) && (
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
      )}

      <Container style={{ fontSize: "11px" }}>
        <HeaderSection>
          <div>
            <Title style={{ fontSize: "14px" }}>All Stores</Title>
            <UserCount>({store.length})</UserCount>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchInput
              type="text"
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: "11px", padding: "8px 15px", width: "180px" }}
            />
            <AddUserButton
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  storeName: "",
                  description: "",
                  latitude: null,
                  longitude: null,
                  brand: "",
                });
                handleShowModal();
              }}
              disabled={isSaving || isDeleting}
            >
              Add Store
            </AddUserButton>
          </div>
        </HeaderSection>

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
        />

        {/* Modal code remains unchanged */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "#1a8797" }}>
              {isEditing ? "Edit Store" : "Add New Store"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || "manual")}
            >
              <Tab eventKey="manual" title="Manual Entry">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      placeholder="Enter store name"
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Enter store description"
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      type="number"
                      name="latitude"
                      value={formData.latitude || ""}
                      onChange={handleChange}
                      placeholder="Enter latitude"
                      min="-90"
                      max="90"
                      step="0.000001"
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      type="number"
                      name="longitude"
                      value={formData.longitude || ""}
                      onChange={handleChange}
                      placeholder="Enter longitude"
                      min="-180"
                      max="180"
                      step="0.000001"
                      disabled={isSaving}
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
                        .map((brand) => ({
                          value: brand._id,
                          label: brand.brandName,
                        }))
                        .find((option) => option.value === formData.brand)}
                      onChange={handleBrandChange}
                      isSearchable
                      placeholder="Select a brand"
                      isDisabled={isSaving}
                    />
                  </Form.Group>

                  <AddUserButton type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <ClipLoader size={15} color="#fff" />
                    ) : isEditing ? (
                      "Update Store"
                    ) : (
                      "Save Store"
                    )}
                  </AddUserButton>
                </Form>
              </Tab>

              <Tab eventKey="csv" title="Import via CSV">
                <Form.Group className="mb-3">
                  <Form.Label>Upload CSV</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      setCsvFile(target.files?.[0] || null);
                    }}
                    disabled={isSaving}
                  />

                  <small>
                    <a
                      href="/sample-stores.csv"
                      download
                      style={{ color: "#1a8797" }}
                    >
                      Download Sample CSV
                    </a>
                  </small>
                </Form.Group>

                <AddUserButton
                  type="button"
                  onClick={handleCSVUpload}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ClipLoader size={15} color="#fff" />
                  ) : (
                    "Upload CSV"
                  )}
                </AddUserButton>
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Store;
