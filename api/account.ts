import type {
  ServerResponse,
  ChagePasswordRequest,
  TokenResponse,
} from "~/types";
import client from "~/api/request";

const profile = (): ServerResponse<string> => client.get("/account/profile");

const sendVerifyCode = (): ServerResponse<string> =>
  client.post("/v1/account/code");

const confirmVerifyCode = (code: string): ServerResponse<TokenResponse> =>
  client.post("/v1/account/verify/" + code);

const changePassword = (data: ChagePasswordRequest): ServerResponse<string> =>
  client.post("/v1/account/password", data);

export { profile, sendVerifyCode, confirmVerifyCode, changePassword };
