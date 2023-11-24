import type {
  ServerResponse,
  AddressResponse,
  CreateAddressRequest,
} from "~/types";
import client from "~/api/request";

const getAllAddress = (): ServerResponse<AddressResponse[]> =>
  client.get("/v1/addresses");

const setMainAddress = (id: number): ServerResponse<AddressResponse> =>
  client.patch(`/v1/addresses/main/${id}`);

const createAddress = (
  data: CreateAddressRequest
): ServerResponse<AddressResponse> => client.post("/v1/addresses", data);

export { getAllAddress, setMainAddress, createAddress };
