import { ipcMain } from "electron";
import express, { Express } from "express";
import { default as dotenv } from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { ServerInfo } from "../../types/types";
import { TOGGLE_EVENT_REQ, TOGGLE_EVENT_RES } from "../../types/constants";
import questionApi from "./questions";

let serverInfo: ServerInfo | undefined;

dotenv.config();

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
    servers: [
      {
        url: `http://localhost:${process.env.SERVER_PORT}/questions`,
      },
    ],
  },
  apis: ["./questions.ts", "./schemas/*.ts"],
};

const specs = swaggerJsdoc(options);

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

  try {
    if (on) {
      await startServer();
    } else {
      await stopServer();
    }

    event.reply(TOGGLE_EVENT_RES, { result: true, message: "Succeed." });
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

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
  );

  app.use("/api", questionApi);
};

export const startServer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const app = express();
    const port = process.env.SERVER_PORT;

    configureServer(app);

    const server = app
      .listen(port, () => {
        console.log("Server has been started.");
        resolve();
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
