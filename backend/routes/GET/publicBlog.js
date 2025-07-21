import database from "../../database/blogsCollectionActions.js";
import Middleware from "../../middleware/middleware.js";
import utils from "../../utils/responseModel.js";
import Utils from '../../utils/responseModel.js';

export default {
    methods: ["get"],
    endpoint: "/public_blog/:id",
    Get: async function (req, res, next) {
        let id = req.params.id;
        if (!id || id.trim() === "") return res.status(400).json(utils.getResponseVariables(400, 'Missing required fields (id)'));

        let foundBlog = await database.find(id, true);
        if (!foundBlog) return res.status(404).json(utils.getResponseVariables(404, 'No blog was found with the specified ID'));

        res.status(200).json(Utils.getResponseVariables(200, null, foundBlog));
    },
};