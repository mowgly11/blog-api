import database from "../../database/blogsCollectionActions.js";
import utils from "../../utils/responseModel.js";
import Middleware from "../../middleware/middleware.js";

export default {
    methods: ["patch"],
    endpoint: "/api/unhide_blog",
    middleware: [Middleware.requireJSONContent, Middleware.checkAuthenticated],
    Patch: async function (req, res, next) {
        let id = req.body.id;
    
        if(!id || id.trim() === "") return res.status(400).json(utils.getResponseVariables(400, 'Missing required fields (id)'));

        let blogVisible = await database.changeBlogVisibility(id, true);
        if(!blogVisible) return res.status(500).json(utils.getResponseVariables(500, 'Internal Server Error'));

        res.json(utils.getResponseVariables(200));
    },
};