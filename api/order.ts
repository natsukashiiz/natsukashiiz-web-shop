import type {
  ServerResponse,
  CreateOrderRequest,
  OrderResponse,
  PayOrderRequest,
  PayOrderResponse,
  QueryOrderRequest,
  CheckoutRequest,
  CheckoutResponse,
} from "~/types";
import client from "~/api/request";

const getAllOrder = (
  params: QueryOrderRequest
): ServerResponse<OrderResponse[]> => client.get("/v1/orders", { params });

const getOneOrder = (id: string): ServerResponse<OrderResponse> =>
  client.get(`/v1/orders/${id}`);

const createOrder = (body: CreateOrderRequest): ServerResponse<OrderResponse> =>
  client.post("/v1/orders", body);

const cancelOrder = (id: string): ServerResponse<void> =>
  client.put(`/v1/orders/cancel/${id}`);

const payOrder = (body: PayOrderRequest): ServerResponse<PayOrderResponse> =>
  client.put(`/v1/orders/pay`, body);

const checkout = (body: CheckoutRequest): ServerResponse<CheckoutResponse> =>
  client.post("/v1/orders/checkout", body);

export {
  getAllOrder,
  getOneOrder,
  createOrder,
  cancelOrder,
  payOrder,
  checkout,
};
