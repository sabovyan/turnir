import sgMail from '@sendgrid/mail';
import { setMessageFunctionType } from '../user/user.types';
import {
  AUTH_BASE_URL,
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
    link: `${AUTH_BASE_URL}/${token}`,
  },
});

export default sgMail;
