const defaultLocale = 'en';

function getText (text: i18nString, locale: string = defaultLocale) {
  if (text) {
    if (typeof text === 'string') {
      return text;
    }
    return (
      text[locale] ||
      text[locale.substring(0, 2)] ||
      text[defaultLocale]
    );
  }
  return '';
}

export { getText }
