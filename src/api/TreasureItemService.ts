import { Axios } from 'axios';
import ITreasureItem from 'src/interfaces/ITreasureItem';

class TreasureItemService {
  api?: Axios;
  initialised = false;

  init (api: Axios) {
    this.api = api;
    this.initialised = true;
  }

  async loadTreasureItem (questId: string, id: string): Promise<ITreasureItem | undefined> {
    try {
      if (!this.initialised || !this.api) {
        throw new Error('Service is not properly initialised');
      }

      const response = await this.api.get(
        `/quests/${questId}/treasures/${id}.json`
      );
      if (response.data) {
        return response.data as ITreasureItem;
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  async loadTreasureItems (questId: string, foundTreasureItemIds: string[]): Promise<ITreasureItem[]> {
    if (!this.initialised || !this.api) {
      throw new Error('Service is not properly initialised');
    }

    const treasureItems: ITreasureItem[] = [];

    for (let i = 0; i < foundTreasureItemIds.length; i++) {
      const treasureItem = await this.loadTreasureItem(questId, foundTreasureItemIds[i]);
      if (treasureItem) {
        treasureItems.push(treasureItem);
      }
    }

    return treasureItems;
  }
}

export default new TreasureItemService();
