import type {
  ServerResponse,
  ProductResponse,
  Pagination,
  PageResponse,
} from "~/types";
import client from "~/api/request";

const getAllProduct = (): ServerResponse<ProductResponse[]> =>
  client.get("/v1/products");

const getPageProduct = (
  params: Pagination
): ServerResponse<PageResponse<ProductResponse>> =>
  client.get("/v1/products/p", { params });

const getOneProduct = (id: number): ServerResponse<ProductResponse> =>
  client.get(`/v1/products/${id}`);

export { getAllProduct, getPageProduct, getOneProduct };
