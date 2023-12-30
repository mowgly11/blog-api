import requestIP from "request-ip";

const allowedIPs = [process.env.UI_SERVER_IP, process.env.ADMIN_IP];

class AuthorisationMiddlewares {
  checkForIPAuthorisation(req, res, next) {
    let ip = requestIP.getClientIp(req);
    if (allowedIPs.indexOf(ip) === -1)
      return res.json({ status: 401, message: "Unauthorized", ip });
    else next();
  }
}

export default new AuthorisationMiddlewares();