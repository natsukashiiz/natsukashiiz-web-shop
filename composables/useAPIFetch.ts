// composables/useAPIFetch.ts

import { useFetch } from "#app";

type useFetchType = typeof useFetch;

// wrap useFetch with configuration needed to talk to our API
export const useAPIFetch: useFetchType = (path, options = {}) => {
  const config = useRuntimeConfig();

  // modify options as needed
  options.baseURL = config.public.apiUrl as string;
  return useFetch(path, options);
};
