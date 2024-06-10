import { boot } from 'quasar/wrappers';
import { createI18n, I18n } from 'vue-i18n';
import { Lang } from 'quasar';
import messages from 'src/i18n';
import { WritableComputedRef } from 'vue';

export type MessageLanguages = keyof typeof messages;
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = typeof messages['en'];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema { }

  // define the datetime format schema
  export interface DefineDateTimeFormat { }

  // define the number format schema
  export interface DefineNumberFormat { }
}

/* eslint-enable @typescript-eslint/no-empty-interface */
const quasarLocales: Record<string, string> = {
  'fr': 'fr',
  'en': 'en-US'
};

const langModules = import.meta.glob('../../node_modules/quasar/lang/(en-GB|en-US|fr).js');
let i18n: I18n;
const availableLanguages = Object.keys(messages);

function setQuasarLocale (locale: string) {
  try {
    let langModule = langModules[`../../node_modules/quasar/lang/${locale}.js`];
    if (!langModule) {
      locale = locale.substring(0, 2);
      langModule = langModules[`../../node_modules/quasar/lang/${locale}.js`];
    }
    if (!langModule && quasarLocales[locale]) {
      locale = quasarLocales[locale];
      langModule = langModules[`../../node_modules/quasar/lang/${locale}.js`];
    }

    if (langModule) {
      langModule().then(lang => {
        Lang.set(lang.default)
      });
    }
  } catch (error) {
    console.error('error while changing quasar locale', error);
  }
}

function switchLanguage (locale: string) {
  (i18n.global.locale as WritableComputedRef<string>).value = locale;
  setQuasarLocale(locale);
}

export default boot(({ app }) => {
  i18n = createI18n({
    locale: 'en',
    legacy: false,
    messages
  });

  // Set i18n instance on app
  app.use(i18n);
});

export { switchLanguage, availableLanguages }
