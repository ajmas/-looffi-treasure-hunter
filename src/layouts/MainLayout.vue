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
        <q-btn
          v-for="(lang, idx) in languages"
          :key="idx"
          class="language-switch"
          :label="lang"
          flat
          :disabled="locale === lang"
          @click="onSwitchLanguage(lang)"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getText } from '../utils/TextUtils';
import { availableLanguages, switchLanguage } from '../boot/i18n';

export default defineComponent({
  name: 'MainLayout',

  setup () {
    return {
      defaultTitle: ref<string>('Looffi Treasure Hunter'),
      baseUrl: `${process.env.BASE_URL || ''}` as string,
      languages: ref<string[]>([])
    };
  },
  computed: {
    locale () {
      return this.$i18n.locale;
    },
    title () {
      return getText(this.$appConfig.appName || this.title, this.$i18n.locale) || this.defaultTitle;
    }
  },
  mounted () {
    this.languages = availableLanguages;
  },
  methods: {
    onSwitchLanguage (language: string) {
      switchLanguage(language);
    }
  }
});
</script>
