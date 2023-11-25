import type { AxiosResponse } from "axios";

export type ServerResponse<T> = Promise<AxiosResponse<T>>;

export interface TokenPayload {
  sub: string;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
  email: string;
}

// request

export interface LoginRequest {
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
  product: ProductResponse;
}

export interface ProductResponse {
  id: number;
  name: string;
  options: OptionResponse[];
}

export interface OptionResponse {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderResponse {
  orderId: number;
  address: AddressResponse;
  items: OrderItemResponse[];
  totalPay: number;
  status: string;
  time: string;
  payExpire: number;
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
  optionId: number;
  optionName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface PayOrderResponse {
  orderId: string;
  url: string;
}
