import type { AxiosResponse } from "axios";

export type ServerResponse<T> = Promise<AxiosResponse<T>>;

export interface TokenPayload {
  sub: string;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
  email: string;
  verified: boolean;
}

export interface PageResponse<T> {
  list: T[];
  total: number;
}

// request

export interface Pagination {
  page?: number;
  size?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface CartRequest {
  productId: number;
  optionId: number;
  quantity: number;
}

export interface PayOrderRequest {
  source: string;
  orderId: string;
}

export interface CreateOrderRequest {
  productId: number;
  optionId: number;
  quantity: number;
}

export interface CreateAddressRequest {
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
}

export interface UpdateAddressRequest {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  main?: boolean;
}

export interface QueryOrderRequest {
  status?: string;
}

export interface ChagePasswordRequest {
  current: string;
  latest: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  password: string;
}

// response

export interface TokenResponse {
  token: string;
}

export interface CartResponse {
  id: number;
  productId: number;
  productName: string;
  optionId: number;
  optionName: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  product: ProductResponse;
}

export interface QueryProductRequest extends Pagination {
  name?: string;
  description?: string;
  "category.id"?: number;
  "category.name"?: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  options: OptionResponse[];
  images: string[];
  category: CategoryResponse;
  views: number;
  orders: number;
  createdAt: string;
}

export interface OptionResponse {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderResponse {
  orderId: string;
  items: OrderItemResponse[];
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  totalPay: number;
  status: string;
  payUrl: string;
  payExpire: number;
  payMethod: string;
  paidAt: string;
  cancelAt: any;
  createdAt: string;
}

export interface AddressResponse {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  main: boolean;
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  productThumbnail: string;
  optionId: number;
  optionName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface PayOrderResponse {
  orderId: string;
  type: "LINK" | "IMAGE";
  url: string;
}

export interface NotificationResponse {
  id: number;
  type: string;
  eventId: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface CarouselResponse {
  title: string;
  imageUrl: string;
}

export interface QueryCategoryRequest {
  id?: number;
  name?: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
}
