import baseService from "./baseService";
import { GET } from "../config/URLs";

export default new (class extends baseService {
  // @note uncomment if public registration is available
  /* register(params) {
    return this.submitRequestWithPromise(POST, "/register/create", params);
  } */

  getUserInfo = () => {
    return this.submitRequestWithPromise(GET, "/user");
  };
})();
