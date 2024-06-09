<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img :src="`${this.baseUrl}/images/Treasure-Chest.512.png`" />
          </q-avatar>
          {{ title }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup () {
    return {
      title: ref<string>('Loofi Treasure Hunter'),
      baseUrl: `${process.env.BASE_URL || ''}` as string
    };
  },
  mounted () {
    this.title = this.$appConfig.appName || this.title;
  }
});
</script>
