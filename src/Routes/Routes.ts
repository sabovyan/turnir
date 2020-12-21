import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import registerValidationSchema from '../utils/register.validate';
import ValidationError from '../Errors/ValidationError';
import RegistrationError from '../Errors/registrationError';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
  errorFormat: 'pretty',
});

const router = Router();

const registerRoute = router.route('/register');

registerRoute.post(async (req: Request, res: Response) => {
  try {
    const { error, value } = registerValidationSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.message);
    }

    const user = await prisma.user.create({
      data: value,
    });
    if (!user) {
      throw new RegistrationError();
    }
    res.status(200).json(value);
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
