<template>
  <q-page class="row justify-evenly">
    <q-list bordered separator class="found-treasure full-width">
      <q-item
        v-for="foundTreasureItem in foundTreasureItems"
        :key="foundTreasureItem.id"
      >
        <q-item-section avatar>
          <q-avatar rounded>
            <img
              v-if="foundTreasureItem.item && foundTreasureItem.item.image"
              :src="foundTreasureItem.item.image"
            />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          {{ getText(foundTreasureItem?.item.name) }}
        </q-item-section>
        <q-item-section>
          <q-btn
            v-if="foundTreasureItem?.item.clue"
            @click="onShowClue(foundTreasureItem.id)"
          >
            View Clue
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <q-dialog v-model="clueDialogueVisible" full-width full-height>
      <q-card>
        <q-bar class="bg-primary text-white">
          Blurb
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-pa-md">
          <VueMarkdown :source="getText(clueText)" />
        </q-card-section>
        <q-card-section class="row justify-center items-center">
          <q-btn v-close-popup class="self-center" color="primary">Close</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueMarkdown from 'vue-markdown-render';

import ITreasureItem from '../interfaces/ITreasureItem';
import IFoundTreasureItem from '../interfaces/IFoundTreasureItem';
import { getText } from '../utils/TextUtils';

export default defineComponent({
  name: 'IndexPage',
  props: {
    foundItemId: String
  },
  components: { VueMarkdown },
  setup () {
    // const foundTreasureItems = ref<IFoundTreasureItem[]>([]);
    // const data = localStorage.getItem('foundTreasure');
    // if (data) {
    //   foundTreasureItems.value = JSON.parse(data);
    // }
    return {
      baseUrl: `${process.env.BASE_URL || ''}`,
      defaultLocale: 'en',
      quest: 'default',
      foundTreasureItems: ref<IFoundTreasureItem[]>([]),
      clueDialogueVisible: ref<boolean>(false),
      clueText: ref<string | undefined>(undefined)
    };
  },
  async mounted () {
    const data = localStorage.getItem('foundTreasure');
    if (data) {
      this.foundTreasureItems.value = JSON.parse(data);
    }

    await this.loadTreasureItems();

    if (this.foundItemId) {
      const item = await this.loadTreasureItem(this.foundItemId, this.quest);
      if (item) {
        const exists = !!this.foundTreasureItems.find(
          (foundItem) => foundItem.id === item.id
        );

        if (!exists) {
          this.foundTreasureItems.push({
            id: item.id,
            time: new Date(),
            item
          });

          localStorage.setItem(
            'foundTreasure',
            JSON.stringify(this.foundTreasureItems)
          );
        }
      }
    }
  },
  methods: {
    async loadTreasureItem (id: string, quest = 'default'): ITreasureItem {
      try {
        const response = await this.$api.get(
          `${this.baseUrl}/quests/${quest}/treasures/${id}.json`
        );
        if (response.data) {
          return response.data as ITreasureItem;
        }
      } catch (error) {
        console.log('error', error);
      }
    },
    async loadTreasureItems (): ITreasureItem {
      const foundTreasureItems = this.foundTreasureItems || [];
      for (let i = 0; i < foundTreasureItems.length; i++) {
        foundTreasureItems[i].item = await this.loadTreasureItem(
          foundTreasureItems[i].id,
          this.quest
        );
      }
    },
    getText (text: i18nString) {
      return getText(text, this.$i18n.locale);
    },
    onShowClue (treasureId: string) {
      const foundItem = this.foundTreasureItems.find(
        (item) => item.id === treasureId
      );
      if (foundItem) {
        this.clueText = foundItem?.item?.clue;
        this.clueDialogueVisible = true;
      }
    }
  }
});
</script>
