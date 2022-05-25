<script setup lang="ts" name="IdolList">
import * as chroma from 'chroma.ts';
import Idol from '@/classes/Idol';
import { IColorType } from '@/classes/types';
import { removePrefix } from '@/utils';

interface Props {
  idols: Idol[];
  englishName: boolean;
  colorType: IColorType;
  noPrefix: boolean;
}

// eslint-disable-next-line vue/no-setup-props-destructure
const {
  idols = [],
  englishName = false,
  colorType = 'hex',
  noPrefix = false,
} = defineProps<Props>();

const isDarkColor = (hex: string) => chroma.color(hex).hsl()[2] < 0.5;

const getColor = (idol: Idol) => {
  const color = idol.get(colorType);
  return noPrefix ? removePrefix(color) : color;
};

const copyToClipboard = (idol: Idol) => {
  navigator.clipboard.writeText(getColor(idol));
};
</script>

<template>
  <!-- prettier-ignore -->
  <div
    class="
      grid grid-cols-[repeat(auto-fill,_50%)]
      md:gap-4 md:grid-cols-[repeat(auto-fill,_192px)]
      text-sm
    "
  >
    <div
      v-for="idol in idols"
      :key="idol.ja"
      :color="idol.get('hex')"
      :style="{ backgroundColor: idol.get('hex') }"
      class="h-[100px] flex flex-col items-center justify-center cursor-pointer"
      :class="isDarkColor(idol.get('hex')) ? 'text-white' : 'text-black'"
      @click="copyToClipboard(idol)"
    >
      <div>{{ englishName ? idol.en : idol.ja }}</div>
      <div>{{ getColor(idol) }}</div>
    </div>
  </div>
</template>
