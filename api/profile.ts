import type {
  ServerResponse,
  ChagePasswordRequest,
  PageResponse,
  LoginHistoryResponse,
  Pagination,
  ProfileResponse,
  UpdateProfileRequest,
} from "~/types";
import client from "~/api/request";

const queryProfile = (): ServerResponse<ProfileResponse> =>
  client.get("/v1/profile");

const updateProfile = (
  data: UpdateProfileRequest
): ServerResponse<ProfileResponse> => client.put("/v1/profile", data);

const changePassword = (data: ChagePasswordRequest): ServerResponse<void> =>
  client.patch("/v1/profile/change-password", data);

const getLoginHistory = (
  params: Pagination
): ServerResponse<PageResponse<LoginHistoryResponse>> =>
  client.get("/v1/profile/login-history", { params });

const deleteAccount = (): ServerResponse<void> => client.delete("/v1/profile");
const deleteAvatar = (): ServerResponse<ProfileResponse> =>
  client.delete("/v1/profile/avatar");

export {
  queryProfile,
  updateProfile,
  changePassword,
  getLoginHistory,
  deleteAccount,
  deleteAvatar,
};
