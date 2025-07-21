import database from "../../database/blogsCollectionActions.js";
import utils from "../../utils/responseModel.js";
import Middleware from "../../middleware/middleware.js";

export default {
    methods: ["patch"],
    endpoint: "/api/hide_blog",
    middleware: [Middleware.requireJSONContent, Middleware.checkAuthenticated],
    Patch: async function (req, res, next) {
        let id = req.body.id;
    
        if(!id || id.trim() === "") return res.status(400).json(utils.getResponseVariables(400, 'Missing required fields (id)'));

        let blogVisible = await database.changeBlogVisibility(id, false);
        if(!blogVisible) return res.status(404).json(utils.getResponseVariables(404, 'No blog was found with that ID'));

        res.json(utils.getResponseVariables(200));
    },
};