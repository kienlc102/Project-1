import express from 'express';
import { getAllCheckins, getCheckinsByUser, postCheckin } from "../controllers/checkinController.js";
import { getAllCheckouts, getCheckoutsByUser, postCheckout } from "../controllers/checkoutController.js";

const router = express.Router();

const webRouter = (app) => {
  router.get('/checkins', getAllCheckins);
  router.get('/checkins/:userId', getCheckinsByUser);

  router.get('/checkouts', getAllCheckouts);
  router.get('/checkouts/:userId', getCheckoutsByUser);

  router.post('/checkins/post/:userId', postCheckin);
  router.post('/checkouts/post/:userId', postCheckout);

  

  app.use('/api', router);
};

export default webRouter;