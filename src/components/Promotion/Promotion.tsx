import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import { CellProps, Column } from "react-table";

import {
  Container,
  HeaderSection,
  Title,
  UserCount,
  SearchInput,
  AddUserButton,
} from "../users/User.Styles";
import { getStoresData } from "../../services/store";
import { Promotions, PromotionTable, Stores } from "../../type";
import {
  createPromotionData,
  deletePromotionData,
  getPromotionsData,
  updatePromotionData,
} from "../../services/promotion";
import { getAllBrands } from "../../services/brandService";
import TableContainer from "../TabConatiner/TableConatiner";

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
  brand: string;
};

interface Brand {
  _id: string;
  brandName: string;
}

const Promotion: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotions[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [promotionId, setPromotionId] = useState<string | null>(null);
  const [stores, setStores] = useState<{ _id: string; storeName: string }[]>(
    []
  );
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "Active",
    pointsRequired: "",
    image: null,
    imagePreview: null,
    store: [],
    brand: "",
  });

  useEffect(() => {
    const fetchStoresAndBrands = async () => {
      setLoading(true);
      try {
        const [storesResponse, brandsResponse] = await Promise.all([
          getStoresData(),
          getAllBrands(),
        ]);

        if (Array.isArray(storesResponse.stores)) {
          const extractedStores = storesResponse.stores.map(
            (store: Stores) => ({
              _id: store._id,
              storeName: store.storeName,
            })
          );
          setStores(extractedStores);
        }

        setBrands(brandsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStoresAndBrands();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const data = await getPromotionsData();
      setPromotions(data.promotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast.error("Error fetching promotions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleBrandChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setFormData((prev) => ({ ...prev, brand: selectedOption?.value || "" }));
  };

  const handleDeletePromotion = async (promotion: { _id: string }) => {
    if (!window.confirm("Are you sure you want to delete this promotion?"))
      return;

    try {
      setIsDeleting(true);
      setDeletingId(promotion._id);
      await deletePromotionData(promotion._id);
      toast.success("Promotion deleted successfully!");
      setPromotions((prevPromotions) =>
        prevPromotions.filter((p) => p._id !== promotion._id)
      );
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast.error("Error deleting promotion!");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
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
    setIsSaving(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("start_date", formData.start_date);
    formDataToSend.append("end_date", formData.end_date);
    formDataToSend.append("points_required", formData.pointsRequired || "0");
    formDataToSend.append("active", String(formData.status === "Active"));

    if (formData.brand) {
      formDataToSend.append("brand", formData.brand);
    }

    if (Array.isArray(formData.store)) {
      formDataToSend.append("stores", formData.store.join(","));
    }

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (isEditing && promotionId) {
        await updatePromotionData(formDataToSend, promotionId);
        toast.success("Promotion updated successfully!");
      } else {
        await createPromotionData(formDataToSend);
        toast.success("Promotion created successfully!");
      }

      await fetchPromotions();
      setFormData({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        pointsRequired: "",
        image: null,
        imagePreview: null,
        status: "Active",
        store: [],
        brand: "",
      });
      setIsEditing(false);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting promotion:", error);
      toast.error("Error submitting the promotion. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPromotion = (promotion: Promotions) => {
    setFormData({
      title: promotion.title,
      description: promotion.description,
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      pointsRequired: promotion.points_required,
      imagePreview: promotion.image_url || null,
      status: promotion.active ? "Active" : "Inactive",
      image: null,
      store: promotion.stores || [],
      brand:
        typeof promotion.brand === "object"
          ? promotion.brand._id
          : promotion.brand || "",
    });
    setPromotionId(promotion._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const columns: Column<PromotionTable>[] = [
    {
      Header: "ID",
      accessor: (_row, index) => index + 1,
      width: 40,
    },
    {
      Header: "Title",
      accessor: "title",
      width: 130,
    },
    {
      Header: "Description",
      accessor: "description",
      width: 110,
    },
    {
      Header: "Start Date",
      accessor: (row) =>
        row.start_date
          ? new Date(row.start_date).toISOString().slice(0, 10)
          : "N/A",
      width: 90,
    },
    {
      Header: "End Date",
      accessor: (row) =>
        row.end_date
          ? new Date(row.end_date).toISOString().slice(0, 10)
          : "N/A",
      width: 90,
    },
    {
      Header: "Brand",
      accessor: (row) =>
        typeof row.brand === "object" && row.brand !== null
          ? row.brand.brandName
          : row.brand ?? "N/A",
      width: 60,
    },
    {
      Header: "Stores",
      accessor: (row) =>
        row.stores && row.stores.length > 0 ? row.stores.join(", ") : "N/A",
      width: 140,
    },
    {
      Header: "Image",
      accessor: "image_url",
      Cell: ({ value }: CellProps<PromotionTable, string | undefined>) =>
        value ? (
          <img
            src={value}
            alt="promotion"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
            }}
          />
        ) : (
          <span>N/A</span>
        ),
      width: 60,
    },
    {
      Header: "Status",
      accessor: "active",
      Cell: ({ value }) => (
        <span style={{ color: value ? "green" : "red" }}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
      width: 60,
    },
    {
      Header: "Actions",
      accessor: "_id",
      Cell: ({ row }) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={() => handleDeletePromotion(row.original)}
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
            onClick={() => handleEditPromotion(row.original)}
            className="btn btn-secondary"
            style={{
              padding: "5px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            disabled={isSaving || isDeleting}
          >
            Edit
          </button>
        </div>
      ),
      width: 140,
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
      <ToastContainer />
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
            <Title>All Promotions</Title>
            <UserCount>({promotions.length})</UserCount>
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
                    status: "Active",
                    store: [],
                    brand: "",
                  });
                  handleShowModal();
                }}
                disabled={isSaving || isDeleting}
              >
                Add Promotion
              </AddUserButton>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "#1a8797" }}>
                  {isEditing ? "Edit Promotion" : "Add New Promotion"}
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
                      placeholder="Enter promotion description"
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
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
                    <Form.Label>Stores</Form.Label>
                    <Select
                      name="store"
                      isMulti
                      options={stores.map((store) => ({
                        value: store._id,
                        label: store.storeName,
                      }))}
                      value={formData.store.map((storeId) => ({
                        value: storeId,
                        label:
                          stores.find((store) => store._id === storeId)
                            ?.storeName || "",
                      }))}
                      onChange={(selectedOptions) => {
                        const selectedStores =
                          selectedOptions?.map((option) => option.value) || [];
                        setFormData({
                          ...formData,
                          store: selectedStores,
                        });
                      }}
                      placeholder="Select stores"
                      isDisabled={isSaving}
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
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Promotion Image</Form.Label>
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
                          alt="Promotion Preview"
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

        <TableContainer
          columns={columns}
          data={promotions}
          isPagination={true}
          iscustomPageSize={true}
          className="table-responsive"
        />
      </Container>
    </div>
  );
};

export default Promotion;
