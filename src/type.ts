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
