import database from "../../database/databaseActions.js";
import utils from "../../utils/utils.js";

export default {
  methods: ["post"],
  endpoint: "/upvote",
  Post: async function (req, res, next) {
    if (!req.body.id)
      return res.json(utils.makeResponseVariables(400, "Bad Request"));

    const upvoted = await database.upVote(req.body.id);
    if(!upvoted) return res.json(utils.makeResponseVariables(502, "Database Error"));

    res.json(utils.makeResponseVariables(200));
  },
};
