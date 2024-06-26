import type {
  ServerResponse,
  FileStoreRequest,
  FileStoreResponse,
} from "~/types";
import client from "~/api/request";

const uploadFile = (form: FormData): ServerResponse<FileStoreResponse> =>
  client.post("/v1/files", form);

export { uploadFile };
