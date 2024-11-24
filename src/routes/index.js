import { Router } from "express";
import root from "./root.js";
import auth from "./auth.js";

export default (app) => {
  const router = Router();

  app.use("/api/v1", router);

  auth(router);
  root(router);
};
