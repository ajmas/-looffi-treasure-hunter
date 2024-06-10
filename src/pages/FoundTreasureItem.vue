<template>
  <q-page class="row justify-evenly">
    <q-list bordered separator class="found-treasure">
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
          {{ getText(foundTreasureItem?.item?.name) }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ITreasureItem from '../interfaces/ITreasureItem';
import IFoundTreasureItem from '../interfaces/IFoundTreasureItem';
import { getText } from '../utils/TextUtils';
import type { i18nString} from '../types/global';

export default defineComponent({
  name: 'FoundTreasureItem',
  props: {
    foundItemId: String
  },
  setup () {
    const foundTreasureItems = ref<IFoundTreasureItem[]>([]);
    const data = localStorage.getItem('foundTreasure');
    if (data) {
      foundTreasureItems.value = JSON.parse(data);
    }
    return {
      defaultLocale: 'en',
      quest: 'default',
      foundTreasureItems
    };
  },
  async mounted () {
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
    async loadTreasureItem (id: string, quest = 'default'): Promise<ITreasureItem | undefined> {
      try {
        const response = await this.$api.get(
          `/quests/${quest}/treasures/${id}.json`
        );
        if (response.data) {
          return response.data as ITreasureItem;
        }
      } catch (error) {
        console.log('error while loading treasure', error);
      }
      return undefined;
    },
    async loadTreasureItems (): Promise<ITreasureItem[]> {
      const foundTreasureItems = this.foundTreasureItems || [];
      for (let i = 0; i < foundTreasureItems.length; i++) {
        foundTreasureItems[i].item = await this.loadTreasureItem(
          foundTreasureItems[i].id,
          this.quest
        );
      }
      return foundTreasureItems;
    },
    getText (text: i18nString) {
      return getText(text, this.$i18n.locale);
    }
  }
});
</script>
