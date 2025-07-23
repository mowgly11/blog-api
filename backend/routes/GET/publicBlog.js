import database from "../../database/blogsCollectionActions.js";
import utils from "../../utils/responseModel.js";
import { postsCache } from "../../index.js";

export default {
    methods: ["get"],
    endpoint: "/api/public_blog/:id",
    Get: async function (req, res, next) {
        let id = req.params.id;
        if (!id || id.trim() === "") return res.status(400).json(utils.getResponseVariables(400, 'Missing required fields (id)'));

        let foundBlog;
        let allBlogs;

        if (!postsCache.get("blogs")) {
            allBlogs = await database.findMultiple();
            postsCache.set("blogs", allBlogs);
        } else allBlogs = postsCache.get('blogs');

        foundBlog = allBlogs.find(doc => doc.id === id && doc.visible);

        if (!foundBlog) return res.status(404).json(utils.getResponseVariables(404, 'No blog was found with the specified ID'));

        res.status(200).json(utils.getResponseVariables(200, null, foundBlog));
    },
};