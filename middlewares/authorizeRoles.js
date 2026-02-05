import { apiResponse } from "../utils/apiResponse.js";

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json(
          new apiResponse(
            403,
            null,
            "You are not allowed to access this resource"
          )
        );
    }
    next();
  };
};

export default authorizeRoles;