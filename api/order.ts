import type {
  ServerResponse,
  CreateOrderRequest,
  OrderResponse,
  PayOrderRequest,
} from "~/types";
import client from "~/api/request";

const getAllOrder = (): ServerResponse<OrderResponse[]> =>
  client.get("/v1/orders");
const getOneOrder = (id: string): ServerResponse<OrderResponse> =>
  client.get(`/v1/orders/${id}`);

const createOrder = (
  body: CreateOrderRequest[]
): ServerResponse<OrderResponse> => client.post("/v1/orders", body);

const cancelOrder = (id: number): ServerResponse<void> =>
  client.put(`/v1/orders/cancel/${id}`);

const payOrder = (body: PayOrderRequest): ServerResponse<void> =>
  client.put(`/v1/orders/pay`, body);

export { getAllOrder, getOneOrder, createOrder, cancelOrder, payOrder };
