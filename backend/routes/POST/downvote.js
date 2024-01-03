import database from "../../database/databaseActions.js";
import utils from "../../utils/utils.js";

export default {
  methods: ["post"],
  endpoint: "/downvote",
  Post: async function (req, res, next) {
    if (!req.body.id)
      return res.json(utils.getResponseVariables(400, "Bad Request"));

    const downVoted = await database.downVote(req.body.id);
    if(!downVoted) return res.json(utils.getResponseVariables(502, "Database Error"));

    res.json(utils.getResponseVariables(200));
  },
};
