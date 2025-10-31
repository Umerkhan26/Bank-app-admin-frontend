import React, { useEffect, useState } from "react";
import { Column } from "react-table";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  updateBrand,
  updateBrandStatus,
} from "../../services/brandService";
import TableContainer from "../TabConatiner/TableConatiner";
import "bootstrap/dist/css/bootstrap.min.css";
import img1 from "../../assets/images/brands/brand.png";
import {
  AddUserButton,
  Container,
  HeaderSection,
  SearchInput,
  Title,
  UserCount,
} from "../users/User.Styles";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

interface Brand {
  _id: string;
  brandName: string;
  description?: string;
  logo?: string;
  isActive: boolean;
}

const Brand: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const [brandForm, setBrandForm] = useState({
    brandName: "",
    description: "",
    logo: null as File | null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await getAllBrands();

        // 👇 Handle if your service returns an object with 'brands'
        setBrands(data.brands || data);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        toast.error("Failed to fetch brands");
      } finally {
        // ✅ Always stop loading
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBrandForm({ ...brandForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    const formData = new FormData();
    formData.append("brandName", brandForm.brandName);
    formData.append("description", brandForm.description);
    if (brandForm.logo) {
      formData.append("image", brandForm.logo);
    }

    try {
      if (isEditMode && selectedBrandId) {
        const updated = await updateBrand(selectedBrandId, formData);
        setBrands((prev) =>
          prev.map((b) => (b._id === updated._id ? updated : b))
        );
        toast.success("Brand updated successfully");
      } else {
        const response = await createBrand(formData);
        setBrands((prev) => [response.brand, ...prev]);
        toast.success("Brand added successfully");
      }

      setShowModal(false);
      setSelectedBrandId(null);
      setIsEditMode(false);
      setBrandForm({ brandName: "", description: "", logo: null });
    } catch (err) {
      toast.error("Failed to save brand");
      console.error("Error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      setIsDeleting(true);
      await deleteBrand(id);
      setBrands((prev) => prev.filter((brand) => brand._id !== id));
      toast.success("Brand deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete brand");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      setIsStatusChanging(true);
      const response = await updateBrandStatus(id, !currentStatus);
      console.log("first", response);
      setBrands((prev) =>
        prev.map((brand) =>
          brand._id === id ? { ...brand, isActive: !currentStatus } : brand
        )
      );
      toast.success("Brand status updated");
    } catch (err) {
      console.error("Failed to update brand status", err);
      toast.error("Failed to update brand status");
    } finally {
      setIsStatusChanging(false);
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredBrands.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<Brand>[] = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: (_row: Brand, i: number) => i + 1,
        disableFilters: true,
        width: 50,
      },
      {
        Header: "Brand Name",
        accessor: "brandName",
        Cell: ({ value }) => (
          <div
            style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            {value}
          </div>
        ),
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => value || "—",
        width: 250,
      },
      {
        Header: "Logo",
        accessor: "logo",
        disableFilters: true,
        Cell: ({ value }) => {
          const imageSrc = value && value !== "null" ? value : img1;

          return (
            <img
              src={imageSrc}
              alt="logo"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid #ccc",
                objectPosition: "top",
              }}
            />
          );
        },
        width: 100,
      },
      {
        Header: "Status",
        accessor: "isActive",
        Cell: ({ value }) => (
          <span style={{ color: value ? "green" : "red", fontWeight: "bold" }}>
            {value ? "Active" : "Inactive"}
          </span>
        ),
        width: 100,
      },
      {
        Header: "Actions",
        id: "actions",
        disableFilters: true,
        Cell: ({ row }) => {
          const brand = row.original;
          return (
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsEditMode(true);
                  setSelectedBrandId(brand._id);
                  setBrandForm({
                    brandName: brand.brandName,
                    description: brand.description || "",
                    logo: null,
                  });
                  setShowModal(true);
                }}
                disabled={isDeleting || isStatusChanging}
              >
                Edit
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteBrand(brand._id)}
                disabled={isDeleting || isStatusChanging}
              >
                {isDeleting && brand._id === selectedBrandId ? (
                  <ClipLoader size={15} color="#fff" />
                ) : (
                  "Delete"
                )}
              </Button>

              <Button
                variant={brand.isActive ? "danger" : "success"}
                size="sm"
                onClick={() => handleStatusToggle(brand._id, brand.isActive)}
                disabled={isDeleting || isStatusChanging}
              >
                {isStatusChanging && brand._id === selectedBrandId ? (
                  <ClipLoader size={15} color="#fff" />
                ) : brand.isActive ? (
                  "Deactivate"
                ) : (
                  "Activate"
                )}
              </Button>
            </div>
          );
        },
        width: 200,
      },
    ],
    [isDeleting, isStatusChanging]
  );

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
      )}

      <Container>
        <HeaderSection>
          <div>
            <Title>All Brands</Title>
            <UserCount>({brands.length})</UserCount>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchInput
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <AddUserButton
              onClick={() => {
                setIsEditMode(false);
                setSelectedBrandId(null);
                setBrandForm({ brandName: "", description: "", logo: null });
                setShowModal(true);
              }}
              disabled={isSaving || isDeleting || isStatusChanging}
            >
              Add Brand
            </AddUserButton>
          </div>
        </HeaderSection>

        <TableContainer
          key={brands.length}
          columns={columns}
          data={paginatedBrands}
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

        {/* Modal for brand creation */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "#1a8797" }}>
              {isEditMode ? "Edit Brand" : "Add New Brand"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Brand Name</Form.Label>
                <Form.Control
                  type="text"
                  name="brandName"
                  value={brandForm.brandName}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  disabled={isSaving}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={brandForm.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter brand description"
                  disabled={isSaving}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Logo Image</Form.Label>
                <Form.Control
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] || null;
                    setBrandForm({ ...brandForm, logo: file });
                  }}
                  disabled={isSaving}
                />
              </Form.Group>

              {brandForm.logo && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={URL.createObjectURL(brandForm.logo)}
                    alt="Logo Preview"
                    style={{ width: "100px", height: "auto" }}
                  />
                </div>
              )}

              <Button
                onClick={handleSubmit}
                style={{ marginTop: "10px", backgroundColor: "#1a8797" }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ClipLoader size={15} color="#fff" />
                ) : isEditMode ? (
                  "Update Brand"
                ) : (
                  "Save Brand"
                )}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Brand;
