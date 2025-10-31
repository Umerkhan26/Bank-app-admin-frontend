import React, { useEffect, useState } from "react";
import {
  getAllBankPremiums,
  createBankPremium,
  updateBankPremium,
  deleteBankPremium,
  IBankPremium,
} from "../../services/bankPremiumService";
import "bootstrap/dist/css/bootstrap.min.css";
import img1 from "../../assets/images/brands/brand.png";
import Swal from "sweetalert2";
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
import { getAllBrands } from "../../services/brandService";
import TableContainer from "../TabConatiner/TableConatiner";
import { ClipLoader } from "react-spinners";
import { CellProps, Column } from "react-table";

interface IBrand {
  _id: string;
  brandName: string;
}

const BankPremium: React.FC = () => {
  const [bankPremiums, setBankPremiums] = useState<IBankPremium[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPremiumId, setSelectedPremiumId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [premiumForm, setPremiumForm] = useState<{
    title: string;
    description: string;
    points_required: string;
    start_date: string;
    end_date: string;
    image: File | null;
    active: boolean;
    brand: string;
    qty: string;
  }>({
    title: "",
    description: "",
    points_required: "",
    start_date: "",
    end_date: "",
    image: null,
    active: true,
    brand: "",
    qty: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const premiumData = await getAllBankPremiums();
        const brandData = await getAllBrands();
        setBankPremiums(premiumData);
        setBrands(brandData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const resetForm = () => {
    setPremiumForm({
      title: "",
      description: "",
      points_required: "",
      start_date: "",
      end_date: "",
      image: null,
      active: true,
      brand: "",
      qty: "",
    });
    setShowModal(false);
    setIsEditMode(false);
    setSelectedPremiumId(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPremiumForm({ ...premiumForm, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPremiumForm({ ...premiumForm, image: file });
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPremiumForm({ ...premiumForm, active: e.target.checked });
  };

  const saveBankPremium = async () => {
    try {
      if (premiumForm.start_date && premiumForm.end_date) {
        if (new Date(premiumForm.end_date) < new Date(premiumForm.start_date)) {
          toast.error("End date cannot be before start date");
          return;
        }
      }

      const formData = new FormData();
      formData.append("title", premiumForm.title);
      formData.append("description", premiumForm.description);
      formData.append("points_required", premiumForm.points_required);
      formData.append("start_date", premiumForm.start_date);
      formData.append("end_date", premiumForm.end_date);
      formData.append("active", premiumForm.active.toString());
      if (premiumForm.image) {
        formData.append("image", premiumForm.image);
      }
      if (premiumForm.brand) {
        formData.append("brand", premiumForm.brand);
      }
      if (premiumForm.qty) {
        formData.append("qty", premiumForm.qty);
      }

      const response =
        isEditMode && selectedPremiumId
          ? await updateBankPremium(selectedPremiumId, formData)
          : await createBankPremium(formData);

      toast.success(
        `Bank Premium ${isEditMode ? "updated" : "added"} successfully`
      );

      setBankPremiums((prev) =>
        isEditMode
          ? prev.map((premium) =>
              premium._id === selectedPremiumId ? response.bankPremium : premium
            )
          : [response.bankPremium, ...prev]
      );

      if (!isEditMode) setCurrentPage(1);
      resetForm();
    } catch (error: any) {
      toast.error(
        error.message ||
          `Failed to ${isEditMode ? "update" : "add"} bank premium`
      );
      console.error(error);
    }
  };

  const handleEdit = (premium: IBankPremium) => {
    setIsEditMode(true);
    setSelectedPremiumId(premium._id);
    setPremiumForm({
      title: premium.title,
      description: premium.description,
      points_required: premium.points_required,
      start_date: premium.start_date,
      end_date: premium.end_date,
      image: null,
      active: premium.active,
      brand: premium.brand || "",
      qty: premium.qty?.toString() || "",
    });
    setShowModal(true);
  };

  const handleDeleteBankPremium = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Premium?",
      text: "Are you sure you want to delete this premium?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteBankPremium(id);
      toast.success("Bank Premium deleted successfully");
      setBankPremiums((prev) => prev.filter((premium) => premium._id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete bank premium");
      console.error("Delete error:", error);
    }
  };

  const filteredBankPremiums = bankPremiums.filter(
    (premium) =>
      premium.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      premium.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brands
        ?.find((b) => b._id === premium.brand)
        ?.brandName.toLowerCase()
        ?.includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredBankPremiums.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedBankPremiums = filteredBankPremiums.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<IBankPremium>[] = React.useMemo(
    () => [
      {
        Header: "#",
        id: "rowNumber",
        Cell: ({ row }: CellProps<IBankPremium, number>) => row.index + 1,
        width: 40,
      },
      {
        Header: "Title",
        accessor: "title", // ✅ no need for `as keyof`
        Cell: ({ value }: CellProps<IBankPremium, IBankPremium["title"]>) => (
          <div
            style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            {value}
          </div>
        ),
        width: 100,
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({
          value,
        }: CellProps<IBankPremium, IBankPremium["description"]>) =>
          value || "—",
        width: 130,
      },
      {
        Header: "Points Required",
        accessor: "points_required",
        Cell: ({
          value,
        }: CellProps<IBankPremium, IBankPremium["points_required"]>) =>
          value || "—",
        width: 110,
      },
      {
        Header: "Start Date",
        accessor: "start_date",
        Cell: ({
          value,
        }: CellProps<IBankPremium, IBankPremium["start_date"]>) =>
          new Date(value).toLocaleDateString(),
        width: 80,
      },
      {
        Header: "End Date",
        accessor: "end_date",
        Cell: ({ value }: CellProps<IBankPremium, IBankPremium["end_date"]>) =>
          new Date(value).toLocaleDateString(),
        width: 80,
      },
      {
        Header: "Image",
        accessor: "image_url",
        Cell: ({
          value,
        }: CellProps<IBankPremium, IBankPremium["image_url"]>) => {
          const imageSrc = value && value !== "null" ? value : img1;
          return (
            <img
              src={imageSrc}
              alt="premium"
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
        width: 70,
      },
      {
        Header: "Brand ID",
        accessor: "brand",
        Cell: ({ value }: CellProps<IBankPremium, IBankPremium["brand"]>) => (
          <span>{value || "—"}</span>
        ),
        width: 180,
      },

      {
        Header: "Quantity",
        accessor: "qty",
        Cell: ({ value }: CellProps<IBankPremium, IBankPremium["qty"]>) =>
          value !== null && value !== undefined ? value : "—",
        width: 80,
      },

      {
        Header: "Actions",
        id: "actions",
        Cell: ({ row }: CellProps<IBankPremium, unknown>) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteBankPremium(row.original._id)}
            >
              Delete
            </Button>
          </div>
        ),
        width: 130,
      },
    ],
    [brands]
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
    <Container>
      <HeaderSection>
        <div>
          <Title>All Bank Premiums</Title>
          <UserCount>({bankPremiums.length})</UserCount>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <SearchInput
            type="text"
            placeholder="Search premiums..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AddUserButton
            onClick={() => {
              setIsEditMode(false);
              resetForm();
              setShowModal(true);
            }}
          >
            Add Bank Premium
          </AddUserButton>
        </div>

        <Modal show={showModal} onHide={resetForm} centered>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "#1a8797" }}>
              {isEditMode ? "Edit Bank Premium" : "Add New Bank Premium"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={premiumForm.title}
                  onChange={handleChange}
                  placeholder="Enter premium title"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={premiumForm.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter premium description"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Points Required</Form.Label>
                <Form.Control
                  type="text"
                  name="points_required"
                  value={premiumForm.points_required}
                  onChange={handleChange}
                  placeholder="Enter points required"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={premiumForm.start_date}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="end_date"
                  value={premiumForm.end_date}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Form.Group>

              {premiumForm.image && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={URL.createObjectURL(premiumForm.image)}
                    alt="Image Preview"
                    style={{ width: "100px", height: "auto" }}
                  />
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Brand </Form.Label>
                <Form.Select
                  name="brand"
                  value={premiumForm.brand}
                  onChange={handleChange}
                >
                  <option value="">Select a brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.brandName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantity (Qty)</Form.Label>
                <Form.Control
                  type="number"
                  name="qty"
                  value={premiumForm.qty}
                  onChange={handleChange}
                  placeholder="Enter available quantity"
                  min="0"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  name="active"
                  checked={premiumForm.active}
                  onChange={handleActiveChange}
                />
              </Form.Group>

              <Button
                style={{
                  marginTop: "10px",
                  backgroundColor: "#1a8797",
                  borderColor: "#1a8797",
                }}
                onClick={saveBankPremium}
              >
                {isEditMode ? "Update Bank Premium" : "Save Bank Premium"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </HeaderSection>
      <TableContainer<IBankPremium>
        key={bankPremiums.length}
        columns={columns}
        data={paginatedBankPremiums}
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
        tableStyle={{
          width: "100%",
          tableLayout: "fixed",
        }}
      />
    </Container>
  );
};

export default BankPremium;
