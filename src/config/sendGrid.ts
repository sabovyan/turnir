import sgMail, { MailDataRequired } from '@sendgrid/mail';
import {
  SENDGRID_API_KEY,
  SENDGRID_MAIL_FROM,
  SENDGRID_TEMPLATE_ID,
} from './constants';

sgMail.setApiKey(SENDGRID_API_KEY);

type setMessageFunctionType = (
  to: string,
  userName: string,
  link: string,
) => MailDataRequired;

export const setMessage: setMessageFunctionType = (
  to: string,
  userName: string,
  link: string,
) => ({
  templateId: SENDGRID_TEMPLATE_ID,
  from: SENDGRID_MAIL_FROM,
  to,
  dynamicTemplateData: {
    userName,
    link,
  },
});

export default sgMail;
