<template>
  <q-card flat>
    <q-toolbar class="toolbar">
      <q-avatar rounded>
        <img
          v-if="treasureItem?.image"
          :src="getImageUrl(treasureItem.image)"
        />
      </q-avatar>
      <div>{{ itemName }}</div>
    </q-toolbar>
    <VueMarkdown
      v-if="clue"
      :source="clue"
      class="markdown-view"
    />
    <q-card
      v-if="expectedAnswer"
      bordered
      class="q-ma-sm"
    >
      <q-input
        v-if="!isAnsweredCorrectly"
        v-model:model-value="answerInput"
        :label="$t('label.answer')"
        dense
        outlined
        class="q-ma-md"
      />
      <div
        v-if="isAnsweredCorrectly"
        class="q-ma-md q-pa-xs"
      >
        <span>{{ $t('label.answer') }} : </span>&nbsp;
        <span>{{ answer  }}</span>
      </div>
      <q-btn
        v-if="isAnsweredCorrectly"
        :label="$t('label.submit')"
        color="primary"
        class="q-ma-md"
        @click="onSubmitAnswer"
      />
      <div
        v-if="isAnsweredCorrectly"
        class="treasure"
      >
        <VueMarkdown
          :source="treasure"
          class="markdown-view"
        />
      </div>
    </q-card>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import ITreasureItem from '../interfaces/ITreasureItem';
import { getText } from '../utils/TextUtils';
import VueMarkdown from 'vue-markdown-render';

export default defineComponent({
  name: 'TreasureItemInfo',
  props: {
    treasureItem: {
      type: Object as PropType<ITreasureItem>,
      required: true
    },
    answer: {
      type: String,
      default: undefined
    },
    baseUrl: {
      type: String,
      default: undefined
    }
  },
  emits: ['clue-answered'],
  components: { VueMarkdown },
  setup () {
    return {
      answerInput: ref<string>('')
    };
  },
  watch: {
    answer () {
      this.currentInput = this.answer || '';
    }
  },
  computed: {
    itemName (): string {
      if (this.treasureItem?.name)  {
        return getText(this.treasureItem.name, this.$i18n.locale);
      }
      return '';
    },
    clue (): string {
      if (this.treasureItem?.clue)  {
        return getText(this.treasureItem.clue, this.$i18n.locale);
      }
      return '';
    },
    expectedAnswer (): string {
      if (this.treasureItem?.answer)  {
        return getText(this.treasureItem.answer, this.$i18n.locale);
      }
      return '';
    },
    treasure (): string {
      if (this.treasureItem?.treasure)  {
        return getText(this.treasureItem.treasure, this.$i18n.locale);
      }
      return '';
    },
    isAnsweredCorrectly () {
      return (this.expectedAnswer || '').toLowerCase() !== (this.answer || '').toLowerCase();
    }
  },
  mounted () {
    this.currentInput = this.answer || '';
  },
  methods: {
    getImageUrl (imageUrl: string) {
      if (imageUrl && imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
        imageUrl = `${this.baseUrl}${imageUrl}`;
      }
      imageUrl = imageUrl.replace('//', '/');
      return imageUrl;
    },
    onSubmitAnswer () {
      if (this.isAnsweredCorrectly) {
        this.$emit('clue-answered', this.answerInput);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  column-gap: 14px;
  padding: 16px;
  margin-top: 7px;
  margin-bottom: 21px;
  font-weight: bold;
  font-size: 16px;
}
.markdown-view {
  margin: 21px;
  font-size: 16px;
  img {
    margin-top: 14px;
    display: block;
  }
}
</style>
