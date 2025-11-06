import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Tabs, Tab } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  Container,
  HeaderSection,
  Title,
  UserCount,
  SearchInput,
  AddUserButton,
} from "../users/User.Styles";
import { StoreApiResponse } from "../../type";
import {
  createStoreData,
  deleteStoreData,
  getStoresData,
  importStoresFromCSV,
  updateStoreData,
} from "../../services/store";
import TableContainer from "../TabConatiner/TableConatiner";
import { Column } from "react-table";
import { ClipLoader } from "react-spinners";

interface Store {
  _id: string;
  customerNumber: string;
  customerName: string;
  address: string;
  parish: string;
  telephoneNumber: string;
  location: {
    latitude: number;
    longitude: number;
  };
  isActive: boolean;
}

type StoreData = {
  customerNumber: string;
  customerName: string;
  address: string;
  parish: string;
  telephoneNumber: string;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
};

const Store: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 20, // Match backend default
  });

  const [formData, setFormData] = useState<StoreData>({
    customerNumber: "",
    customerName: "",
    address: "",
    parish: "",
    telephoneNumber: "",
    latitude: null,
    longitude: null,
    isActive: true,
  });

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("manual");

  // ✅ fetchData now accepts search
  const fetchData = async (
    page: number = 1,
    limit: number = 20,
    search: string = ""
  ) => {
    setLoading(true);
    try {
      const storesData = await getStoresData(page, limit, search);

      setStores(storesData.stores);
      setPagination({
        currentPage: storesData.currentPage,
        totalPages: storesData.totalPages,
        totalCount: storesData.totalCount,
        pageSize: limit,
      });
    } catch {
      toast.error("Error fetching stores. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Debounce effect for searchTerm
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // ✅ Fetch data whenever debounced search, page, or size changes
  useEffect(() => {
    fetchData(currentPage, pageSize, debouncedSearchTerm);
  }, [currentPage, pageSize, debouncedSearchTerm]);

  // ✅ Initial fetch (empty search)
  useEffect(() => {
    fetchData(1, pagination.pageSize, "");
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "latitude" || name === "longitude"
          ? parseFloat(value) || null
          : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      customerNumber: "",
      customerName: "",
      address: "",
      parish: "",
      telephoneNumber: "",
      latitude: null,
      longitude: null,
      isActive: true,
    });
    setIsEditing(false);
    setStoreId(null);
  };

  const handleShowModal = () => setShowModal(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const {
      customerNumber,
      customerName,
      address,
      parish,
      telephoneNumber,
      latitude,
      longitude,
      isActive,
    } = formData;
    if (
      !customerNumber ||
      !customerName ||
      !address ||
      !parish ||
      !telephoneNumber ||
      latitude === null ||
      longitude === null
    ) {
      toast.error("All fields except isActive are required!");
      setIsSaving(false);
      return;
    }

    const storeData = {
      customerNumber,
      customerName,
      address,
      parish,
      telephoneNumber,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      isActive,
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

      handleCloseModal();
    } catch (error) {
      toast.error("Error submitting the store. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file first!");
      return;
    }

    setIsSaving(true);
    try {
      const response = await importStoresFromCSV(csvFile);
      toast.success(`Successfully imported ${response.count} stores!`);

      // Refresh the stores list
      const storesData = await getStoresData();
      setStores(storesData.stores);

      handleCloseModal();
    } catch (error: any) {
      console.error("CSV import error:", error);
      toast.error(error.response?.data?.message || "Error importing CSV file");
    } finally {
      setIsSaving(false);
    }
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

  const handleEditStore = (store: Store) => {
    setFormData({
      customerNumber: store.customerNumber,
      customerName: store.customerName,
      address: store.address,
      parish: store.parish,
      telephoneNumber: store.telephoneNumber,
      latitude: store.location.latitude,
      longitude: store.location.longitude,
      isActive: store.isActive,
    });
    setStoreId(store._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const columns: Column<Store>[] = [
    {
      Header: "ID",
      accessor: (_row, index) => index + 1,
      width: 30,
    },
    {
      Header: "Customer Number",
      accessor: "customerNumber",
      width: 100,
    },
    {
      Header: "Customer Name",
      accessor: "customerName",
      width: 120,
    },
    {
      Header: "Address",
      accessor: "address",
      width: 120,
    },
    {
      Header: "Parish",
      accessor: "parish",
      width: 90,
    },
    {
      Header: "Telephone",
      accessor: "telephoneNumber",
      width: 90,
    },
    {
      Header: "Latitude",
      accessor: (row) => row.location.latitude.toFixed(6),
      width: 80,
    },
    {
      Header: "Longitude",
      accessor: (row) => row.location.longitude.toFixed(6),
      width: 80,
    },
    {
      Header: "Active",
      accessor: (row) => (row.isActive ? "Yes" : "No"),
      width: 50,
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
              <ClipLoader size={14} color="#fff" />
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
            <UserCount>({stores.length})</UserCount>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchInput
              type="text"
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // ✅ reset to first page when searching
              }}
              style={{ fontSize: "11px", padding: "8px 15px", width: "180px" }}
            />
            <AddUserButton
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  customerNumber: "",
                  customerName: "",
                  address: "",
                  parish: "",
                  telephoneNumber: "",
                  latitude: null,
                  longitude: null,
                  isActive: true,
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
          data={stores}
          isPagination={true}
          iscustomPageSize={true}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalCount,
            pageSize: pagination.pageSize,
          }}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showHeaderFilters={false}
        />

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
                    <Form.Label>Customer Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerNumber"
                      value={formData.customerNumber}
                      onChange={handleChange}
                      placeholder="Enter customer number"
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Enter customer name"
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Parish</Form.Label>
                    <Form.Control
                      type="text"
                      name="parish"
                      value={formData.parish}
                      onChange={handleChange}
                      placeholder="Enter parish"
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Telephone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="telephoneNumber"
                      value={formData.telephoneNumber}
                      onChange={handleChange}
                      placeholder="Enter telephone number"
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
                    <Form.Label>Active</Form.Label>
                    <Form.Check
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleCheckboxChange}
                      disabled={isSaving}
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
