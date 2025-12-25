export type Category = 'All' | 'Non-Veg Pickles' | 'Veg Pickles' | 'Sweets' | 'NV Dry Items' | 'Hot Items';

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number; // Base price for 1KG
  unit: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedWeight: '250g' | '500g' | '1kg';
  calculatedPrice: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  comment: string;
  rating: number;
  avatar: string;
}