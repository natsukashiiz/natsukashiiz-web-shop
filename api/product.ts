import type {
  ServerResponse,
  ProductResponse,
  Pagination,
  PageResponse,
  QueryProductRequest,
  ProductReviewResponse,
  CreateProductReviewRequest,
  ProductViewHistoryResponse,
  ProductFavoriteResponse,
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

const getViewHistory = (
  params: Pagination
): ServerResponse<PageResponse<ProductViewHistoryResponse>> =>
  client.get("/v1/products/view-history", { params });

const getProductFavorite = (
  params: Pagination
): ServerResponse<PageResponse<ProductFavoriteResponse>> =>
  client.get("/v1/products/favorites", { params });

const isProductFavorite = (id: number): ServerResponse<boolean> =>
  client.get(`/v1/products/${id}/favorites`);

const createProductFavorite = (id: number): ServerResponse<void> =>
  client.post(`/v1/products/${id}/favorites`);

const deleteProductFavorite = (id: number): ServerResponse<void> =>
  client.delete(`/v1/products/${id}/favorites`);

export {
  getAllProduct,
  getPageProduct,
  getOneProduct,
  getProduct,
  getProductReview,
  createProductReview,
  getViewHistory,
  getProductFavorite,
  isProductFavorite,
  createProductFavorite,
  deleteProductFavorite,
};
