import database from "../../database/databaseActions.js";
import Middleware from "../../middleware/middleware.js";
import utils from "../../utils/utils.js";
import sanitize from "sanitize-html";

export default {
  methods: ["post"],
  endpoint: "/add_blog",
  middleware: Middleware.requireJSONContent,
  Post: async function (req, res, next) {
    let { title, author, content } = req.body;
    if (!title || !author || !content)
      return res.json(utils.getResponseVariables(400, 'Missing required fields (title, author, content)', null));

    title = sanitize(title).trim();
    author = sanitize(author).trim();
    content = sanitize(content).trim();

    if (title === "" || author === "" || content === "") 
      return res.json(utils.getResponseVariables(400, "invalid/empty fields", null));

    const createBlog = await database.create({
      title,
      author,
      content,
    });

    if (!createBlog)
      res.json(utils.getResponseVariables(502, "Database Error"));
    else 
      res.json(utils.getResponseVariables(200));
  },
};
