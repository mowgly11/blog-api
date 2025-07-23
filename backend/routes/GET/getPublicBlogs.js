import database from "../../database/blogsCollectionActions.js";
import utils from "../../utils/responseModel.js";
import { postsCache } from "../../index.js";

export default {
  methods: ["get"],
  endpoint: "/api/get_public_blogs",
  Get: async function (req, res, next) {
    let allBlogs;

    if (!postsCache.get("blogs")) {
      allBlogs = await database.findMultiple();
      postsCache.set("blogs", allBlogs);
    } else allBlogs = postsCache.get('blogs');

    allBlogs = allBlogs.filter(v => v.visible); // only get visible posts

    res.json(utils.getResponseVariables(200, null, { blogs: allBlogs, length: allBlogs.length }));
  },
};