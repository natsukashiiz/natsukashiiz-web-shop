import type { ServerResponse, VoucherResponse } from "~/types";
import client from "~/api/request";

const queryVouchers = (): ServerResponse<VoucherResponse[]> =>
  client.get("/v1/vouchers");

const queryVoucherById = (id: number): ServerResponse<VoucherResponse> =>
  client.get(`/v1/vouchers/${id}`);

const claimVoucher = (id: number): ServerResponse<VoucherResponse> =>
  client.post(`/v1/vouchers/${id}/claim`);

export { queryVouchers, queryVoucherById, claimVoucher };
