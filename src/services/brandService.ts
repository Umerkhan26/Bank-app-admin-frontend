import axios from "axios";

export const API_URL = "http://localhost:3000/api";

export const createBrand = async (formData: FormData) => {
  const res = await axios.post(`${API_URL}/Createbrand`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getAllBrands = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAllBrands`);
    return response.data.brands;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const updateBrandStatus = async (id: string, isActive: boolean) => {
  const res = await axios.patch(`${API_URL}/updateBrandStatus/${id}/status`, {
    isActive,
  });
  return res.data;
};

// brandService.ts
export const updateBrand = async (id: string, formData: FormData) => {
  const res = await axios.put(`${API_URL}/updateBrand/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.updatedBrand;
};

export const deleteBrand = async (id: string) => {
  const res = await axios.delete(`${API_URL}/deleteBrand/${id}`);
  return res.data;
};
