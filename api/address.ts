import type { ServerResponse, AddressResponse } from "~/types";
import client from "~/api/request";

const getAllAddress = (): ServerResponse<AddressResponse[]> =>
  client.get("/v1/addresses");

const setMainAddress = (id: number): ServerResponse<AddressResponse> =>
  client.patch(`/v1/addresses/main/${id}`);

export { getAllAddress, setMainAddress };
