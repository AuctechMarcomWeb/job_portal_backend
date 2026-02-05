import { Router } from "express";
import {
  registerOrLogin,
  resendOtp,
  verifyOtp,
} from "../controllers/authController.js";
// import { verifyJWT,} from "../middlewares/verifyJWT.js";

const routes = Router();


// auth
routes.post("/registerOrLogin", registerOrLogin);
routes.post("/verifyOtp", verifyOtp);
routes.post("/resendOtp", resendOtp);

export default routes;
