import database from "../../database/blogsCollectionActions.js";
import Middleware from "../../middleware/middleware.js";
import utils from "../../utils/responseModel.js";
import sanitize from "sanitize-html";
import { postsCache } from "../../index.js";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), 'config.json');
const sanitizationConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

export default {
  methods: ["post"],
  endpoint: "/api/add_blog",
  middleware: [Middleware.requireJSONContent, Middleware.checkAuthenticated],
  Post: async function (req, res, next) {
    let { title, author, content } = req.body;
    if (!title || !author || !content)
      return res.status(400).json(utils.getResponseVariables(400, 'Missing required fields (title, author, content)', null));

    title = sanitize(title).trim();
    author = sanitize(author).trim();
    content = sanitize(content, {
      allowedTags: sanitizationConfig.allowedTags,
      allowedAttributes: sanitizationConfig.allowedAttributes,
      allowedStyles: sanitizationConfig.allowedStyles,
      allowedClasses: sanitizationConfig.allowedClasses
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

    let allBlogs;

    if (!postsCache.get("blogs")) {
      allBlogs = await database.findMultiple();
      postsCache.set("blogs", allBlogs);
    } else allBlogs = postsCache.get('blogs');

    allBlogs.push(createBlog);

    await createBlog.save();

    postsCache.set('blogs', allBlogs);

    res.json(utils.getResponseVariables(200, null, createBlog.id));
  },
};
