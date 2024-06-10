import type { ServerResponse, CarouselResponse } from "~/types";
import client from "~/api/request";

const getAllCarousel = (): ServerResponse<CarouselResponse[]> =>
  client.get("/v1/carousels");

export { getAllCarousel };
