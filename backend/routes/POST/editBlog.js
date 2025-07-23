import database from "../../database/blogsCollectionActions.js";
import utils from "../../utils/responseModel.js";
import Middleware from "../../middleware/middleware.js";
import sanitize from "sanitize-html";
import { postsCache } from "../../index.js";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), 'config.json');
const sanitizationConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

export default {
  methods: ["patch"],
  endpoint: "/api/edit_blog",
  middleware: [Middleware.requireJSONContent, Middleware.checkAuthenticated],
  Patch: async function (req, res, next) {
    let { id, title, author, content } = req.body;

    if (!id || !title || !author || !content)
      return res.status(400).json(utils.getResponseVariables(400, 'Missing required fields (id, title, author, content)', null));

    title = sanitize(title).trim();
    author = sanitize(author).trim();
    content = sanitize(content, {
      allowedTags: sanitizationConfig.allowedTags,
      allowedAttributes: sanitizationConfig.allowedAttributes,
      allowedStyles: sanitizationConfig.allowedStyles,
      allowedClasses: sanitizationConfig.allowedClasses
    }).trim();

    if (title === "" || author === "" || content === "")
      return res.json(utils.status(400).getResponseVariables(400, "Missing required fields (id, title, author, content)", null));

    const blogToModify = await database.update(id, { title, author, content });
    if (!blogToModify) return res.json(utils.getResponseVariables(404, "Blog not found"));

    let allBlogs;

    if (!postsCache.get("blogs")) {
      allBlogs = await database.findMultiple();
      postsCache.set("blogs", allBlogs);
    } else {
      allBlogs = postsCache.get('blogs');

      let postIndex = allBlogs.findIndex(doc => doc.id === id);

      if (postIndex !== -1) {
        allBlogs[postIndex].title = title;
        allBlogs[postIndex].author = author;
        allBlogs[postIndex].content = content;
      }

      postsCache.set('blogs', allBlogs);
    }

    res.json(
      utils.getResponseVariables(200, null, blogToModify)
    );
  },
};
