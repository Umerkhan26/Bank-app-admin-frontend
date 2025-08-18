import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";
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
  const [error, setError] = useState<null | Error>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<storeData>({
    storeName: "",
    description: "",
    latitude: null,
    longitude: null,
    brand: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [storesData, brandsData] = await Promise.all([
          getStoresData(),
          getAllBrands(),
        ]);
        console.log("📦 Stores Data:", storesData);
        setStores(storesData.stores);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error : new Error("Failed to fetch data")
        );
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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

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
      console.error("Error submitting store:", error);
      toast.error("Error submitting the store. Please try again later.");
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
      console.error("Error deleting store:", error);
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
          ? row.brand
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
            style={{
              padding: "5px 8px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
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
            style={{
              padding: "5px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
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

      <Container>
        <HeaderSection>
          <div>
            <Title>All Stores</Title>
            <UserCount>({store.length})</UserCount>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SearchInput type="text" placeholder="Search stores..." />
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

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "#1a8797" }}>
                  {isEditing ? "Edit Store" : "Add New Store"}
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
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
              </Modal.Body>
            </Modal>
          </div>
        </HeaderSection>

        <TableContainer
          columns={columns}
          data={store}
          isPagination={true}
          iscustomPageSize={true}
          className="table-responsive"
        />
      </Container>
    </div>
  );
};

export default Store;
