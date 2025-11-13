import express from 'express';
import { getAllCheckins, getCheckinsByUser } from "../controllers/checkinController.js";
import { getAllCheckouts, getCheckoutsByUser } from "../controllers/checkoutController.js";

const router = express.Router();

const webRouter = (app) => {
  router.get('/checkins', getAllCheckins);
  router.get('/checkins/:userId', getCheckinsByUser);

  router.get('/checkouts', getAllCheckouts);
  router.get('/checkouts/:userId', getCheckoutsByUser);

    app.use('/api', router);
};

export default webRouter;