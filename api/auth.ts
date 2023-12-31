import type {
  ServerResponse,
  LoginRequest,
  SignupRequest,
  GoogleLoginRequest,
  TokenResponse,
} from "~/types";
import { create } from "~/api/request";

const client = create();

const login = (body: LoginRequest): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/login", body);

const google = (body: GoogleLoginRequest): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/google", body);

const singup = (body: SignupRequest): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/signUp", body);

export { login, google, singup };
