import database from "../../database/blogsCollectionActions.js";
import Middleware from "../../middleware/middleware.js";
import utils from "../../utils/responseModel.js";
import sanitize from "sanitize-html";

export default {
  methods: ["post"],
  endpoint: "/add_blog",
  middleware: [Middleware.requireJSONContent, Middleware.checkAuthenticated],
  Post: async function (req, res, next) {
    let { title, author, content } = req.body;
    if (!title || !author || !content)
      return res.status(400).json(utils.getResponseVariables(400, 'Missing required fields (title, author, content)', null));

    title = sanitize(title).trim();
    author = sanitize(author).trim();
    content = sanitize(content, {
      allowedTags: ['b', 'i', 'string', 'a', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'em', 'img'],
      allowedAttributes: {
        'a': ['href'],
        'img': ['src', 'alt']
      }
    }).trim();

    if (title === "" || author === "" || content === "")
      return res.json(utils.status(400).getResponseVariables(400, "invalid/empty fields", null));

    const createBlog = await database.create({
      title,
      author,
      content,
    });

    if (!createBlog)
      return res.json(utils.status(500).getResponseVariables(500, "Internal Server Error"));

    res.json(utils.getResponseVariables(200, null, createBlog.id));
  },
};
