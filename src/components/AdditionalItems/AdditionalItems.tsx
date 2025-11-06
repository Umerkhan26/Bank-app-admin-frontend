import React, { useEffect, useState } from "react";
import {
  getAllAdditionalItems,
  createAdditionalItem,
  updateAdditionalItem,
  deleteAdditionalItem,
  IAdditionalItem,
} from "../../services/additionalItemService";
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

const AdditionalItems: React.FC = () => {
  const [additionalItems, setAdditionalItems] = useState<IAdditionalItem[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemForm, setItemForm] = useState<{
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
        const itemsData = await getAllAdditionalItems();
        const brandData = await getAllBrands();
        setAdditionalItems(itemsData);
        setBrands(brandData);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const resetForm = () => {
    setItemForm({
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
    setSelectedItemId(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setItemForm({ ...itemForm, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setItemForm({ ...itemForm, image: file });
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemForm({ ...itemForm, active: e.target.checked });
  };

  const saveAdditionalItem = async () => {
    try {
      // Validation
      if (!itemForm.title.trim()) {
        toast.error("Title is required");
        return;
      }

      if (!itemForm.points_required.trim()) {
        toast.error("Points required is required");
        return;
      }

      if (itemForm.start_date && itemForm.end_date) {
        if (new Date(itemForm.end_date) < new Date(itemForm.start_date)) {
          toast.error("End date cannot be before start date");
          return;
        }
      }

      const formData = new FormData();
      formData.append("title", itemForm.title);
      formData.append("description", itemForm.description);
      formData.append("points_required", itemForm.points_required);
      formData.append("start_date", itemForm.start_date);
      formData.append("end_date", itemForm.end_date);
      formData.append("active", itemForm.active.toString());

      if (itemForm.image) {
        formData.append("image", itemForm.image);
      }

      if (itemForm.brand) {
        formData.append("brand", itemForm.brand);
      }

      if (itemForm.qty) {
        formData.append("qty", itemForm.qty);
      }

      const response =
        isEditMode && selectedItemId
          ? await updateAdditionalItem(selectedItemId, formData)
          : await createAdditionalItem(formData);

      toast.success(
        `Additional Item ${isEditMode ? "updated" : "added"} successfully`
      );

      setAdditionalItems((prev) =>
        isEditMode
          ? prev.map((item) =>
              item._id === selectedItemId ? response.data : item
            )
          : [response.data, ...prev]
      );

      if (!isEditMode) setCurrentPage(1);
      resetForm();
    } catch (error: any) {
      toast.error(
        error.message ||
          `Failed to ${isEditMode ? "update" : "add"} additional item`
      );
      console.error(error);
    }
  };

  const handleEdit = (item: IAdditionalItem) => {
    setIsEditMode(true);
    setSelectedItemId(item._id);
    setItemForm({
      title: item.title,
      description: item.description,
      points_required: item.points_required,
      start_date: item.start_date.split("T")[0], // Format date for input
      end_date: item.end_date.split("T")[0], // Format date for input
      image: null,
      active: item.active,
      brand: item.brand || "",
      qty: item.qty?.toString() || "",
    });
    setShowModal(true);
  };

  const handleDeleteAdditionalItem = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Item?",
      text: "Are you sure you want to delete this additional item?",
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
      await deleteAdditionalItem(id);
      toast.success("Additional Item deleted successfully");
      setAdditionalItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete additional item");
      console.error("Delete error:", error);
    }
  };

  const filteredAdditionalItems = additionalItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brands
        ?.find((b) => b._id === item.brand)
        ?.brandName.toLowerCase()
        ?.includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredAdditionalItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedAdditionalItems = filteredAdditionalItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<IAdditionalItem>[] = React.useMemo(
    () => [
      {
        Header: "#",
        id: "rowNumber",
        Cell: ({ row }: CellProps<IAdditionalItem, number>) => row.index + 1,
        width: 30,
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({
          value,
        }: CellProps<IAdditionalItem, IAdditionalItem["title"]>) => (
          <div
            style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            {value}
          </div>
        ),
        width: 110,
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({
          value,
        }: CellProps<IAdditionalItem, IAdditionalItem["description"]>) =>
          value || "—",
        width: 110,
      },
      {
        Header: "Points Required",
        accessor: "points_required",
        Cell: ({
          value,
        }: CellProps<IAdditionalItem, IAdditionalItem["points_required"]>) =>
          value || "—",
        width: 60,
      },
      {
        Header: "Start Date",
        accessor: "start_date",
        Cell: ({
          value,
        }: CellProps<IAdditionalItem, IAdditionalItem["start_date"]>) =>
          new Date(value).toLocaleDateString(),
        width: 80,
      },
      {
        Header: "End Date",
        accessor: "end_date",
        Cell: ({
          value,
        }: CellProps<IAdditionalItem, IAdditionalItem["end_date"]>) =>
          new Date(value).toLocaleDateString(),
        width: 80,
      },
      {
        Header: "Image",
        accessor: "image_url",
        Cell: ({
          value,
        }: CellProps<IAdditionalItem, IAdditionalItem["image_url"]>) => {
          const imageSrc = value && value !== "null" ? value : img1;
          return (
            <img
              src={imageSrc}
              alt="additional item"
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
        Header: "Brand",
        accessor: "brand",
        Cell: ({ value }: CellProps<IAdditionalItem, any>) => {
          const brandName =
            typeof value === "object"
              ? value?.brandName
              : brands.find((b) => b._id === value)?.brandName;

          return <span>{brandName || "—"}</span>;
        },
        width: 100,
      },

      {
        Header: "Quantity",
        accessor: "qty",
        Cell: ({ value }: CellProps<IAdditionalItem, IAdditionalItem["qty"]>) =>
          value !== null && value !== undefined ? value : "—",
        width: 60,
      },
      {
        Header: "Status",
        accessor: "active",
        Cell: ({
          value,
        }: CellProps<IAdditionalItem, IAdditionalItem["active"]>) => (
          <span
            style={{
              color: value ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {value ? "Active" : "Inactive"}
          </span>
        ),
        width: 60,
      },
      {
        Header: "Actions",
        id: "actions",
        Cell: ({ row }: CellProps<IAdditionalItem, unknown>) => (
          <div style={{ display: "flex", gap: "7px" }}>
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
              onClick={() => handleDeleteAdditionalItem(row.original._id)}
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
          <Title>All Additional Items</Title>
          <UserCount>({additionalItems.length})</UserCount>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <SearchInput
            type="text"
            placeholder="Search additional items..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AddUserButton
            onClick={() => {
              setIsEditMode(false);
              resetForm();
              setShowModal(true);
            }}
          >
            Add Additional Item
          </AddUserButton>
        </div>

        <Modal show={showModal} onHide={resetForm} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "#1a8797" }}>
              {isEditMode ? "Edit Additional Item" : "Add New Additional Item"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={itemForm.title}
                  onChange={handleChange}
                  placeholder="Enter item title"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={itemForm.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter item description"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Points Required *</Form.Label>
                <Form.Control
                  type="text"
                  name="points_required"
                  value={itemForm.points_required}
                  onChange={handleChange}
                  placeholder="Enter points required"
                  required
                />
              </Form.Group>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="start_date"
                      value={itemForm.start_date}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="end_date"
                      value={itemForm.end_date}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Form.Text className="text-muted">
                  {isEditMode
                    ? "Leave empty to keep current image"
                    : "Upload item image"}
                </Form.Text>
              </Form.Group>

              {itemForm.image && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={URL.createObjectURL(itemForm.image)}
                    alt="Image Preview"
                    style={{ width: "100px", height: "auto" }}
                  />
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Select
                  name="brand"
                  value={itemForm.brand}
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
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="qty"
                  value={itemForm.qty}
                  onChange={handleChange}
                  placeholder="Enter available quantity"
                  min="0"
                />
                <Form.Text className="text-muted">
                  Leave empty for unlimited quantity
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  name="active"
                  checked={itemForm.active}
                  onChange={handleActiveChange}
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  style={{
                    backgroundColor: "#1a8797",
                    borderColor: "#1a8797",
                  }}
                  onClick={saveAdditionalItem}
                >
                  {isEditMode ? "Update Item" : "Save Item"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </HeaderSection>
      <TableContainer<IAdditionalItem>
        key={additionalItems.length}
        columns={columns}
        data={paginatedAdditionalItems}
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

export default AdditionalItems;
