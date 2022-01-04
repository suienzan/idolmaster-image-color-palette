<script setup lang="ts">
import { ref } from 'vue';
import * as chroma from 'chroma.ts';
import { colorData, IColorType, Idol } from './colorData';
import ReloadPrompt from './ReloadPrompt.vue';
import InputSwitch from './components/InputSwitch.vue';
import InputRadio from './components/InputRadio.vue';

const isDarkColor = (hex: string) => chroma.color(hex).hsl()[2] < 0.5;

const copyToClipboard = (idol: Idol, type: IColorType) => {
  navigator.clipboard.writeText(idol.get(type));
};

const englishName = ref(false);
const colorType = ref<IColorType>('hex');
</script>

<template>
  <header class="text-lg">
    Click to copy color. (NOTE! Colors from Cinderella Girls do not have exact official hex value.)
  </header>
  <nav class="sticky top-0 bg-white/70 dark:bg-neutral-700/70 backdrop-blur-md w-full p-2">
    <div class="flex items-center">
      <InputSwitch
        v-model="englishName"
        label="English names"
      />
      <InputRadio
        v-model="colorType"
        name="colorType"
        label="hex"
        value="hex"
      />
      <InputRadio
        v-model="colorType"
        name="colorType"
        label="hsl"
        value="hsl"
      />
    </div>
  </nav>
  <main>
    <section
      v-for="production in colorData"
      :key="production.name"
      class="md:px-4"
    >
      <h2>
        {{ production.name }}
      </h2>
      <!-- prettier-ignore -->
      <div
        class="
          grid grid-cols-[repeat(auto-fill,_50%)]
          md:gap-4 md:grid-cols-[repeat(auto-fill,_192px)]
          text-sm
        "
      >
        <div
          v-for="idol in production.idols"
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
    </section>
  </main>
  <ReloadPrompt />
</template>
