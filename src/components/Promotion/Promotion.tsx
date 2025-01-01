import React from "react";
import { deleteUser, updateUserStatus } from "../../services/user";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";

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
import { getStoresData } from "../../services/store";
// import Loader from "../../components/Loader/Loader";
import { Promotions } from "../../type";
import {
  createPromotionData,
  deletePromotionData,
  getPromotionsData,
  updatePromotionData,
} from "../../services/promotion";
import { ClipLoader } from "react-spinners";

type FormData = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  pointsRequired: string;
  image: File | null;
  imagePreview: string | null;
  store: string[];
};

const Promotion: React.FC = () => {
  const [promotion, setpromotions] = useState<Promotions[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [editingStatusUserId, setEditingStatusUserId] = useState<string | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [promotionId, setpromotionId] = useState<string | null>(null);
  const [stores, setStores] = useState<{ _id: string; storeName: string }[]>(
    []
  );

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "Active",
    pointsRequired: "",
    image: null,
    imagePreview: null,
    store: [] as string[],
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await getStoresData();
        console.log("Fetched stores:", response);

        if (Array.isArray(response.stores)) {
          const extractedStores = response.stores.map((store) => ({
            _id: store._id,
            storeName: store.storeName,
          }));

          console.log("Extracted stores:", extractedStores);

          setStores(extractedStores);
        } else {
          console.error("Store data is not an array", response);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  const fetchPromotions = async () => {
    try {
      const data = await getPromotionsData();
      console.log("Fetched Promotions:", data.promotions);
      setpromotions(data.promotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast.error("Error fetching promotions. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  if (error) return <div>Error loading users: {error.message}</div>;

  const handleStatusOptionChange = async (userId: string, status: string) => {
    const newStatus = status === "Active";

    try {
      const updatedUser = await updateUserStatus({ userId, newStatus });

      setpromotions((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id
            ? { ...user, isActive: updatedUser.isActive }
            : user
        )
      );

      setEditingStatusUserId(null);
    } catch (err) {
      console.error("Error updating user status:", err);
      setError(new Error("Failed to update user status"));
    }
  };

  const handleDeletepromotion = async (promotion: { _id: string }) => {
    try {
      const promotionId = promotion._id;

      const deletedpromotion = await deletePromotionData(promotionId);
      console.log("Deleted promotion:", deletedpromotion);
      toast.success("promotion deleted successfully!");

      setpromotions((prevpromotions) =>
        prevpromotions.filter((promotion) => promotion._id !== promotionId)
      );

      // Optionally, show a success message or confirmatio
    } catch (error) {
      console.error("Error deleting promotion:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type (optional but recommended)
      if (file.type.startsWith("image/")) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          image: file, // Store the file
          imagePreview: URL.createObjectURL(file),
        }));
      } else {
        alert("Please upload a valid image file.");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const startDate = formData.start_date
      ? new Date(formData.start_date)
      : new Date();
    const endDate = formData.end_date
      ? new Date(formData.end_date)
      : new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error(
        "Invalid date values:",
        formData.start_date,
        formData.end_date
      );
      return;
    }

    const pointsRequired =
      formData.pointsRequired && !isNaN(Number(formData.pointsRequired))
        ? formData.pointsRequired
        : "0"; // Default value or handle accordingly

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("start_date", startDate.toISOString());
    formDataToSend.append("end_date", endDate.toISOString());
    formDataToSend.append("points_required", pointsRequired.toString());

    // Handle the `stores` field
    if (Array.isArray(formData.store)) {
      formDataToSend.append("stores", formData.store.join(","));
    } else if (typeof formData.store === "string") {
      formDataToSend.append("stores", formData.store);
    } else {
      formDataToSend.append("stores", "");
    }

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      let promotionResponse;

      if (isEditing && promotionId) {
        // Update existing promotion if `isEditing` is true
        promotionResponse = await updatePromotionData(
          formDataToSend,
          promotionId
        );
        console.log("UpdatedDDDDD Promotion Response:", promotionResponse);
        toast.success("Promotion updated successfully!");
      } else {
        // Create new promotion if `isEditing` is false
        promotionResponse = await createPromotionData(formDataToSend);
        console.log("Created Promotion Response:", promotionResponse);
        toast.success("Promotion created successfully!");
      }

      setpromotions((prevPromotions) => {
        if (isEditing && promotionId) {
          return prevPromotions.map((promotion) =>
            promotion._id === promotionId
              ? { ...promotionResponse.promotion, id: promotionId }
              : promotion
          );
        } else {
          return [
            ...prevPromotions,
            {
              ...promotionResponse.promotion,
              id:
                promotionResponse.promotion._id ||
                Math.random().toString(36).substr(2, 9),
            },
          ];
        }
      });

      // Refetch campaigns for consistency
      const updatedPromotions = await getPromotionsData();
      console.log("Updated promotions data:", updatedPromotions);
      setpromotions(updatedPromotions);

      // Fetch updated promotions list
      await fetchPromotions();

      // Reset form data
      setFormData({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        pointsRequired: "",
        image: null,
        stores: [],
      });

      // Close modal and reset edit state
      setIsEditing(false);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting promotion:", error);
      toast.error("Error submitting the promotion. Please try again later.");
    }
    setLoading(false);
  };

  const handleEditpromotion = (promotion) => {
    setFormData({
      title: promotion.title,
      description: promotion.description,
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      pointsRequired: promotion.pointsRequired,
      imagePreview: promotion.image_url || null,
      status: promotion.status || "",
      image: null,
      store: [],
    });
    setpromotionId(promotion._id);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <Container>
      {/* {loading && <Loader />} */}
      <ToastContainer />
      <HeaderSection>
        <div>
          <Title>All Promotions</Title>
          <UserCount>({promotion.length})</UserCount>{" "}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchInput type="text" placeholder="Search promotions..." />
            <AddUserButton
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  title: "",
                  description: "",
                  start_date: "",
                  end_date: "",
                  pointsRequired: "",
                  image: null,
                  imagePreview: null,
                  status: "", // Add default value for status
                  store: "",
                });
                handleShowModal();
              }}
            >
              Add Promotion
            </AddUserButton>
          </div>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "#1a8797" }}>
                {isEditing ? "Edit promotion" : "Add New promotion"}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter promotion title"
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
                    placeholder="Enter promotion description"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                </Form.Group>

                {
                  <Form.Group className="mb-3">
                    <Form.Label>Stores</Form.Label>
                    <Select
                      name="store"
                      isMulti
                      options={stores.map((store) => ({
                        value: store._id,
                        label: store.storeName,
                      }))}
                      value={
                        Array.isArray(formData.store)
                          ? formData.store.map((storeId) => ({
                              value: storeId,
                              label:
                                stores.find((store) => store._id === storeId)
                                  ?.storeName || "",
                            }))
                          : []
                      }
                      onChange={(selectedOptions) => {
                        const selectedStores = selectedOptions.map(
                          (option) => option.value
                        );
                        setFormData({
                          ...formData,
                          store: selectedStores,
                        });
                      }}
                      placeholder="Select stores"
                    />
                  </Form.Group>
                }

                <Form.Group className="mb-3">
                  <Form.Label>Point</Form.Label>
                  <Form.Control
                    type="text"
                    name="pointsRequired"
                    value={formData.pointsRequired}
                    onChange={handleChange}
                    placeholder="Enter promotion point"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>promotion Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {formData.imagePreview && (
                    <div style={{ marginTop: "10px" }}>
                      <img
                        src={formData.imagePreview}
                        alt="promotion Preview"
                        style={{
                          width: "100%",
                          maxWidth: "200px",
                          height: "auto",
                        }}
                      />
                    </div>
                  )}
                </Form.Group>

                <AddUserButton variant="primary" type="submit">
                  {loading ? (
                    <ClipLoader color="#fff" size={20} loading={loading} />
                  ) : isEditing ? (
                    "Update Promotion"
                  ) : (
                    "Save Promotion"
                  )}
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
            <TableHeader>Title</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Start Date</TableHeader>
            <TableHeader>End Date</TableHeader>
            <TableHeader>Store</TableHeader>
            <TableHeader>Image</TableHeader>
            <TableHeader>Action</TableHeader>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(promotion) &&
            promotion.map((promotion, index) => (
              <TableRow key={promotion.id}>
                <TableData>{index + 1}</TableData>
                <TableData>{promotion.title}</TableData>
                <TableData>{promotion.description}</TableData>
                <TableData>
                  {promotion.start_date
                    ? new Date(promotion.start_date).toISOString().slice(0, 10)
                    : "N/A"}
                </TableData>
                <TableData>
                  {promotion.end_date
                    ? new Date(promotion.end_date).toISOString().slice(0, 10)
                    : "N/A"}
                </TableData>
                <TableData>
                  {/* {promotion.store ? promotion.store.storeName : "N/A"}{" "} */}
                  {promotion.stores && promotion.stores.length > 0
                    ? promotion.stores.join(", ") // Joins all store IDs into a comma-separated string
                    : "N/A"}

                  {/* Store Name */}
                </TableData>
                <TableData>
                  <img
                    src={promotion.image_url}
                    alt="promotion"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                </TableData>
                <TableData>
                  {editingStatusUserId === promotion._id ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleStatusOptionChange(promotion._id, "Active")
                        }
                        style={{
                          backgroundColor: promotion.isActive
                            ? "#1a8797"
                            : "#1a8797",
                          color: "white",
                          padding: "7px 15px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Active
                      </button>

                      {/* <button
                        onClick={() => handleDeleteUser(promotion)}
                        className="btn btn-danger ms-2"
                        style={{
                          padding: "7px 9px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button> */}
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {/* <button
                        onClick={() => toggleStatusButtons(promotion._id)}
                        style={{
                          backgroundColor: promotion.isActive
                            ? "#1a8797"
                            : "#dc3545",
                          color: "white",
                          padding: "7px 9px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        {promotion.isActive ? "Active" : "Finished"}
                      </button> */}
                      <button
                        onClick={() => handleDeletepromotion(promotion)}
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
                        onClick={() => handleEditpromotion(promotion)}
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
                  )}
                </TableData>
              </TableRow>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Promotion;
