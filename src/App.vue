<script setup lang="ts">
import { ref, computed } from 'vue';

import { IColorType } from '@/classes/types';
import colorData from '@/colorData';
import Group from '@/classes/Group';

import ReloadPrompt from '@/ReloadPrompt.vue';
import InputSwitch from '@/components/InputSwitch.vue';
import InputRadio from '@/components/InputRadio.vue';
import SimpleLink from '@/components/SimpleLink.vue';
import IdolList from '@/components/IdolList.vue';

import { complement, prop, propEq } from 'ramda';

const englishName = ref(false);
const colorType = ref<IColorType>('hex');
const groupByHue = ref(false);
const grayRange = ref(0.07);
const showCG = ref(false);

const hueGroups = ['Gray']
  .concat([...Array(12).keys()].map((x) => `${x * 30} - ${(x + 1) * 30}`))
  .map(Group.of);

const filter = complement(propEq('name')('CinderellaGirls'));

const productions = computed(() => (showCG.value ? colorData : colorData.filter(filter)));

const sortedGroup = computed(() => {
  const newGroups = productions.value.flatMap(prop('idols')).reduce((acc, cur) => {
    const [, s, l] = cur.color.hsl();
    if (s < 2 * grayRange.value || l < grayRange.value || l > 1 - grayRange.value) {
      return acc.map((x, i) => (i === 0 ? x.addIdol(cur) : x));
    }

    const index = Math.floor(cur.color.hsl()[0] / 30) + 1;
    return acc.map((x, i) => (i === index ? x.addIdol(cur) : x));
  }, hueGroups);

  return newGroups.map((x: Group) => x.sort());
});
</script>

<template>
  <header class="text-lg">
    <div>
      Click to copy color. Using color data form
      <SimpleLink href="https://github.com/imas/imasparql">
        imasparql
      </SimpleLink>. Source on
      <SimpleLink href="https://github.com/suienzan/idolmaster-image-color-palette">
        Github
      </SimpleLink>
    </div>
    <div class="mt-2">
      (NOTE! Colors from Cinderella Girls do not have exact official hex value.
      <SimpleLink href="https://github.com/imas/imasparql/issues/55">
        #55
      </SimpleLink>)
    </div>
  </header>
  <nav class="sticky top-0 bg-light/70 dark:bg-dark/70 backdrop-blur-md w-full p-2">
    <div class="flex items-center flex-wrap">
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
      <InputSwitch
        v-model="groupByHue"
        label="Group by hue"
      />
      <InputSwitch
        v-model="showCG"
        label="Show Cinderella"
      />
    </div>
  </nav>
  <main>
    <section
      v-for="group in groupByHue ? sortedGroup : productions"
      :key="group.name"
      class="md:px-4"
    >
      <h2>
        {{ group.name }}
      </h2>
      <IdolList
        :idols="group.idols"
        :english-name="englishName"
        :color-type="colorType"
      />
    </section>
  </main>
  <ReloadPrompt />
</template>
