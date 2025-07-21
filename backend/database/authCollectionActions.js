import logger from "../utils/logger.js";
import IDManager from "../utils/idGen.js";
import schema from "./schemas/auth_schema.js";
import bcrypt from 'bcrypt';

class AuthCollection {
    static async validateCredentials(username, password) {
        try {
            let user = await schema.findOne({ username });
            if (!user) return false;

            let passwordComp = await bcrypt.compare(password, user.password);
            if (!passwordComp) return false;

            return user;
        } catch (err) {
            logger.error(err);
            return null;
        }
    }

    static async findUserById(id) {
        try {
            let user = await schema.findOne({ id });
            if (!user) return false;

            return user;
        } catch(err) {
            logger.error(err);
            return null;
        }
    }

    static async createUser(username, password) {
        try {
            let user = await schema.create({
                id: IDManager.genUniqueID(16),
                username,
                password: await bcrypt.hash(password, 12),
                lastLoggedIn: Date.now(),
            });

            await user.save();

            return true;
        } catch (err) {
            logger.error(err);
            return null;
        }
    }
}

export default AuthCollection;