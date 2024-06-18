import type { AxiosResponse } from "axios";
import type { DiscountType } from "./enum";

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
  sort?: string;
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
  selected: boolean;
}

export interface PayOrderRequest {
  source: string;
  orderId: string;
}

export interface CreateOrderRequest {
  voucherId?: number;
  orderItems: CartRequest[];
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

export interface CartItemResponse {
  id: number;
  productId: number;
  productName: string;
  optionId: number;
  optionName: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  product: ProductResponse;
  selected: boolean;
}

export interface CartResponse {
  items: CartItemResponse[];
  countSelected: number;
  totalQuantity: number;
  totalSelectedQuantity: number;
  totalPrice: number;
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
  reviews: number;
  rating: number;
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
  totalDiscount: number;
  actualPay: number;
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
  categoryId: number;
  categoryName: string;
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
  thumbnail: string;
}

export interface ProfileResponse {
  id: number;
  email: string;
  createdAt: string;
}

export interface ProductReviewResponse {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  profile: ProfileResponse;
}

export interface CreateProductReviewRequest {
  content?: string;
  rating: number;
}

export interface ProductViewHistoryResponse {
  id: number;
  createdAt: string;
  product: ProductResponse;
}

export interface LoginHistoryResponse {
  id: number;
  ip: string;
  userAgent: string;
  device: string;
  os: string;
  createdAt: string;
}

export interface ProductFavoriteResponse {
  id: number;
  createdAt: string;
  product: ProductResponse;
}

export interface VoucherResponse {
  id: number;
  code: string;
  discount: number;
  discountType: DiscountType;
  maxDiscount: number;
  minOrderPrice: number;
  quantity: number;
  description: string;
  product: ProductResponse;
  category: CategoryResponse;
  beginAt: string;
  expiredAt: string;
  claimed: boolean;
}

export interface CheckoutRequest {
  voucherId?: number;
}
