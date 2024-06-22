import type {
  ServerResponse,
  LoginRequest,
  SignupRequest,
  GoogleLoginRequest,
  TokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
} from "~/types";
import { create } from "~/api/request";

const client = create();

const login = (body: LoginRequest): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/login", body);

const google = (body: GoogleLoginRequest): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/google", body);

const singup = (body: SignupRequest): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/sign-up", body);

const refresh = (body: RefreshTokenRequest): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/refresh", body);

const sendVerifyCode = (): ServerResponse<string> =>
  client.post("/v1/auth/code");

const confirmVerifyCode = (code: string): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/verify/" + code);

const forgotPassword = (data: ForgotPasswordRequest): ServerResponse<void> =>
  client.post("/v1/auth/forgot-password", data);

const resetPassword = (
  data: ResetPasswordRequest
): ServerResponse<TokenResponse> =>
  client.patch("/v1/auth/reset-password", data);

export {
  login,
  google,
  singup,
  refresh,
  sendVerifyCode,
  confirmVerifyCode,
  forgotPassword,
  resetPassword,
};
