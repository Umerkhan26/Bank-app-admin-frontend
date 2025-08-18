import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { createBrand } from "../../services/brandService";

interface BrandForm {
  brandName: string;
  description: string;
  logo: File | null;
}

interface CreateBrandProps {
  onBrandCreated: (brand: any) => void;
}

const CreateBrand: React.FC<CreateBrandProps> = ({ onBrandCreated }) => {
  const [showModal, setShowModal] = useState(false);
  const [brandForm, setBrandForm] = useState<BrandForm>({
    brandName: "",
    description: "",
    logo: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBrandForm({ ...brandForm, [e.target.name]: e.target.value });
  };

  const handleCreateBrand = async () => {
    try {
      const formData = new FormData();
      formData.append("brandName", brandForm.brandName);
      formData.append("description", brandForm.description);
      if (brandForm.logo) {
        formData.append("image", brandForm.logo);
      }

      const response = await createBrand(formData);
      toast.success("Brand added successfully");
      setShowModal(false);
      setBrandForm({ brandName: "", description: "", logo: null });
      onBrandCreated(response.brand);
    } catch (error) {
      toast.error("Failed to add brand");
      console.error(error);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        style={{ backgroundColor: "#1a8797", border: "none", margin: "10px" }}
      >
        Add Brand
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#1a8797" }}>Add New Brand</Modal.Title>
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
              onClick={handleCreateBrand}
              style={{
                marginTop: "10px",
                backgroundColor: "#1a8797",
                border: "none",
              }}
            >
              Save Brand
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateBrand;
