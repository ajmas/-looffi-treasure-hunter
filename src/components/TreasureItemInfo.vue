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
      :source="clueText"
      class="markdown-view"
    />
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
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
    baseUrl: String
  },
  components: { VueMarkdown },
  computed: {
    itemName (): string {
      if (this.treasureItem?.name)  {
        return getText(this.treasureItem.name, this.$i18n.locale);
      }
      return '';
    },
    clueText (): string {
      if (this.treasureItem?.clue)  {
        return getText(this.treasureItem.clue, this.$i18n.locale);
      }
      return '';
    }
  },
  methods: {
    getImageUrl (imageUrl: string) {
      if (imageUrl && imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
        imageUrl = `${this.baseUrl}${imageUrl}`;
      }
      imageUrl = imageUrl.replace('//', '/');
      return imageUrl;
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
