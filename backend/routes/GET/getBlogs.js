import database from "../../database/blogsCollectionActions.js";
import Middleware from "../../middleware/middleware.js";
import utils from "../../utils/responseModel.js";
import Utils from '../../utils/responseModel.js';

export default {
  methods: ["get"],
  endpoint: "/get_blogs?",
  middleware: [Middleware.checkAuthenticated],
  Get: async function (req, res, next) {
    let from = req.query.from;
    let to = req.query.to;
    if (!from || !to) return res.status(400).json(Utils.getResponseVariables(400, 'missing query params (from, to)', null));
    if (isNaN(from) || isNaN(to)) return res.status(400).json(Utils.getResponseVariables(400, 'from and to need to be integers', null));
    from = parseInt(from);
    to = parseInt(to);
    if (from > to || from < 0 || to < 0) return res.status(400).json(Utils.getResponseVariables(400, 'from and to need to be positive integers and to value needs to be greater than from', null))
    if (to - from > process.env.MAX_BLOGS) return res.status(400).json(utils.getResponseVariables(400, 'you can only grab a maximum of ' + process.env.MAX_BLOGS + 'blogs at a time'));
    
    const allBlogs = await database.findMultiple(from, to);
    res.json(Utils.getResponseVariables(200, null, { blogs: allBlogs, length: allBlogs.length }));
  },
};