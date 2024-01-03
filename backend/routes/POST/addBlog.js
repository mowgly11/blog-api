import database from "../../database/databaseActions.js";
import utils from "../../utils/utils.js";

export default {
  methods: ["post"],
  endpoint: "/add_blog",
  Post: async function (req, res, next) {
    if (!req.body.title || !req.body.author || !req.body.content)
      return res.json(utils.getResponseVariables(400, 'Bad Request'));

    const createDocument = await database.create({
      title: req.body.title,
      author: req.body.author,
      content: req.body.content,
    });

    if (!createDocument)
      res.json(utils.getResponseVariables(502, "Database Error"));
    else res.json(utils.getResponseVariables(200));
  },
};
