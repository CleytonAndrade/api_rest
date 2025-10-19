import { Router } from 'express';
import homeController from '#src/controllers/HomeController.js';
const router = new Router();

router.get('/', homeController.index);

export default router;
