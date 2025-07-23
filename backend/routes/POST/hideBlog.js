import database from "../../database/blogsCollectionActions.js";
import utils from "../../utils/responseModel.js";
import Middleware from "../../middleware/middleware.js";
import { postsCache } from "../../index.js";

export default {
    methods: ["patch"],
    endpoint: "/api/hide_blog",
    middleware: [Middleware.requireJSONContent, Middleware.checkAuthenticated],
    Patch: async function (req, res, next) {
        let id = req.body.id;

        if (!id || id.trim() === "") return res.status(400).json(utils.getResponseVariables(400, 'Missing required fields (id)'));

        let blogVisible = await database.changeBlogVisibility(id, false);


        if (!blogVisible) return res.status(404).json(utils.getResponseVariables(404, 'No blog was found with that ID'));

        let allBlogs;

        if (!postsCache.get("blogs")) {
            allBlogs = await database.findMultiple();
            postsCache.set("blogs", allBlogs);
        } else {
            allBlogs = postsCache.get('blogs');

            let postIndex = allBlogs.findIndex(doc => doc.id === id);

            if (postIndex !== -1) allBlogs[postIndex].visible = false;

            postsCache.set('blogs', allBlogs);
        }

        res.json(utils.getResponseVariables(200));
    },
};