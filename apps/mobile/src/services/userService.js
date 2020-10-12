import base_service from "./base_service";
import { POST } from "../Config/URLs";

export default new class extends base_service {
    register(params) {
        return this.submitRequestWithPromise(POST, '/register/create', params)
    }
}
