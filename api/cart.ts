import type { ServerResponse, CartRequest, CartResponse } from "~/types";
import client from "~/api/request";

const getAllCart = (): ServerResponse<CartResponse> => client.get("/v1/cart");

const updateCart = (body: CartRequest): ServerResponse<CartResponse> =>
  client.put("/v1/cart", body);

const deleteCart = (id: number): ServerResponse<CartResponse> =>
  client.delete(`/v1/cart/${id}`);

const getCountCart = (): ServerResponse<number> => client.get("/v1/cart/count");

export { getAllCart, updateCart, deleteCart, getCountCart };
