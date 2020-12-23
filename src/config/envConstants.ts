// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const PORT: number = parseInt(process.env.PORT!, 10);
export const { DELETE_USERS } = process.env;
export const SENDGRID_API_KEY: string = process.env.SENDGRID_API_KEY!;
export const SENDGRID_MAIL_FROM: string = process.env.SENDGRID_MAIL_FROM!;
export const SENDGRID_TEMPLATE_ID: string = process.env.SENDGRID_TEMPLATE_ID!;
export const BCRYPT_SALT: string = process.env.BCRYPT_SALT!;
export const JWT_SECRET: string = process.env.JWT_SECRET!;
export const AUTH_BASE_URL = process.env.AUTH_BASE_URL!;
