import  accountRouter from "./accountRouter.js";
import siteRouter from "./siteRouter.js";
import postRouter from "./postRouter.js";
import adminRouter from "./adminRouter.js";
import locationRouter from "./locationRouter.js";
import categoryRouter from "./categoryRouter.js";
import propertyRouter from "./propertyRouter.js";
import facilityRouter from "./facilityRouter.js";
import packageRouter from "./packageRouter.js";
import paymentRouter from "./paymentRouter.js";

function route(app) {
  app.use("/account", accountRouter);
  app.use("/post", postRouter);
  app.use("/admin", adminRouter);
  app.use("/location", locationRouter);
  app.use("/category", categoryRouter);
  app.use("/property", propertyRouter);
  app.use("/facility", facilityRouter);
  app.use("/package", packageRouter);
  app.use("/payment", paymentRouter);
  app.use("/", siteRouter);
};

export default route;