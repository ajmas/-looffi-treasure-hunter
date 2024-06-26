<template>
  <q-page >
    <q-card
      flat
      class="full-height"
    >
      <q-item-section class="row justify-evenly">
        <q-list bordered separator class="found-treasure full-width">
          <q-item
            v-for="foundTreasureItem in foundTreasureItems"
            :key="foundTreasureItem.id"
          >
            <q-item-section
              avatar
            >
              <q-avatar
                size="62px"
                :color="isClueAnswered(foundTreasureItem) ? 'positive' : undefined"
              >
                <img
                  v-if="foundTreasureItem.item && foundTreasureItem.item.image"
                  :src="getImageUrl(foundTreasureItem.item.image)"
                  class="avatar-icon"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section class="full-width">
              <div class="name">{{ getText(foundTreasureItem?.item?.name) }}</div>
              <div class="found-time">{{ formatDatTime(foundTreasureItem.time) }}</div>
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
      </q-item-section>
      <q-item-section>
        {{ $t('label.totalTreasures') }} : {{ foundTreasureItems?.length || 0 }} of {{ questInfo?.totalTreasures }}
      </q-item-section>
    </q-card>

    <q-dialog
      v-model="treasureDialogueVisible"
      maximized
      class="q-ma-none"
      @hide="onDialogueClose"
    >
      <q-card class="q-ma-none">
        <q-bar class="bg-primary text-white">
          {{ $t('label.treasureItem')}}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{ $t('label.close') }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-pa-none">
          <TreasureItemInfo
            v-if="activeTreasureItem"
            :treasure-item="activeTreasureItem.item"
            :answer="activeTreasureItem.answer"
            :base-url="baseUrl"
            flat
            @clue-answered="onClueAnswered"
          />
        </q-card-section>
        <q-card-section class="row justify-center items-center">
          <q-btn v-close-popup class="self-center" color="primary">{{ $t('label.close') }}</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import IQuest from '../interfaces/IQuest';
import TreasureItemInfo from '../components/TreasureItemInfo.vue';
import ITreasureItem from '../interfaces/ITreasureItem';
import IFoundTreasureItem from '../interfaces/IFoundTreasureItem';
import { getText } from '../utils/TextUtils';
import type { i18nString } from '../types/global';
import { ensureDateTime } from '../utils/DateUtils';
import { DateTime } from 'luxon';

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
      quest: ref<string>('default'),
      questInfo: ref<IQuest | undefined>(),
      foundTreasureItems: ref<IFoundTreasureItem[]>([]),
      treasureDialogueVisible: ref<boolean>(false),
      clueText: ref<string | undefined>(undefined),
      activeTreasureItem: ref<IFoundTreasureItem | undefined>(undefined),
      answers: ref<Record<string, string>>({})
    };
  },
  watch: {
    async foundItemId () {
      if (this.foundItemId) {
        await this.addNewItem(this.quest, this.foundItemId);
        this.onShowClue(this.foundItemId);
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

    await this.loadQuest(this.quest);
    await this.loadTreasureItems();

    if (this.foundItemId) {
      await this.addNewItem(this.quest, this.foundItemId);
      this.onShowClue(this.foundItemId);
    }
  },
  methods: {
    async loadQuest (quest: string): Promise<IQuest | undefined> {
      const questKey = `quest-${this.quest}`;
      if (localStorage.getItem(questKey)) {
        const data = localStorage.getItem(questKey);
        this.questInfo = JSON.parse(data as string) as IQuest;
      }
      if (!this.questInfo) {
        console.log('iiiuuuu');
        try {
          const response = await this.$api.get(
            `/quests/${quest}/index.json`
          );
          if (response.data) {
            this.questInfo = response.data as IQuest;
            localStorage.setItem(questKey, JSON.stringify(this.questInfo));
          }
        } catch (error) {
          console.log('error', error);
        }
      }
      return undefined;
    },
    async loadTreasureItem (quest: string, itemId: string): Promise<ITreasureItem | undefined> {
      try {
        const response = await this.$api.get(
          `/quests/${quest}/treasures/${itemId}.json`
        );
        if (response.data) {
          const treasureItem = response.data as ITreasureItem;
          // if (treasureItem.clue !== 'string') {
          //   const keys = Object.keys((treasureItem.clue as object));
          //   keys.forEach((key) => {
          //     if (treasureItem?.clue) {
          //       treasureItem.clue[key] = treasureItem.clue[key].replace(
          //         '![image](/',
          //         `![image](${this.baseUrl}/`
          //       );
          //     }
          //   });
          // }
          return treasureItem;
        }
      } catch (error) {
        console.log('error', error);
      }
      return undefined;
    },
    async loadTreasureItems (): Promise<ITreasureItem[]> {
      const foundTreasureItems = this.foundTreasureItems || [];
      for (let i = 0; i < foundTreasureItems.length; i++) {
        foundTreasureItems[i].item = await this.loadTreasureItem(
          this.quest,
          foundTreasureItems[i].id
        );
      }
      return foundTreasureItems;
    },
    formatDatTime (date: Date) {
      const datetime = ensureDateTime(date);
      return datetime?.toLocaleString(DateTime.DATETIME_MED, {
        locale: this.$i18n.local
      });
    },
    storeFoundItems () {
      localStorage.setItem(
        `foundTreasure.${this.quest}`,
        JSON.stringify(this.foundTreasureItems)
      );
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

            this.storeFoundItems();
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
    getAnswerFor (treasureItem: ITreasureItem) {
      return this.answers[treasureItem.id];
    },
    isClueAnswered (foundTreasureItem: IFoundTreasureItem): boolean {
      return !!(
        foundTreasureItem.answer
        || (!foundTreasureItem.answer && !foundTreasureItem.item?.answer)
      );
    },
    onShowClue (treasureId: string) {
      try {
        const foundItem = this.foundTreasureItems.find(
          (item) => item.id === treasureId
        );

        if (foundItem?.item) {
          this.activeTreasureItem = foundItem;
          this.treasureDialogueVisible = true;
        }
      } catch (error) {
        console.error('error while showing clue', error);
      }
    },
    onDialogueClose () {
      if (this.foundItemId) {
        this.$router.push(this.$route.path);
      }
    },
    onClueAnswered (answer: string) {
      this.answers[this.activeTreasureItem.id] = answer;

      for (let i =0 ; i < this.foundTreasureItems.length; i++) {
        if (this.foundTreasureItems[i].item.id === this.activeTreasureItem.id) {
          this.foundTreasureItems[i].answer = answer;
        }
      }

      this.storeFoundItems();
    }
  }
});
</script>

<style scoped>
.found-time {
  font-size: 80%;
  color: #444;
}
.avatar-icon {
  padding: 5px;
}
.xanswered {
  border: solid 3px green;
  border-radius: 50%;
}
</style>
