import type { ServerResponse, FileStoreRequest } from "~/types";
import client from "~/api/request";

const uploadFile = (form: FormData): ServerResponse<void> =>
  client.post("/v1/files", form);

export { uploadFile };
