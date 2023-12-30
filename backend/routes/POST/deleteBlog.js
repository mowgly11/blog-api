import database from "../../database/databaseActions.js";
import utils from "../../utils/utils.js";

export default {
  methods: ["post"],
  endpoint: "/delete_blog",
  Post: async function (req, res, next) {
    if (!req.body.props)
      return res.json(utils.makeResponseVariables(400, "Bad Request"));

    const deleteBlog = await database.delete(req.body.props);

    if (!deleteBlog)
      return res.json(utils.makeResponseVariables(502, "Database Error"));

    res.json(utils.makeResponseVariables(200));
  },
};
