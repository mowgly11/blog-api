import sanitize from "sanitize-html";
import database from "../../database/authCollectionActions.js";
import Middleware from "../../middleware/middleware.js";
import utils from "../../utils/responseModel.js";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger.js";
import requestIP from "request-ip";

export default {
    methods: ["post"],
    endpoint: "/api/login",
    middleware: [Middleware.requireJSONContent],
    Post: async function (req, res, next) {
        let username = req.body.username;
        let password = req.body.password;

        if (!username || !password || sanitize(username) === "" || sanitize(password) === "") return res.json(utils.getResponseVariables(401, 'Invalid username or password', null));

        let userAllowed = await database.validateCredentials(username, password);

        if (!userAllowed) {
            logger.error(`a failed logging attempt was initiated with these credentials: ${username} - ${password} | IP: ${requestIP.getClientIp(req)}`);
            return res.json(utils.getResponseVariables(401, 'Invalid username or password', null))
        };
        
        
        let token = jwt.sign({ id: userAllowed.id }, process.env.JWT_SECRET, { expiresIn: '1 day' });
        
        res.cookie('auth_token', token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 1000 * 60 * 60 * 24
        });
        
        logger.info(`a successful logging attempt was initiated with these credentials: ${username} - ${password} | IP: ${requestIP.getClientIp(req)}`);
        res.status(200).json(utils.getResponseVariables(200));
    },
};