/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
import { boot } from 'quasar/wrappers';
import axios from 'axios';

export default boot(async ({ app }) => {
  try {
    // Use axios straight
    const response = await axios.get('/config.json');
    if (response.data) {
      app.config.globalProperties.$appConfig = Object.assign(
        app.config.globalProperties.$appConfig,
        response.data
      );
    }
  } catch (error: unknown) {
    console.error('Error loading config', error);
  }
});
