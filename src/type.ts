export interface Campaigns {
  _id: string;
  isBlocked: boolean;
  isActive: boolean;
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  image_url: File | null;
  action: string;
  imagePreview: string | null;
  status: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

export interface Stores {
  _id: string;
  isBlocked: boolean;
  isActive: boolean;
  id: number;
  storeName: string;
  location: Location;
  __v: number;
  description: string;
  action: string;
  status: string;
}

export interface Campaigns {
  _id: string;
  isBlocked: boolean;
  isActive: boolean;
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  image_url: File | null;
  action: string;
  imagePreview: string | null;
  status: string;
}

export interface Promotions {
  _id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  points_required: string;
  active: boolean;
  stores: string[]; // Assuming stores is an array of strings
  image?: File | null; // Optional if the image may not be present
}

export type QRCode = {
  _id: string;
  code: string;
  points: number;
  isUsed: boolean;
};

export type QRCodeResponse = {
  qrCode: QRCode;
};
