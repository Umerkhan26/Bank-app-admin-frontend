import axios from "axios";

export const createqrcodeData = async (qrcodeData: any) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/api/createqrCode",
      qrcodeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response of create post", response);
    return response.data;
  } catch (error) {
    console.error("Error creating QR code:", error);
    throw error;
  }
};

export const getqrcodeData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/getqrCode");
    return response.data;
  } catch (error) {
    console.error("Error fetching QR code data:", error);
    throw error;
  }
};

export const updateQRCodeData = async (
  qrCodeData: {
    code: string;
    points: number;
    isUsed: boolean;
  },
  qrCodeId: string
): Promise<any> => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from local storage

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.put(
      `http://localhost:3000/api/updateQRCode/${qrCodeId}`,
      qrCodeData, // Send QR Code data as JSON
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to request header
        },
      }
    );

    return response.data; // Assuming the backend sends the updated QR Code in the response
  } catch (error) {
    console.error("Error updating QR Code:", error);
    throw new Error("Error updating QR Code");
  }
};

export const deleteQRCodeData = async (qrCodeId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.delete(
      `http://localhost:3000/api/deleteqrCode/${qrCodeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting store:", error);
    throw error;
  }
};
