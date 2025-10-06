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
import messageRouter from "./messageRouter.js";
import OTPRouter from "./OTPRouter.js";
import GoogleRouter from "./googleRouter.js";
import StatusRouter from "./statusRouter.js";
import contactRouter from "./contactRouter.js";

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
  app.use("/message", messageRouter);
  app.use("/otp", OTPRouter);
  app.use("/auth", GoogleRouter);
  app.use("/status", StatusRouter);
  app.use("/contact", contactRouter);
  app.use("/", siteRouter);
};

export default route;