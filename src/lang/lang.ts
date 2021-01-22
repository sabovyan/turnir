type MailMessage = {
  header: string;
  message: string;
  buttonText: string;
  verifyMessage: string;
  verifyButtonText: string;
};

interface ILanguages {
  en: MailMessage;
  ru: MailMessage;
  hy: MailMessage;
}

const languages: ILanguages = {
  en: {
    header: 'dear',
    message: 'please click on the button to change your password',
    buttonText: 'CHANGE PASSWORD',
    verifyMessage:
      'Thank you for joining our application. Please, click on the link below and verify your email.',
    verifyButtonText: 'CLICK ME',
  },

  hy: {
    header: 'Հարգելի',
    message: 'խնդրում ենք սեղմել կոճակին՝ ձեր նոր գաղտնաբառը ստեղծելու համար',
    buttonText: 'ՓՈԽԵԼ ԳԱՂՏՆԱԲԱՌԸ',
    verifyMessage:
      'Շնորհակալություն մեր ծրագրին միանալու համար: Խնդրում ենք, կտտացրեք ներքևի հղմանը և հաստատեք ձեր էլ. Փոստը:',
    verifyButtonText: 'Սեղմիր այստեղ',
  },

  ru: {
    header: 'дорогой',
    message: 'пожалуйста, нажмите на кнопку, чтобы изменить свой пароль',
    buttonText: 'ИЗМЕНИТЬ ПАРОЛЬ',
    verifyMessage:
      'Спасибо, что присоединились к нашему приложению. Пожалуйста, нажмите на ссылку ниже и подтвердите свой адрес электронной почты.',
    verifyButtonText: 'Нажми сюда',
  },
};

export type Language = 'en' | 'ru' | 'hy';

export const getLanguage = (lang: Language): MailMessage =>
  languages[lang] ? languages[lang] : languages.en;
