import type { ServerResponse, LoginRequest, TokenResponse } from "~/types";
import { create } from "~/api/request";

const client = create();

const login = (body: LoginRequest): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/login", body);

export { login };
