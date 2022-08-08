import { ipcMain } from "electron";
import path from "path";
import { networkInterfaces } from "os";
import express, { Express } from "express";
import { default as dotenv } from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { ServerInfo } from "../../shares/types";
import { TOGGLE_EVENT_REQ, TOGGLE_EVENT_RES } from "../../shares/constants";
import questionApi from "./questions";

const isProd: boolean = process.env.NODE_ENV === "production";
let serverInfo: ServerInfo | undefined;

dotenv.config();

const nets = networkInterfaces();
const addressList: string[] = [];

for (const value of Object.values(nets)) {
  for (const net of value) {
    if (net.family === "IPv4" && !net.internal) {
      addressList.push(net.address);
      break;
    }
  }
}

/** Swagger */
const addSwaggerToApp = (app: Express, port: string) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Anonymous Question API with Swagger",
        version: "0.0.1",
        description: "Anonymous Question API Server",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "lico",
          url: "https://www.linkedin.com/in/seongkuk-han-49022419b/",
          email: "hsk.coder@gmail.com",
        },
      },
      servers: addressList.map((address) => ({
        url: `http://${address}:${port}`,
      })),
    },
    apis: isProd
      ? [
          path.join(process.resourcesPath, "main/api/questions.ts"),
          path.join(process.resourcesPath, "main/api/schemas/*.ts"),
        ]
      : ["./main/api/questions.ts", "./main/api/schemas/*.ts"],
  };

  const specs = swaggerJsdoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

/** Events */

ipcMain.on(TOGGLE_EVENT_REQ, async (event, on) => {
  if (on && serverInfo !== undefined) {
    event.reply(TOGGLE_EVENT_RES, {
      result: false,
      message: `It's already on.`,
    });
    return;
  } else if (!on && serverInfo === undefined) {
    event.reply(TOGGLE_EVENT_RES, {
      result: true,
      message: `The server isn't running.`,
    });
    return;
  }

  let port: string | undefined;

  try {
    if (on) {
      port = await startServer();
    } else {
      await stopServer();
    }

    event.reply(TOGGLE_EVENT_RES, { result: true, message: "Succeed.", port });
  } catch (e) {
    console.error(e);
    event.reply(TOGGLE_EVENT_RES, {
      result: false,
      message: `Something went wrong.`,
    });
  }
});

/** Server */

const configureServer = (app: Express) => {
  app.use(express.json());
  app.use(cors());

  app.use("/api", questionApi);
};

export const startServer = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const app = express();
    const port = process.env.SERVER_PORT;

    configureServer(app);

    const server = app
      .listen(undefined, () => {
        const port = (server.address() as { port: number }).port.toString();
        console.log(`Server has been started on ${port}.`);
        addSwaggerToApp(app, port);
        resolve(port);
      })
      .on("error", (err) => {
        reject(err);
      });

    serverInfo = {
      app,
      port,
      server,
    };
  });
};

export const stopServer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if (!serverInfo) throw new Error("There is no server information.");

      serverInfo.server.close(() => {
        console.log("Server has been stopped.");
        serverInfo = undefined;
        resolve();
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};
