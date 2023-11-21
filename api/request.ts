import axios from "axios";

/**
 * สร้างอินสแตนซ์ของ Axios โดยกำหนด URL หลักเป็นค่าจากตัว env VITE_API_BASEURL.
 * @returns อินสแตนซ์ของ Axios
 */
const create = () => {
  return axios.create({
    baseURL: "http://localhost:8080",
  });
};

const client = create();

export { client as default, create };
