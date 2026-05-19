export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  address?: Address;
  wishlist?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  category: string;
  brand: string;
  ratings: Rating[];
  averageRating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  _id: string;
  user: User | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  user: User | string;
  products: OrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product | string;
  quantity: number;
  price: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    products?: T[];
    orders?: T[];
    users?: T[];
    totalPages: number;
    currentPage: number;
    totalProducts?: number;
    totalOrders?: number;
    totalUsers?: number;
  };
}
