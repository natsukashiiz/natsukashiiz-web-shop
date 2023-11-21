import type { ServerResponse, CartRequest, CartResponse } from "~/types";
import client from "~/api/request";

const getAllCart = (): ServerResponse<CartResponse[]> => client.get("/v1/cart");

const addCart = (body: CartRequest): ServerResponse<CartResponse> =>
  client.put("/v1/cart", body);

const deleteCart = (id: number): ServerResponse<CartResponse> =>
  client.delete(`/v1/cart/${id}`);

export { getAllCart, addCart, deleteCart };
