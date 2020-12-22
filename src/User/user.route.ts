import { Router } from 'express';
import { registerUserWithEmail } from './user.controller';

const router = Router();
const registerRoute = router.route('/register');

registerRoute.post(registerUserWithEmail);

export default router;
