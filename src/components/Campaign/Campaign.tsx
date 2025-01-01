import React from "react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";

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
import {
  CampaignsData,
  createCampaignData,
  deleteCampaignData,
  updateCampaignData,
} from "../../services/campaign";
// import Loader from "../../components/Loader/Loader";
import { Campaigns } from "../../type";

type FormData = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  pointsRequired: string;
  image: File | null;
  imagePreview: string | null;
};

const Campaign: React.FC = () => {
  const [campaign, setCampaigns] = useState<Campaigns[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [editingStatusUserId, setEditingStatusUserId] = useState<string | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);
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
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campaignsData = await CampaignsData();
        console.log("Campaigns Data:", campaignsData);
        setCampaigns(campaignsData);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchData();
  }, [setCampaigns]);

  if (error) return <div>Error loading users: {error.message}</div>;

  const toggleStatusButtons = (userId: string) => {
    setEditingStatusUserId(userId);
  };

  const handleStatusOptionChange = async (userId: string, status: string) => {
    const newStatus = status === "Active";

    try {
      const updatedUser = await updateCampaignData({ campaignId, newStatus });

      setCampaigns((prevUsers) =>
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

  const handleDeleteCampaign = async (campaign: { _id: string }) => {
    try {
      const campaignId = campaign._id;

      console.log("Deleting campaign with ID:", campaignId);
      const deletedCampaign = await deleteCampaignData(campaignId);
      console.log("Deleted Campaign:", deletedCampaign);
      toast.success("Campaign deleted successfully!");

      setCampaigns((prevCampaigns) =>
        prevCampaigns.filter((campaign) => campaign._id !== campaignId)
      );
    } catch (error) {
      console.error("Error deleting campaign:", error);
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
          image: file,
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

    console.log("Form Data on submit:", formData);

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
        : "0";

    const status = formData.status === "Active";

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("start_date", startDate.toISOString());
    formDataToSend.append("end_date", endDate.toISOString());
    formDataToSend.append("points_required", pointsRequired.toString());
    formDataToSend.append("active", status.toString());

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      let campaignResponse;

      if (isEditing && campaignId) {
        campaignResponse = await updateCampaignData(formDataToSend, campaignId);
        console.log("Updated Campaign Response:", campaignResponse);
        toast.success("Campaign updated successfully!");
      } else {
        campaignResponse = await createCampaignData(formDataToSend);
        console.log("Created Campaign Response:", campaignResponse);
        toast.success("Campaign created successfully!");
      }

      setCampaigns((prevCampaigns) => {
        if (isEditing && campaignId) {
          return prevCampaigns.map((campaign) =>
            campaign._id === campaignId
              ? { ...campaignResponse, id: campaignId }
              : campaign
          );
        } else {
          return [
            ...prevCampaigns,
            {
              ...campaignResponse,
              id:
                campaignResponse._id || Math.random().toString(36).substr(2, 9),
            },
          ];
        }
      });

      // Refetch campaigns for consistency
      const updatedCampaigns = await CampaignsData();
      setCampaigns(updatedCampaigns);

      setFormData({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        pointsRequired: "",
        image: null,
        imagePreview: null,
        status: "",
      });

      setIsEditing(false);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting campaign:", error);
      toast.error("Error submitting the campaign. Please try again later.");
    }
    setLoading(false);
  };

  const handleEditCampaign = (campaign) => {
    setFormData({
      title: campaign.title,
      description: campaign.description,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      pointsRequired: campaign.pointsRequired,
      imagePreview: campaign.image_url || null,
      status: campaign.status || "",
      image: null,
    });
    setCampaignId(campaign._id);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <Container>
      {/* {loading && <Loader />} */}
      <ToastContainer />
      <HeaderSection>
        <div>
          <Title>All Campaigns</Title>
          <UserCount>({campaign.length})</UserCount>{" "}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchInput type="text" placeholder="Search campaigns..." />
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
                  status: "",
                });
                handleShowModal();
              }}
            >
              Add Campaign
            </AddUserButton>
          </div>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "#1a8797" }}>
                {isEditing ? "Edit Campaign" : "Add New Campaign"}
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
                    placeholder="Enter campaign title"
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
                    placeholder="Enter campaign description"
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

                <Form.Group className="mb-3">
                  <Form.Label>Point</Form.Label>
                  <Form.Control
                    type="text"
                    name="pointsRequired"
                    value={formData.pointsRequired}
                    onChange={handleChange}
                    placeholder="Enter campaign point"
                  />
                </Form.Group>

                {/* Image Upload */}
                <Form.Group className="mb-3">
                  <Form.Label>Campaign Image</Form.Label>
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
                        alt="Campaign Preview"
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
                    "Update Campaign"
                  ) : (
                    "Save Campaign"
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
            <TableHeader>Image</TableHeader>
            <TableHeader>Action</TableHeader>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(campaign) &&
            campaign.map((campaign, index) => (
              <TableRow key={campaign.id}>
                <TableData style={{ fontSize: "14px" }}>{index + 1}</TableData>
                <TableData style={{ fontSize: "14px" }}>
                  {campaign.title}
                </TableData>
                <TableData style={{ fontSize: "14px" }}>
                  {campaign.description}
                </TableData>
                <TableData style={{ fontSize: "14px" }}>
                  {campaign.start_date
                    ? new Date(campaign.start_date).toISOString().slice(0, 10)
                    : "N/A"}
                </TableData>
                <TableData style={{ fontSize: "14px" }}>
                  {campaign.end_date
                    ? new Date(campaign.end_date).toISOString().slice(0, 10)
                    : "N/A"}
                </TableData>
                <TableData>
                  <img
                    src={campaign.image_url}
                    alt="Campaign"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      fontSize: "14px",
                    }}
                  />
                </TableData>
                <TableData>
                  {editingStatusUserId === campaign._id ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleStatusOptionChange(campaign._id, "Active")
                        }
                        style={{
                          backgroundColor: campaign.isActive
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
                      <button
                        onClick={() =>
                          handleStatusOptionChange(campaign._id, "Blocked")
                        }
                        style={{
                          backgroundColor: !campaign.isActive
                            ? "#dc3545"
                            : "#1a8797",
                          color: "white",
                          padding: "7px 10px",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "5px",
                        }}
                      >
                        Fineshed
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        onClick={() => toggleStatusButtons(campaign._id)}
                        style={{
                          backgroundColor: campaign.isActive
                            ? "#1a8797"
                            : "#dc3545",
                          color: "white",
                          padding: "7px 9px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        {campaign.isActive ? "Active" : "Finished"}
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(campaign)}
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
                        onClick={() => handleEditCampaign(campaign)}
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
                  )}
                </TableData>
              </TableRow>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Campaign;
