import type {
  ServerResponse,
  AddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "~/types";
import client from "~/api/request";

const getAllAddress = (): ServerResponse<AddressResponse[]> =>
  client.get("/v1/addresses");

const getMainAddress = (): ServerResponse<AddressResponse> =>
  client.get("/v1/addresses/main");

const createAddress = (
  data: CreateAddressRequest
): ServerResponse<AddressResponse> => client.post("/v1/addresses", data);

const updateAddress = (
  data: UpdateAddressRequest
): ServerResponse<AddressResponse> => client.put(`/v1/addresses`, data);

const deleteAddress = (id: number): ServerResponse<void> =>
  client.delete(`/v1/addresses/${id}`);

export {
  getAllAddress,
  getMainAddress,
  createAddress,
  updateAddress,
  deleteAddress,
};
