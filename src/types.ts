export type ProjectCategory = 'Roofing' | 'Siding' | 'Gutters' | 'Decks' | 'Remodeling';

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: ProjectCategory;
  date: string;
  time: string;
  notes: string;
  location: string;
  status: 'Confirmed' | 'Completed' | 'Pending';
  timestamp: string;
}

export interface ConsultationRequest {
  category: ProjectCategory;
  description: string;
  budget: 'Classic Premium' | 'Elite Heavy-Duty' | 'Premium Luxury';
  dimensions: string;
  location: string;
}

export interface ServiceDetail {
  id: ProjectCategory;
  title: string;
  tagline: string;
  description: string;
  duration: string;
  materials: string[];
  climateFeature: string;
  image: string;
}
