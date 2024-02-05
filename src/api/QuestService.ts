import { Axios } from 'axios';

class QuestService {
  api?: Axios;
  initialised = false;

  init (api: Axios) {
    this.api = api;
    this.initialised = true;
  }

  async listQuests () {
    if (!this.initialised || !this.api) {
      throw new Error('Service is not properly initialised');
    }

    const response = await this.api.get('/quests');
    if (response.data && response.data.entries) {
      return response.data.entries;
    }
  }
}

export default new QuestService();
