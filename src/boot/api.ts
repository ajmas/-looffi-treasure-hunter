import { boot } from 'quasar/wrappers';
import { initApi } from 'src/api';

export default boot(({ app }) => {
  initApi(app.config.globalProperties.$api);
});
