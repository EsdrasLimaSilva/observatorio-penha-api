import { Router } from 'express';
import pinController from '../controllers/pinController.js';
const router = Router();
router.post('/', pinController.createPin);
router.get('/', pinController.getPins);
router.put('/', pinController.likePin);
export default router;
