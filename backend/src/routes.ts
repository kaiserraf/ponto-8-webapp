import { Router } from "express";
import * as clientController from "./controllers/clientController";

const router = Router();

router.get('/clients', clientController.getClient);

export default router;