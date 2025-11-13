import express from 'express';
import { getAllCheckins, getCheckinsByUser } from "../controllers/checkinController.js";

const router = express.Router();

const webRouter = (app) => {
  router.get('/checkins', getAllCheckins);
  router.get('/checkins/:userId', getCheckinsByUser);

    app.use('/api', router);
};

export default webRouter;