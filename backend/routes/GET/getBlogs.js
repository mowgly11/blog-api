import database from "../../database/databaseActions.js";
import Utils from '../../utils/utils.js';

export default {
  methods: ["get"],
  endpoint: "/get_blogs?",
  Get: async function (req, res, next) {
    let from = req.query.from;
    let to = req.query.to;
    if (!from || !to) return res.json(Utils.getResponseVariables(400, 'missing query params (from, to)', null));
    if (isNaN(from) || isNaN(to)) return res.json(Utils.getResponseVariables(400, 'from and to need to be integers', null));
    from = parseInt(from);
    to = parseInt(to);
    if (from > to || from < 0 || to < 0 || to - from > 10) return res.json(Utils.getResponseVariables(400, 'from and to need to be positive integers and to value needs to be greater than from', null))

    const allBlogs = await database.findMultiple(from, to);
    res.json(Utils.getResponseVariables(200, null, { blogs: allBlogs, length: allBlogs.length }));
  },
};
