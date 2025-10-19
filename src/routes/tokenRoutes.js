import { Router } from 'express';
import tokenController from '#src/controllers/TokenController.js';
const router = new Router();

router.post('/', tokenController.store);

export default router;
