import express from "express";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import MongoDBConnect from "./database/connect.js";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from 'helmet';
import limit from 'express-rate-limit';
import logger from './utils/logger.js';
import morgan from "morgan";
import cookieParser from "cookie-parser";

global.__dirname = () => dirname(fileURLToPath(import.meta.url));

const app = express();
dotenv.config();

MongoDBConnect.connect(process.env.MONGODB_CONNECT_URL);

app.disable('x-powered-by');

app.use(cors({
  origin: [process.env.ORIGIN_URL],
  methods: ['GET', 'POST', 'DELETE', "PATCH"],
  credentials: true
}));

app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));
app.use(limit({
  windowMs: 60 * 1000,
  limit: 40,
  legacyHeaders: false
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

export default logger;

const methodMap = new Map([
  ["get", { method: "get", callback: "Get" }],
  ["post", { method: "post", callback: "Post" }],
  ["delete", { method: "delete", callback: "Delete" }],
  ["patch", { method: "patch", callback: "Patch" }],
]);

const endpointsPath = path.join(__dirname(), "routes");

const readEndpointsDirectory = (directoryPath, app, methodMap) => {
  const files = fs.readdirSync(directoryPath);

  files.forEach(async (file) => {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) readEndpointsDirectory(filePath, app, methodMap);

    else if (stat.isFile() && file.endsWith(".js")) {
      const module = await import(`file://${filePath}`);
      const { endpoint, methods, middleware } = module.default;

      methods.forEach((method) => {
        const { callback, method: httpMethod } = methodMap.get(method);
        
        if (middleware) {
          app[httpMethod](endpoint, ...middleware, module.default[callback]);
        } else {
          app[httpMethod](endpoint, module.default[callback]);
        }
      });
    }
  });

  setTimeout(() => app.all('*', (req, res, next) => res.sendStatus(404)), 1000);
};

readEndpointsDirectory(endpointsPath, app, methodMap);

const port = process.env.PORT;

app.listen(port, () => logger.info(`Server running on port ${port}`));
