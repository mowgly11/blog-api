import express from "express";
import dotenv from "dotenv";
import authMiddlewares from "./middleware/checkForAuthorisation.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import MongoDBConnect from "./database/connect.js";
import bodyParser from "body-parser";

global.__dirname = () => dirname(fileURLToPath(import.meta.url));

const app = express();
dotenv.config();

MongoDBConnect.connect(process.env.MONGODB_CONNECT_URL);

app.set("x-powered-by", false);

//app.use(authMiddlewares.checkForIPAuthorisation);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

export default app;

const methodMap = new Map([
  ["get", { method: "get", callback: "Get" }],
  ["post", { method: "post", callback: "Post" }],
  ["delete", { method: "delete", callback: "Delete" }],
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
      const { endpoint, methods } = module.default;

      methods.forEach((method) => {
        const { callback, method: httpMethod } = methodMap.get(method);
        app[httpMethod](endpoint, module.default[callback]);
      });
    }
  });
};

readEndpointsDirectory(endpointsPath, app, methodMap);

const port = process.env.PORT;

app.listen(port, () => console.log("Running on port " + port));
