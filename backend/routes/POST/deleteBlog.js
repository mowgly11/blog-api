import database from "../../database/blogsCollectionActions.js";
import Middleware from "../../middleware/middleware.js";
import utils from "../../utils/responseModel.js";
import { postsCache } from "../../index.js";

export default {
  methods: ["delete"],
  endpoint: "/api/delete_blog",
  middleware: [Middleware.requireJSONContent, Middleware.checkAuthenticated],
  Delete: async function (req, res, next) {
    let id = req.body.id;
    if (!id || id.trim() === '')
      return res.status(400).json(utils.getResponseVariables(400, "Missing required field (id)"));

    const deleteBlog = await database.delete(id);

    if (!deleteBlog && deleteBlog != null)
      return res.status(404).json(utils.getResponseVariables(404, "No blog was found with this ID", null));

    let allBlogs;

    if (!postsCache.get("blogs")) {
      allBlogs = await database.findMultiple();
      postsCache.set("blogs", allBlogs);
    } else allBlogs = postsCache.get('blogs');

    let blogIndex = allBlogs.findIndex(doc => doc.id === id);
    if(blogIndex !== -1) allBlogs.splice(blogIndex, 1);

    postsCache.set('blogs', allBlogs);

    if (deleteBlog == null) return res.status(500).json(utils.getResponseVariables(500, "Internal Server Error", null));

    res.json(utils.getResponseVariables(200));
  },
};