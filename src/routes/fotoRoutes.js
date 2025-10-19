import { Router } from 'express';
import fotoController from '#src/controllers/FotoController.js';
import loginRequired from '#src/middlewares/loginRequired.js';
const router = new Router();

router.post('/', loginRequired, fotoController.store);

export default router;
