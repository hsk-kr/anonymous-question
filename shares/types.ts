import { Express } from "express";
import { Server } from "http";

export interface ServerInfo {
  port: string;
  app: Express;
  server: Server;
}

export interface Question {
  nickname: string;
  question: string;
}
