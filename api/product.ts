import type {
  ServerResponse,
  ProductResponse,
  Pagination,
  PageResponse,
  QueryProductRequest,
  ProductReviewResponse,
  CreateProductReviewRequest,
} from "~/types";
import client from "~/api/request";

const getAllProduct = (): ServerResponse<ProductResponse[]> =>
  client.get("/v1/products/all");

const getPageProduct = (
  params: Pagination
): ServerResponse<PageResponse<ProductResponse>> =>
  client.get("/v1/products/p", { params });

const getOneProduct = (id: number): ServerResponse<ProductResponse> =>
  client.get(`/v1/products/${id}`);

const getProduct = (
  params: QueryProductRequest
): ServerResponse<PageResponse<ProductResponse>> =>
  client.get("/v1/products", { params });

const getProductReview = (
  id: number,
  params: Pagination
): ServerResponse<PageResponse<ProductReviewResponse>> =>
  client.get(`/v1/products/${id}/reviews`, { params });

const createProductReview = (
  id: number,
  data: CreateProductReviewRequest
): ServerResponse<void> => client.post(`/v1/products/${id}/reviews`, data);

export {
  getAllProduct,
  getPageProduct,
  getOneProduct,
  getProduct,
  getProductReview,
  createProductReview,
};
