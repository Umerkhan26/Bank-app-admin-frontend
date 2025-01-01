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
import { Stores } from "../../type";
import {
  createStoreData,
  deleteStoreData,
  getStoresData,
  updateStoreData,
} from "../../services/store";

type storeData = {
  storeName: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
};

const Store: React.FC = () => {
  const [store, setStores] = useState<Stores[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [storeId, setStoreId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<storeData>({
    storeName: "",
    description: "",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getStoresData();
        console.log("Fetched Stores:", data.stores);
        setStores(data.stores);
      } catch (error) {
        console.error("Error fetching stores:", error);
        toast.error("Error fetching stores. Please try again later.");
      }
    };

    fetchStores();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form Data on submit:", formData);

    // Ensure required fields are present
    const { storeName, description, longitude, latitude } = formData;
    if (!storeName || !description || !longitude || !latitude) {
      toast.error("All fields are required!");
      return;
    }

    // Construct the JSON data to be sent
    const storeData = {
      storeName,
      description,
      longitude: longitude.toString(),
      latitude: latitude.toString(),
    };

    try {
      let storeResponse;

      if (isEditing && storeId) {
        storeResponse = await updateStoreData(storeData, storeId);
        console.log("Updated Store Response:", storeResponse);
        toast.success("Store updated successfully!");
      } else {
        storeResponse = await createStoreData(storeData);
        console.log("Created Store Response:", storeResponse);
        toast.success("Store created successfully!");
      }

      setStores((prevStores) => {
        if (isEditing && storeId) {
          return prevStores.map((store) =>
            store._id === storeId
              ? { ...storeResponse.store, id: storeId }
              : store
          );
        } else {
          // Add the new store to the list directly without needing a fetch
          return [
            ...prevStores,
            {
              ...storeResponse.store,
              id:
                storeResponse.store._id ||
                Math.random().toString(36).substr(2, 9), // Ensure unique ID
            },
          ];
        }
      });

      // Reset form data after submission
      setFormData({
        storeName: "",
        description: "",
        longitude: null,
        latitude: null,
      });

      // Close modal
      setIsEditing(false);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting store:", error);
      toast.error("Error submitting the store. Please try again later.");
    }
  };

  const handleDeleteStore = async (store: { _id: string }) => {
    try {
      const storeId = store._id;
      console.log("Deleting store with ID:", storeId); // Debugging line

      if (!storeId) {
        console.error("Store ID is missing");
        return;
      }

      const deletedStore = await deleteStoreData(storeId); // Function to call the DELETE API
      console.log("Deleted Store:", deletedStore);

      toast.success("Store deleted successfully!");

      setStores((prevStores) =>
        prevStores.filter((store) => store._id !== storeId)
      );
    } catch (error) {
      console.error("Error deleting store:", error);
      toast.error("Error deleting store!");
    }
  };

  const handleEditCampaign = (store) => {
    setFormData({
      storeName: store.storeName,
      description: store.description,
      longitude: store.longitude,
      latitude: store.latitude,
    });
    setStoreId(store._id);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <Container>
      {/* {loading && <Loader />} */}
      <ToastContainer />
      <HeaderSection>
        <div>
          <Title>All Stores</Title>
          <UserCount>({store.length})</UserCount>{" "}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchInput type="text" placeholder="Search campaigns..." />
            <AddUserButton
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  storeName: "",
                  description: "",
                  latitude: null,
                  longitude: null,
                }); // Clear form data for adding a new campaign
                handleShowModal();
              }}
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
                {/* Title Input */}
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    placeholder="Enter store name"
                  />
                </Form.Group>

                {/* Description Input */}
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter store description"
                  />
                </Form.Group>

                {/* Start Date Input */}
                <Form.Group className="mb-3">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Enter latitude"
                    min="-90"
                    max="90"
                    step="0.000001" // Optional: for precision
                  />
                </Form.Group>

                {/* End Date Input */}
                <Form.Group className="mb-3">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Enter longitude"
                    min="-180"
                    max="180"
                    step="0.000001" // Optional: for precision
                  />
                </Form.Group>

                {/* Submit Button */}
                <AddUserButton variant="primary" type="submit">
                  {isEditing ? "Update Store" : "Save Store"}
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
            <TableHeader>Name</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Latitude</TableHeader>
            <TableHeader>Longitude</TableHeader>
            <TableHeader>Action</TableHeader>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(store) &&
            store.map((store, index) => (
              <TableRow key={store.id}>
                <TableData>{index + 1}</TableData>
                <TableData>{store.storeName}</TableData>
                <TableData>{store.description}</TableData>
                <TableData>
                  {store.location ? store.location.latitude : "N/A"}
                </TableData>
                <TableData>
                  {store.location ? store.location.longitude : "N/A"}
                </TableData>
                <TableData>
                  {/* {editingStatusUserId === store._id ? ( */}
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() => handleDeleteStore(store)}
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
                      onClick={() => handleEditCampaign(store)}
                      className="btn btn-secondary ms-2"
                      style={{
                        padding: "7px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      update
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

export default Store;
