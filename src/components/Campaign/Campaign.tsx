import React, { useState, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Column } from "react-table";
import TableContainer from "../TabConatiner/TableConatiner";
import {
  Container,
  HeaderSection,
  Title,
  UserCount,
  SearchInput,
  AddUserButton,
} from "../users/User.Styles";
import {
  CampaignsData,
  createCampaignData,
  deleteCampaignData,
  updateCampaignData,
} from "../../services/campaign";
import { getAllBrands } from "../../services/brandService";
import { Campaigns } from "../../type";

interface FormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  pointsRequired: string;
  image: File | null;
  imagePreview: string | null;
  brand: string;
}

interface Brand {
  _id: string;
  brandName: string;
}

const Campaign: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaigns[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [statusModalShow, setStatusModalShow] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<{
    id: string;
    isActive: boolean;
  } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "Active",
    pointsRequired: "",
    image: null,
    imagePreview: null,
    brand: "",
  });

  // New state for filtering and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [campaignsData, brandsData] = await Promise.all([
          CampaignsData(),
          getAllBrands(),
        ]);
        setCampaigns(campaignsData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter campaigns based on search term
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (campaign.brand?.brandName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [campaigns, searchTerm]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCampaigns.slice(startIndex, startIndex + pageSize);
  }, [filteredCampaigns, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCampaigns.length / pageSize);

  const columns: Column<Campaigns>[] = [
    {
      Header: "ID",
      accessor: (_row, index) => (currentPage - 1) * pageSize + index + 1,
      id: "index",
      width: 40,
    },
    {
      Header: "Title",
      accessor: "title",
      width: 110,
    },
    {
      Header: "Description",
      accessor: "description",
      width: 140,
    },
    {
      Header: "Start Date",
      accessor: (row) => row.start_date.slice(0, 10),
      id: "startDate",
      width: 90,
    },
    {
      Header: "End Date",
      accessor: (row) => row.end_date.slice(0, 10),
      id: "endDate",
      width: 90,
    },
    {
      Header: "Image",
      accessor: "image_url",
      id: "image",
      Cell: ({ value }) => (
        <img
          src={value || undefined}
          alt="Campaign"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
        />
      ),
      width: 60,
    },
    {
      Header: "Brand",
      accessor: (row) => row.brand?.brandName || "N/A",
      id: "brandName",
      width: 70,
    },
    {
      Header: "Users",
      id: "enrolledUsers",
      Cell: ({ row }) => (
        <button
          onClick={() => handleViewEnrolledUsers(row.original)}
          style={{
            backgroundColor: "#1a8797",
            color: "white",
            padding: "5px 8px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          disabled={isSaving || isDeleting || isStatusChanging}
        >
          Enrolled Users
        </button>
      ),
      width: 110,
    },
    {
      Header: "Action",
      id: "manage",
      Cell: ({ row }) => (
        <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
          {/* Status Button */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => {
                setCurrentStatus({
                  id: row.original._id,
                  isActive: row.original.isActive,
                });
                setStatusModalShow(true);
              }}
              style={{
                backgroundColor: row.original.isActive ? "#1a8797" : "#dc3545",
                color: "white",
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
              }}
              disabled={isSaving || isDeleting || isStatusChanging}
            >
              {row.original.isActive ? "Active" : "Finished"}
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "5px" }}>
            <button
              onClick={() => handleEditCampaign(row.original)}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                flex: 1,
              }}
              disabled={isSaving || isDeleting || isStatusChanging}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteCampaign(row.original._id)}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                flex: 1,
              }}
              disabled={isDeleting}
            >
              {isDeleting && row.original._id === campaignId ? (
                <ClipLoader size={15} color="#fff" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      ),
      width: 200,
    },
  ];

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const handleBrandChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setFormData((prev) => ({ ...prev, brand: selectedOption?.value || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      toast.error("Invalid date values");
      setIsSaving(false);
      return;
    }

    if (!formData.brand) {
      toast.error("Please select a brand.");
      setIsSaving(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("start_date", startDate.toISOString());
    formDataToSend.append("end_date", endDate.toISOString());
    formDataToSend.append("points_required", formData.pointsRequired || "0");
    formDataToSend.append("active", (formData.status === "Active").toString());
    if (formData.image) formDataToSend.append("image", formData.image);
    formDataToSend.append("brand", formData.brand);

    try {
      const campaignResponse =
        isEditing && campaignId
          ? await updateCampaignData(formDataToSend, campaignId)
          : await createCampaignData(formDataToSend);
      console.log("camapaign res", campaignResponse);
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
        status: "Active",
        brand: "",
      });
      setIsEditing(false);
      setCampaignId(null);
      setShowModal(false);
      toast.success(
        `Campaign ${isEditing ? "updated" : "created"} successfully!`
      );
    } catch (error) {
      console.error("Error submitting campaign:", error);
      toast.error("Error submitting campaign. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (campaignId: string, status: string) => {
    try {
      setIsStatusChanging(true);
      const formData = new FormData();
      formData.append("campaignId", campaignId);
      formData.append("isActive", String(status === "Active"));

      const updatedCampaign = await updateCampaignData(formData, campaignId);
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign._id === updatedCampaign._id
            ? { ...campaign, isActive: updatedCampaign.isActive }
            : campaign
        )
      );
      toast.success("Campaign status updated successfully!");
    } catch (error) {
      console.error("Error updating campaign status:", error);

      toast.error("Error updating campaign status");
    } finally {
      setIsStatusChanging(false);
      setStatusModalShow(false);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      setIsDeleting(true);
      setCampaignId(campaignId);
      await deleteCampaignData(campaignId);
      setCampaigns((prev) =>
        prev.filter((campaign) => campaign._id !== campaignId)
      );
      toast.success("Campaign deleted successfully!");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Error deleting campaign");
    } finally {
      setIsDeleting(false);
      setCampaignId(null);
    }
  };

  const handleEditCampaign = (campaign: Campaigns) => {
    setFormData({
      title: campaign.title,
      description: campaign.description,
      start_date: campaign.start_date.slice(0, 10),
      end_date: campaign.end_date.slice(0, 10),
      pointsRequired: campaign.pointsRequired,
      imagePreview: campaign.image_url || null,
      status: campaign.isActive ? "Active" : "Finished",
      image: null,
      brand: campaign.brand?._id || "",
    });
    setCampaignId(campaign._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleViewEnrolledUsers = (campaign: Campaigns) => {
    navigate("/enrolled-users", {
      state: { enrolledUsers: campaign.enrolled_users },
    });
  };

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 100,
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
    <div style={{ position: "relative" }}>
      {(isSaving || isDeleting || isStatusChanging) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 100,
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
      )}

      <Container>
        <HeaderSection>
          <div>
            <Title>All Campaigns</Title>
            <UserCount>({filteredCampaigns.length})</UserCount>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <SearchInput
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                  status: "Active",
                  brand: "",
                });
                setShowModal(true);
              }}
              disabled={isSaving || isDeleting || isStatusChanging}
            >
              Add Campaign
            </AddUserButton>
          </div>
        </HeaderSection>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "#1a8797" }}>
              {isEditing ? "Edit Campaign" : "Add New Campaign"}
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
                  onChange={handleFormChange}
                  placeholder="Enter campaign title"
                  disabled={isSaving}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Enter campaign description"
                  disabled={isSaving}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleFormChange}
                  disabled={isSaving}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleFormChange}
                  disabled={isSaving}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Point</Form.Label>
                <Form.Control
                  type="text"
                  name="pointsRequired"
                  value={formData.pointsRequired}
                  onChange={handleFormChange}
                  placeholder="Enter campaign point"
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
              <Form.Group className="mb-3">
                <Form.Label>Campaign Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={isSaving}
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
              <AddUserButton type="submit" disabled={isSaving}>
                {isSaving ? (
                  <ClipLoader color="#fff" size={20} />
                ) : isEditing ? (
                  "Update Campaign"
                ) : (
                  "Save Campaign"
                )}
              </AddUserButton>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={statusModalShow} onHide={() => setStatusModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Change Campaign Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                onClick={() => {
                  if (currentStatus) {
                    handleStatusChange(currentStatus.id, "Active");
                  }
                }}
                style={{
                  backgroundColor: currentStatus?.isActive
                    ? "#1a8797"
                    : "#6c757d",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                disabled={isStatusChanging}
              >
                {isStatusChanging && currentStatus?.id === currentStatus?.id ? (
                  <ClipLoader size={15} color="#fff" />
                ) : (
                  "Set Active"
                )}
              </button>
              <button
                onClick={() => {
                  if (currentStatus) {
                    handleStatusChange(currentStatus.id, "Finished");
                  }
                }}
                style={{
                  backgroundColor: !currentStatus?.isActive
                    ? "#dc3545"
                    : "#6c757d",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                disabled={isStatusChanging}
              >
                {isStatusChanging && currentStatus?.id === currentStatus?.id ? (
                  <ClipLoader size={15} color="#fff" />
                ) : (
                  "Set Finished"
                )}
              </button>
            </div>
          </Modal.Body>
        </Modal>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
            maxHeight: "calc(100vh - 200px)", // Adjust table height
            overflowY: "auto",
          }}
        >
          <TableContainer
            columns={columns}
            data={paginatedData}
            isPagination={true}
            iscustomPageSize={true}
            pagination={{
              currentPage,
              totalPages,
              totalItems: filteredCampaigns.length,
              pageSize,
            }}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            showHeaderFilters={false}
            className="table-responsive"
          />
        </div>
      </Container>
    </div>
  );
};

export default Campaign;
