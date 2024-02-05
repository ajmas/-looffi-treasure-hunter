<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img :src="`${this.baseUrl}/images/Treasure-Chest.512.png`" />
          </q-avatar>
          Loofi Treasure Hunter
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup () {
    return {
      baseUrl: `${process.env.BASE_URL || ''}` as string
    };
  }
});
</script>
