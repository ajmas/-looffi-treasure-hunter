import { boot } from 'quasar/wrappers';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $appConfig: Record<string, unknown>;
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$appConfig = {
    apiUrl: '/api',
    timezone: 'UTC-4'
  };
});
