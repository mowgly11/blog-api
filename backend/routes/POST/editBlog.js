import database from "../../database/databaseActions.js";
import utils from "../../utils/utils.js";

export default {
  methods: ["post"],
  endpoint: "/edit_blog",
  Post: async function (req, res, next) {
    if (!req.body.id || !req.body.props)
      return res.json(utils.makeResponseVariables(400, "Bad Request"));

    const blogToModify = await database.update(req.body.id, req.body.props);

    res.json(
      utils.makeResponseVariables(200, null, {
        data: {
          before: blogToModify.beforeModifictions,
          after: blogToModify.foundBlog,
        },
      })
    );
  },
};
