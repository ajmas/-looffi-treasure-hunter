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
              :src="getImageUrl(foundTreasureItem.item.image)"
            />
          </q-avatar>
        </q-item-section>

        <q-item-section class="full-width">
          {{ getText(foundTreasureItem?.item?.name) }}
        </q-item-section>
        <q-item-section
          style="display: flex; align-items: flex-end; justify-content: center"
        >
          <q-btn
            v-if="foundTreasureItem?.item?.clue"
            @click="onShowClue(foundTreasureItem.id)"
            size="sm"
            outline
          >
            {{ $t('label.showDetails') }}
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <q-dialog v-model="clueDialogueVisible" full-width full-height @hide="onDialogueClose">
      <q-card>
        <q-bar class="bg-primary text-white">
          Treasure Item
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-pa-none">
          <TreasureItemInfo :treasure-item="activeTreasureItem" :base-url="baseUrl" flat />
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

import TreasureItemInfo from '../components/TreasureItemInfo.vue';
import ITreasureItem from '../interfaces/ITreasureItem';
import IFoundTreasureItem from '../interfaces/IFoundTreasureItem';
import { getText } from '../utils/TextUtils';

export default defineComponent({
  name: 'IndexPage',
  props: {
    foundItemId: String
  },
  components: { TreasureItemInfo },
  setup () {
    return {
      baseUrl: `${process.env.BASE_URL || ''}`,
      apiUrl: `${process.env.BASE_URL || ''}`,
      defaultLocale: 'en',
      quest: 'default',
      foundTreasureItems: ref<IFoundTreasureItem[]>([]),
      clueDialogueVisible: ref<boolean>(false),
      clueText: ref<string | undefined>(undefined),
      activeTreasureItem: ref<ITreasureItem | undefined>(undefined)
    };
  },
  watch: {
    async foundItemId () {
      if (this.foundItemId) {
        await this.addNewItem(this.quest, this.foundItemId);
      }
    }
  },
  async mounted () {
    this.baseUrl = this.$appConfig.baseUrl;
    this.apiUrl = this.$appConfig.apiUrl;

    const data = localStorage.getItem(`foundTreasure.${this.quest}`);
    if (data) {
      this.foundTreasureItems = JSON.parse(data);
    }

    await this.loadTreasureItems();

    if (this.foundItemId) {
      await this.addNewItem(this.quest, this.foundItemId);
      this.onShowClue(this.foundItemId);
    }
  },
  methods: {
    async loadTreasureItem (quest: string, itemId: string): Promise<ITreasureItem> {
      try {
        const response = await this.$api.get(
          `/quests/${quest}/treasures/${itemId}.json`
        );
        if (response.data) {
          const treasureItem = response.data as ITreasureItem;
          if (treasureItem.clue !== 'string') {
            const keys = Object.keys(treasureItem.clue);
            keys.forEach((key) => {
              treasureItem.clue[key] = treasureItem.clue[key].replace(
                '![image](/',
                `![image](${this.baseUrl}/`
              );
            });
          }
          return treasureItem;
        }
      } catch (error) {
        console.log('error', error);
      }
      return undefined;
    },
    async loadTreasureItems (): ITreasureItem {
      const foundTreasureItems = this.foundTreasureItems || [];
      for (let i = 0; i < foundTreasureItems.length; i++) {
        foundTreasureItems[i].item = await this.loadTreasureItem(
          this.quest,
          foundTreasureItems[i].id
        );
      }
    },
    async addNewItem (questId: string, foundItemId: ITreasureItem) {
      if (foundItemId) {
        const item = await this.loadTreasureItem(questId, foundItemId);
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
              `foundTreasure.${questId}`,
              JSON.stringify(this.foundTreasureItems)
            );

            this.$forceUpate();
          }
        }
      }
    },
    getImageUrl (imageUrl: string) {
      if (imageUrl && imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
        imageUrl = `${this.baseUrl}${imageUrl}`;
      }
      imageUrl = imageUrl.replace('//', '/');

      return imageUrl;
    },
    getText (text: i18nString) {
      return getText(text, this.$i18n.locale);
    },
    onShowClue (treasureId: string) {
      try {
        const foundItem = this.foundTreasureItems.find(
          (item) => item.id === treasureId
        );
        if (foundItem?.item) {
          // this.clueText = foundItem?.item?.clue;
          this.activeTreasureItem = foundItem?.item;
          this.clueDialogueVisible = true;
        }
      } catch (error) {
        console.error('error while showing clue', error);
      }
    },
    onDialogueClose () {
      if (this.foundItemId) {
        this.$router.push(this.$route.path);
      }
    }
  }
});
</script>
