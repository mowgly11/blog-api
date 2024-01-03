import database from "../../database/databaseActions.js";
import utils from "../../utils/utils.js";

export default {
  methods: ["post"],
  endpoint: "/edit_blog",
  Post: async function (req, res, next) {
    if (!req.body.id || !req.body.props || Object.keys(req.body.props).length === 0) 
      return res.json(utils.getResponseVariables(400, "Bad Request"));

    const blogToModify = await database.update(req.body.id, req.body.props);
    if(!blogToModify) return res.json(utils.getResponseVariables(502, "Database Error/Blog not found"));

    res.json(
      utils.getResponseVariables(200, null, {
        before: blogToModify.beforeModifictions,
        after: blogToModify.foundBlog,
      })
    );
  },
};
