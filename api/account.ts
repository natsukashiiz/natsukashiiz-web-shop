import type {
  ServerResponse,
  ChagePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  TokenResponse,
} from "~/types";
import client from "~/api/request";

const profile = (): ServerResponse<string> => client.get("/account/profile");

const sendVerifyCode = (): ServerResponse<string> =>
  client.post("/v1/account/code");

const confirmVerifyCode = (code: string): ServerResponse<TokenResponse> =>
  client.post("/v1/account/verify/" + code);

const changePassword = (data: ChagePasswordRequest): ServerResponse<void> =>
  client.post("/v1/account/change-password", data);

const forgotPassword = (data: ForgotPasswordRequest): ServerResponse<void> =>
  client.post("/v1/account/forgot-password", data);

const resetPassword = (
  data: ResetPasswordRequest
): ServerResponse<TokenResponse> =>
  client.patch("/v1/account/reset-password", data);

export {
  profile,
  sendVerifyCode,
  confirmVerifyCode,
  changePassword,
  forgotPassword,
  resetPassword,
};
