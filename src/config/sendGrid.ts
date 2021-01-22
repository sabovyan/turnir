import sgMail, { MailDataRequired } from '@sendgrid/mail';
import {
  AUTH_RESET_URL,
  AUTH_VERIFICATION_URL,
  SENDGRID_API_KEY,
  SENDGRID_MAIL_FROM,
  SENDGRID_RESET_TEMPLATE_ID,
  SENDGRID_TEMPLATE_ID,
} from './envConstants';

sgMail.setApiKey(SENDGRID_API_KEY);

export type setMessageFunctionType = (
  to: string,
  header: string,
  token: string,
  message: string,
  buttonText: string,
) => MailDataRequired;

export const setMessage: setMessageFunctionType = (
  to: string,
  header: string,
  token: string,
  message: string,
  buttonText: string,
) => ({
  templateId: SENDGRID_TEMPLATE_ID,
  from: SENDGRID_MAIL_FROM,
  to,
  dynamicTemplateData: {
    header,
    message,
    buttonText,
    link: `${AUTH_VERIFICATION_URL}/${token}`,
  },
});

export const setResetPasswordMessage = (
  to: string,
  header: string,
  buttonText: string,
  token: string,
  message: string,
): MailDataRequired => ({
  templateId: SENDGRID_RESET_TEMPLATE_ID,
  from: SENDGRID_MAIL_FROM,
  to,
  dynamicTemplateData: {
    header,
    buttonText,
    link: `${AUTH_RESET_URL}/${token}`,
    message,
  },
});

export default sgMail;
