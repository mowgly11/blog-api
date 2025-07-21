import Middleware from "../../middleware/middleware.js";
import utils from "../../utils/responseModel.js";

export default {
  methods: ["get"],
  endpoint: "/dashboard",
  middleware: [Middleware.checkAuthenticated],
  Get: async function (req, res, next) {
    res.json(utils.getResponseVariables(200));
  },
};