import axios from "axios";
import { API_URL } from "./brandService";

export const createqrcodeData = async (qrcodeData: any) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.post(`${API_URL}/createqrCode`, qrcodeData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating QR code:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to create QR code"
      );
    }
    throw new Error("Failed to create QR code");
  }
};

// export const getqrcodeData = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/getqrCode`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching QR code data:", error);
//     throw error;
//   }
// };

export const getqrcodeData = async (page: number = 1, limit: number = 20) => {
  try {
    const response = await axios.get(`${API_URL}/getqrCode`, {
      params: { page, limit },
    });
    console.log("response from get qr code api", response);
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
    brand: string;
  },
  qrCodeId: string
): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token used for request:", token);
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.put(
      `${API_URL}/updateQRCode/${qrCodeId}`,
      qrCodeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Error updating QR Code";
    console.error("Error updating QR Code:", error);
    throw new Error(errorMessage);
  }
};

export const deleteQRCodeData = async (qrCodeId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.delete(`${API_URL}/deleteqrCode/${qrCodeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting store:", error);
    throw error;
  }
};

export const bulkUploadQRCodes = async (file: File) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL}/qrcodes/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response from qr code csv ", response);
    return response.data;
  } catch (error: any) {
    console.error("Error uploading QR codes:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to upload QR codes"
      );
    }
    throw new Error("Failed to upload QR codes");
  }
};
