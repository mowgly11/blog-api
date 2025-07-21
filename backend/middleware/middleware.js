import logger from "../utils/logger.js";
import Utils from "../utils/responseModel.js";
import jwt from 'jsonwebtoken';
import database from '../database/authCollectionActions.js';

class Middleware {
    static requireJSONContent(req, res, next) {
        if (!req.is('application/json')) return res.status(415).json(Utils.getResponseVariables(400, 'Only JSON content is allowed on this endpoint', null));
        next();
    }

    static checkAuthenticated(req, res, next) {
        const cookie = req.cookies.auth_token;
        if (!cookie || cookie == 'undefined') return res.json(Utils.getResponseVariables(403, 'Invalid Authorization'))
        jwt.verify(cookie, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                res.json(Utils.getResponseVariables(403, 'Invalid Authorization'));
                return logger.error("middleware error when validating jwt token: " + err);
            }

            let userProfile = await database.findUserById(user.id);
            if (!userProfile) return res.json(Utils.getResponseVariables(403, 'Invalid Authorization'));
            req.user = userProfile;
            next();
        });
    }
}

export default Middleware;