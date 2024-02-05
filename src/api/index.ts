import FoundTreasureItemsService from './FoundTreasureItemsService';
import TreasureItemService from './TreasureItemService';
import QuestService from './QuestService';
import { Axios } from 'axios';

function initApi (api: Axios) {
  FoundTreasureItemsService.init(api);
  TreasureItemService.init(api);
  QuestService.init(api);
}

export { initApi };
