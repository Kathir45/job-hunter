import { Router } from "express";
import { getExternalJobs } from "../controllers/externalJobs.controller.js";

const router = Router();

router.route("/external-jobs").get(getExternalJobs);

export default router;
