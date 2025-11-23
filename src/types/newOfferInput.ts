export type CreateOfferInput = {
  fixerId: string;
  fixerName: string;
<<<<<<< HEAD
  title?: string;
=======
>>>>>>> pr-26
  description: string;
  services: string[];
  whatsapp: string;
  price: number;
  city: string;
  photos?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
};