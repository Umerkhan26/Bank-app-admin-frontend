import React from "react";
import { deleteUser, updateUserStatus } from "../../services/user";
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
import { getStoresData, createStoreData } from "../../services/store";
// import Loader from "../../components/Loader/Loader";
import { promotions, Stores } from "../../type";
import {
  createPromotionData,
  deletePromotionData,
  getPromotionsData,
  updatePromotionData,
} from "../../services/promotion";

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
  const [promotion, setpromotions] = useState<promotions[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Track dropdown visibility

  const [loading, setLoading] = useState(true);
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
        console.log("Fetched stores:", response); // Check the response structure

        // Ensure the stores array is inside the response object
        if (Array.isArray(response.stores)) {
          const extractedStores = response.stores.map((store) => ({
            _id: store._id, // Store ID
            storeName: store.storeName, // Store Name
          }));

          // Log the extracted stores to make sure the data is correctly processed
          console.log("Extracted stores:", extractedStores);

          setStores(extractedStores); // Set stores to state
        } else {
          console.error("Store data is not an array", response);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await getPromotionsData();
        console.log("Fetched Promotions:", data.promotions);
        setpromotions(data.promotions); // Assuming the API response has a `promotions` array
      } catch (error) {
        console.error("Error fetching promotions:", error);
        toast.error("Error fetching promotions. Please try again later.");
      }
    };

    fetchPromotions();
  }, []);

  if (error) return <div>Error loading users: {error.message}</div>;

  const toggleStatusButtons = (userId: string) => {
    setEditingStatusUserId(userId);
  };

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

  const handleDeleteUser = async (user: promotions) => {
    // console.log(`Deleting user: ${user.name}`);

    try {
      const deletedUser = await deleteUser(user._id);

      setpromotions((prevUsers) =>
        prevUsers.filter((existingUser) => existingUser._id !== deletedUser._id)
      );

      console.log("User deleted successfully", deletedUser);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(new Error("Failed to delete user"));
    }
  };

  const handleDeletepromotion = async (promotion: { _id: string }) => {
    try {
      const promotionId = promotion._id;

      console.log("Deleting promotion with ID:", promotionId);
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

  const handleStoreChangee = (e) => {
    const { options } = e.target;

    // Ensure stores is an array before processing
    if (!Array.isArray(stores)) {
      console.error("Stores are not available");
      return;
    }

    // Initialize the selectedStores array with the current formData.store value
    let selectedStores = formData.store || [];

    // Loop through selected options and store their values
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        // Add the selected store ID to the selectedStores array (only if it's not already added)
        if (!selectedStores.includes(options[i].value)) {
          selectedStores.push(options[i].value);
        }
      } else {
        // Remove the deselected store ID from the selectedStores array
        selectedStores = selectedStores.filter((id) => id !== options[i].value);
      }
    }

    // Update formData.store with the newly selected stores
    handleChange({ target: { name: "store", value: selectedStores } });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const { name, value } = e.target;

  //   // Handle multiple selection for store
  //   if (name === "store") {
  //     const selectedStores = Array.from(
  //       e.target.selectedOptions,
  //       (option) => option.value
  //     );
  //     setFormData({
  //       ...formData,
  //       [name]: selectedStores, // Update the selected store IDs
  //     });
  //   }
  // };
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible); // Toggle visibility of dropdown
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type (optional but recommended)
      if (file.type.startsWith("image/")) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          image: file, // Store the file
          imagePreview: URL.createObjectURL(file), // Create a preview URL
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
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const startDate = formData.start_date
  //     ? new Date(formData.start_date)
  //     : new Date();
  //   const endDate = formData.end_date
  //     ? new Date(formData.end_date)
  //     : new Date();

  //   if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
  //     console.error(
  //       "Invalid date values:",
  //       formData.start_date,
  //       formData.end_date
  //     );
  //     return;
  //   }

  //   const pointsRequired =
  //     formData.pointsRequired && !isNaN(Number(formData.pointsRequired))
  //       ? formData.pointsRequired
  //       : "0";

  //   const formDataToSend = new FormData();
  //   formDataToSend.append("title", formData.title);
  //   formDataToSend.append("description", formData.description);
  //   formDataToSend.append("start_date", startDate.toISOString());
  //   formDataToSend.append("end_date", endDate.toISOString());
  //   formDataToSend.append("points_required", pointsRequired.toString());

  //   // Handle the `stores` field
  //   if (Array.isArray(formData.store)) {
  //     // If `stores` is an array, join it into a comma-separated string
  //     formDataToSend.append("stores", formData.store.join(","));
  //   } else if (typeof formData.store === "string") {
  //     // If `stores` is a string (comma-separated), just pass it directly
  //     formDataToSend.append("stores", formData.store);
  //   } else {
  //     // Default to an empty string or handle the error as necessary
  //     formDataToSend.append("stores", "");
  //   }

  //   if (formData.image) {
  //     formDataToSend.append("image", formData.image);
  //   }

  //   try {
  //     const promotionResponse = await createPromotionData(formDataToSend);
  //     console.log("Create api response", promotionResponse);

  //     toast.success("Promotion created successfully!");
  //     setpromotions((prevPromotions) => [
  //       ...prevPromotions,
  //       {
  //         ...promotionResponse,
  //         id: promotionResponse.id || Math.random().toString(36).substr(2, 9),
  //       },
  //     ]);

  //     // Reset form data
  //     setFormData({
  //       title: "",
  //       description: "",
  //       start_date: "",
  //       end_date: "",
  //       pointsRequired: "",
  //       image: null,
  //       stores: [],
  //     });

  //     // Close modal
  //     setIsEditing(false);
  //     handleCloseModal();
  //   } catch (error) {
  //     console.error("Error creating promotion:", error);
  //     toast.error("Error creating the promotion. Please try again.");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        console.log("Updated Promotion Response:", promotionResponse);
        toast.success("Promotion updated successfully!");
      } else {
        // Create new promotion if `isEditing` is false
        promotionResponse = await createPromotionData(formDataToSend);
        console.log("Created Promotion Response:", promotionResponse);
        toast.success("Promotion created successfully!");
      }

      // Update the state with the response
      setpromotions((prevPromotions) => {
        if (isEditing && promotionId) {
          return prevPromotions.map((promotion) =>
            promotion.id === promotionId
              ? { ...promotionResponse, id: promotionId }
              : promotion
          );
        } else {
          return [
            ...prevPromotions,
            {
              ...promotionResponse,
              id:
                promotionResponse.id || Math.random().toString(36).substr(2, 9),
            },
          ];
        }
      });

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
                {/* Title Input */}
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

                {/* Description Input */}
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

                {/* Start Date Input */}
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date" // Ensure it matches backend key
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* End Date Input */}
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* <Form.Group className="mb-3">
                  <Form.Label>Stores</Form.Label>
                  <Form.Select
                    name="store"
                    value={formData.store}
                    onChange={handleChange}
                    aria-label="Select Stores"
                    multiple
                  >
                    <option value="">Select stores</option>
                    {stores.length > 0 ? (
                      stores.map((store) => (
                        <option key={store._id} value={store._id}>
                          {store.storeName}
                        </option>
                      ))
                    ) : (
                      <option>Loading stores...</option>
                    )}
                  </Form.Select>
                </Form.Group> */}
                <Form.Group className="mb-3">
                  <Form.Label>Stores</Form.Label>

                  {/* Store Select Dropdown */}
                  <div className="dropdown-container">
                    <Form.Select
                      name="store"
                      value={formData.store || []} // Ensure formData.store is always an array
                      onChange={handleStoreChangee} // Use handleStoreChange to update multiple stores
                      aria-label="Select Stores"
                      multiple
                      onClick={toggleDropdown} // Toggle dropdown visibility on click
                      className="form-select-sm" // Small size for the select field
                    >
                      <option value="">Select stores</option>

                      {/* Conditionally render store options when dropdown is visible */}
                      {isDropdownVisible && stores && stores.length > 0
                        ? stores.map((store) => (
                            <option key={store._id} value={store._id}>
                              {store.storeName}
                            </option>
                          ))
                        : null}
                    </Form.Select>
                  </div>

                  {/* Display selected store names directly in the input field */}
                  <Form.Control
                    type="text"
                    value={
                      Array.isArray(formData.store)
                        ? formData.store
                            .map(
                              (id) =>
                                stores.find((store) => store._id === id)
                                  ?.storeName ?? ""
                            )
                            .join(", ") // Join selected store names with a comma
                        : ""
                    }
                    readOnly
                    className="mt-2"
                    aria-label="Selected Stores"
                  />
                </Form.Group>

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

                {/* Image Upload */}
                <Form.Group className="mb-3">
                  <Form.Label>promotion Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*" // Ensure only images can be uploaded
                  />
                  {/* Show Image Preview if it's available */}
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

                {/* Submit Button */}
                <AddUserButton variant="primary" type="submit">
                  {isEditing ? "Update promotion" : "Save promotion"}
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
            <TableHeader>Store</TableHeader> {/* New Store Column */}
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
