import type {
  ServerResponse,
  ChagePasswordRequest,
  PageResponse,
  LoginHistoryResponse,
  Pagination,
  ProfileResponse,
} from "~/types";
import client from "~/api/request";

const queryProfile = (): ServerResponse<ProfileResponse> =>
  client.get("/v1/profile");

const changePassword = (data: ChagePasswordRequest): ServerResponse<void> =>
  client.patch("/v1/profile/change-password", data);

const getLoginHistory = (
  params: Pagination
): ServerResponse<PageResponse<LoginHistoryResponse>> =>
  client.get("/v1/profile/login-history", { params });

const deleteAccount = (): ServerResponse<void> => client.delete("/v1/profile");

export { queryProfile, changePassword, getLoginHistory, deleteAccount };
