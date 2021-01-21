import sgMail from '@sendgrid/mail';
import { setMessageFunctionType } from '../modules/auth/auth.types';
import {
  AUTH_VERIFICATION_URL,
  SENDGRID_API_KEY,
  SENDGRID_MAIL_FROM,
  SENDGRID_TEMPLATE_ID,
} from './envConstants';

sgMail.setApiKey(SENDGRID_API_KEY);

export const setMessage: setMessageFunctionType = (
  to: string,
  displayName: string,
  token: string,
) => ({
  templateId: SENDGRID_TEMPLATE_ID,
  from: SENDGRID_MAIL_FROM,
  to,
  dynamicTemplateData: {
    displayName,
    link: `${AUTH_VERIFICATION_URL}/${token}`,
  },
});

export default sgMail;
