import type {
  ServerResponse,
  ChagePasswordRequest,
  PageResponse,
  LoginHistoryResponse,
  Pagination,
} from "~/types";
import client from "~/api/request";

const profile = (): ServerResponse<string> => client.get("/profile/profile");

const changePassword = (data: ChagePasswordRequest): ServerResponse<void> =>
  client.post("/v1/profile/change-password", data);

const getLoginHistory = (
  params: Pagination
): ServerResponse<PageResponse<LoginHistoryResponse>> =>
  client.get("/v1/profile/login-history", { params });

export { profile, changePassword, getLoginHistory };
