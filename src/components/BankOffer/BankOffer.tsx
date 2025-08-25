import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { Column } from "react-table";

import {
  Container,
  HeaderSection,
  Title,
  UserCount,
  SearchInput,
  AddUserButton,
} from "../users/User.Styles";
import TableContainer from "../TabConatiner/TableConatiner";
import {
  createBankOfferData,
  getBankOffersData,
  updateBankOfferData,
  deleteBankOfferData,
} from "../../services/bankofferservice";

interface BankOffer {
  _id: string;
  title: string;
  description: string;
  discount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

type FormData = {
  title: string;
  description: string;
  discount: string;
  validFrom: string;
  validTo: string;
  isActive: string;
};

const BankOffer: React.FC = () => {
  const [bankOffers, setBankOffers] = useState<BankOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [offerId, setOfferId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    discount: "",
    validFrom: "",
    validTo: "",
    isActive: "true",
  });

  const fetchBankOffers = async () => {
    try {
      setLoading(true);
      const data = await getBankOffersData();
      setBankOffers(data.data);
    } catch (error) {
      console.error("Error fetching bank offers:", error);
      toast.error("Error fetching bank offers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankOffers();
  }, []);

  const handleDeleteBankOffer = async (offer: { _id: string }) => {
    if (!window.confirm("Are you sure you want to delete this bank offer?"))
      return;
    try {
      setIsDeleting(true);
      setDeletingId(offer._id);
      await deleteBankOfferData(offer._id);
      toast.success("Bank offer deleted successfully!");
      setBankOffers((prevOffers) =>
        prevOffers.filter((p) => p._id !== offer._id)
      );
    } catch (error) {
      console.error("Error deleting bank offer:", error);
      toast.error("Error deleting bank offer!");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      title: "",
      description: "",
      discount: "",
      validFrom: "",
      validTo: "",
      isActive: "true",
    });
    setIsEditing(false);
    setOfferId(null);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const dataToSend = {
      title: formData.title,
      description: formData.description,
      discount: parseFloat(formData.discount),
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      isActive: formData.isActive === "true",
    };

    try {
      if (isEditing && offerId) {
        await updateBankOfferData(dataToSend, offerId);
        toast.success("Bank offer updated successfully!");
      } else {
        await createBankOfferData(dataToSend);
        toast.success("Bank offer created successfully!");
      }
      await fetchBankOffers();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting bank offer:", error);
      toast.error("Error submitting the bank offer. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditBankOffer = (offer: BankOffer) => {
    setFormData({
      title: offer.title,
      description: offer.description,
      discount: offer.discount.toString(),
      validFrom: new Date(offer.validFrom).toISOString().slice(0, 10),
      validTo: new Date(offer.validTo).toISOString().slice(0, 10),
      isActive: offer.isActive.toString(),
    });
    setOfferId(offer._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const columns: Column<BankOffer>[] = [
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
      width: 150,
    },
    {
      Header: "Discount (%)",
      accessor: "discount",
      width: 80,
    },
    {
      Header: "Valid From",
      accessor: (row) => new Date(row.validFrom).toISOString().slice(0, 10),
      width: 100,
    },
    {
      Header: "Valid To",
      accessor: (row) => new Date(row.validTo).toISOString().slice(0, 10),
      width: 100,
    },
    {
      Header: "Status",
      accessor: "isActive",
      Cell: ({ value }) => (
        <span style={{ color: value ? "green" : "red" }}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
      width: 80,
    },
    {
      Header: "Actions",
      accessor: "_id",
      Cell: ({ row }) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={() => handleDeleteBankOffer(row.original)}
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
            onClick={() => handleEditBankOffer(row.original)}
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
            <Title>All Bank Offers</Title>
            <UserCount>({bankOffers.length})</UserCount>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SearchInput type="text" placeholder="Search bank offers..." />
              <AddUserButton
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    title: "",
                    description: "",
                    discount: "",
                    validFrom: "",
                    validTo: "",
                    isActive: "true",
                  });
                  handleShowModal();
                }}
                disabled={isSaving || isDeleting}
              >
                Add Bank Offer
              </AddUserButton>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "#1a8797" }}>
                  {isEditing ? "Edit Bank Offer" : "Add New Bank Offer"}
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
                      placeholder="Enter offer title"
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
                      placeholder="Enter offer description"
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Discount (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      placeholder="Enter discount percentage"
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Valid From</Form.Label>
                    <Form.Control
                      type="date"
                      name="validFrom"
                      value={formData.validFrom}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Valid To</Form.Label>
                    <Form.Control
                      type="date"
                      name="validTo"
                      value={formData.validTo}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="isActive"
                      value={formData.isActive}
                      onChange={handleChange}
                      disabled={isSaving}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Form.Select>
                  </Form.Group>

                  <AddUserButton type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <ClipLoader color="#fff" size={20} />
                    ) : isEditing ? (
                      "Update Bank Offer"
                    ) : (
                      "Save Bank Offer"
                    )}
                  </AddUserButton>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        </HeaderSection>

        <TableContainer
          columns={columns}
          data={bankOffers}
          isPagination={true}
          iscustomPageSize={true}
          className="table-responsive"
        />
      </Container>
    </div>
  );
};

export default BankOffer;
