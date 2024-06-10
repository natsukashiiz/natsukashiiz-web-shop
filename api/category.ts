import type { ServerResponse, CategoryResponse } from "~/types";
import client from "~/api/request";

const getAllCategory = (): ServerResponse<CategoryResponse[]> =>
  client.get("/v1/categories");

export { getAllCategory };
