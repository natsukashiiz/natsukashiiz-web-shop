import type { ServerResponse, ProductResponse } from "~/types";
import client from "~/api/request";

const getAllProduct = (): ServerResponse<ProductResponse[]> =>
  client.get("/v1/products");

const getOneProduct = (id: number): ServerResponse<ProductResponse> =>
  client.get(`/v1/products/${id}`);

export { getAllProduct, getOneProduct };
