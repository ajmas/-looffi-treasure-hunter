import { i18nString } from 'src/types/global';

interface ITreasureItem {
  id: string,
  name: i18nString,
  image?: string,
  clue?: i18nString,
  answer?: i18nString,
  treasure?: i18nString
}

export default ITreasureItem;
