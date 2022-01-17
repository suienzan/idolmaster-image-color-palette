<script setup lang="ts" name="IdolList">
import * as chroma from 'chroma.ts';
import Idol from '@/classes/Idol';
import { IColorType } from '@/classes/types';

interface Props {
  idols: Idol[];
  englishName: boolean;
  colorType: IColorType;
}

// eslint-disable-next-line vue/no-setup-props-destructure
const { idols = [], englishName = false, colorType = 'hex' } = defineProps<Props>();

const isDarkColor = (hex: string) => chroma.color(hex).hsl()[2] < 0.5;

const copyToClipboard = (idol: Idol, type: IColorType) => {
  navigator.clipboard.writeText(idol.get(type));
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
      @click="copyToClipboard(idol, colorType)"
    >
      <div>{{ englishName ? idol.en : idol.ja }}</div>
      <div>{{ idol.get(colorType) }}</div>
    </div>
  </div>
</template>
