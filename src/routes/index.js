import  accountRouter from "./accountRouter.js";
import siteRouter from "./siteRouter.js";
import postRouter from "./postRouter.js";
import adminRouter from "./adminRouter.js";

function route(app) {
  app.use("/account", accountRouter);
  app.use("/post", postRouter);
  app.use("/admin", adminRouter);
  app.use("/", siteRouter);
};

export default route;