import { i18nString } from 'src/types/global';

interface IQuest {
  id: string,
  name: i18nString,
  description?: i18nString,
  totalTreasures?: number,
  treasuresNeeded?: number
}

export default IQuest;
