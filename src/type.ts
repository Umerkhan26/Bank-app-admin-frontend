// export interface Campaigns {
//   _id: string;
//   isBlocked: boolean;
//   isActive: boolean;
//   id: number;
//   title: string;
//   description: string;
//   start_date: string;
//   end_date: string;
//   image_url: File | null;
//   action: string;
//   imagePreview: string | null;
//   status: string;
// }

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
  brand:
    | {
        _id: string;
        brandName: string;
      }
    | string;
}

export interface StoreApiResponse {
  store: Stores;
  message: string;
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
  image_url: string | null; // ✅ Fix here
  action: string;
  imagePreview: string | null;
  enrolled_users: string[];
  status: string;
  brand: {
    _id: string;
    brandName: string;
  } | null; // ✅ To match actual object structure
  pointsRequired: string;
}

export interface Promotions {
  _id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  points_required: string;
  active: boolean;
  stores: string[];
  image_url?: string;
  brand?: { _id: string; brandName: string } | string;
}

export type PromotionTable = Promotions;

export type Brand = {
  _id: string;
  brandName: string;
};

export type QRCode = {
  _id?: string;
  code: string;
  points: number;
  isUsed: boolean;
  brand: Brand | string;
};

export type QRCodeResponse = {
  qrCode: QRCode;
  updatedQRCode?: QRCode;
};
