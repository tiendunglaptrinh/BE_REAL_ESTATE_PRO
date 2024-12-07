import  accountRouter from "./accountRouter.js";
import siteRouter from "./siteRouter.js";
import postRouter from "./postRouter.js";

function route(app) {
  app.use("/account", accountRouter);
  app.use("post", postRouter);
  app.use("/", siteRouter);
};

export default route;