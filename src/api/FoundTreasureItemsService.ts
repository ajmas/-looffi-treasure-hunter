import { Axios } from 'axios';
import TreasureItemService from './TreasureItemService';
import IFoundTreasureItem from 'src/interfaces/IFoundTreasureItem';

class FoundTreasureItemsService {
  api?: Axios;
  initialised = false;

  init (api: Axios) {
    this.api = api;
    this.initialised = true;
  }

  async listFoundTreasureItems (questId: string): Promise<IFoundTreasureItem[]> {
    const data = localStorage.getItem(`foundtreasure.${questId}`);
    if (data) {
      const foundTreasureItems = JSON.parse(data);
      for (let i = 0; i < foundTreasureItems.length; i++) {
        await TreasureItemService.loadTreasureItem(questId, foundTreasureItems[i].id);
      }
    }
    return [];
  }


}

export default new FoundTreasureItemsService();
