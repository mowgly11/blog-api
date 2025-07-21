import Utils from "../utils/utils.js";

class Middleware {
    static requireJSONContent(req, res, next) {
        if(!req.is('application/json')) return res.status(415).json(Utils.getResponseVariables(400, 'Only JSON content is allowed on this endpoint', null));
        next();
    }
}

export default Middleware;