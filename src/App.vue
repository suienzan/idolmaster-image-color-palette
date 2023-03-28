<script setup lang="ts">
import { ref, computed } from 'vue';
import { both, compose, length, lt, prop } from 'ramda';

import { type ColorType } from '@/classes/types';
import colorData from '@/colorData';
import Group, { type GroupObject } from '@/classes/Group';

import InputSwitch from '@/components/InputSwitch.vue';
import InputRadio from '@/components/InputRadio.vue';
import SimpleLink from '@/components/SimpleLink.vue';
import IdolList from '@/components/IdolList.vue';
import { grayscale } from './utils';

const arrayNotEmpty = both(Array.isArray, compose(lt(0), length));

const englishName = ref(false);
const colorType = ref<ColorType>('hex');
const noPrefix = ref(false);
const groupByHue = ref(false);
const grayscaleRange = ref(0.15);
const showUnofficial = ref(false);
const numberOfGroups = ref(12);

const groupRange = computed(() => 360 / numberOfGroups.value);

const getGroupName = (n: number) => (index: number) =>
  `${(index * n).toFixed(0)} - ${((index + 1) * n).toFixed(0)}`;

const hueGroups = computed(() =>
  [
    'Gray',
    ...[...Array.from({ length: numberOfGroups.value }).keys()].map(getGroupName(groupRange.value)),
  ].map(Group.of),
);

const filterOfficialIdol = (x: GroupObject) => ({ ...x, idols: x.idols.filter(y => y.isOffical) });
const omitEmptyGroup = (x: GroupObject) => arrayNotEmpty(x.idols);
const filterOfficial = (array: GroupObject[]) => array.map(filterOfficialIdol).filter(omitEmptyGroup);

const productions = computed(() => (showUnofficial.value ? colorData : filterOfficial(colorData)));

const sortedGroup = computed(() =>
  productions.value
    .flatMap(prop('idols'))
    .reduce((accumulator, current) => {
      // Add to 'Gray' group
      if (grayscale(current.color) < grayscaleRange.value) {
        return accumulator.map((x, groupIndex) => (groupIndex === 0 ? x.addIdol(current) : x));
      }

      // Add to group by Hue
      const index = Math.floor(current.color.hsl()[0] / groupRange.value) + 1;
      return accumulator.map((x, groupIndex) => (groupIndex === index ? x.addIdol(current) : x));
    }, hueGroups.value)
    .map((x: Group) => x.sort()),
);
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
      (NOTE! Some colors from Cinderella Girls do not have exact official hex value.
      <SimpleLink href="https://github.com/imas/imasparql/issues/55">
        #55
      </SimpleLink>)
    </div>
  </header>
  <nav class="sticky top-0 w-full bg-light/70 p-2 backdrop-blur-md dark:bg-dark/70">
    <div class="flex flex-wrap items-center">
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
      <InputRadio
        v-model="colorType"
        name="colorType"
        label="rgb"
        value="rgb"
      />
      <InputSwitch
        v-model="noPrefix"
        label="Remove prefix"
      />
      <InputSwitch
        v-model="groupByHue"
        label="Group by hue"
      />
      <InputSwitch
        v-model="showUnofficial"
        label="Show unofficial color"
      />
    </div>

    <div
      v-if="groupByHue"
      class="mt-2 flex flex-wrap items-center"
    >
      <label class="flex cursor-pointer items-center">
        <div class="ml-1 font-medium">Grayscale Range:</div>
        <input
          v-model.number="grayscaleRange"
          class="relative ml-1"
          label="asda"
          max="0.2"
          min="0.1"
          step="0.01"
          type="range"
        >
      </label>
      <label class="flex cursor-pointer items-center">
        <div class="ml-1 font-medium">Number of groups:</div>
        <input
          v-model.number="numberOfGroups"
          class="relative ml-1"
          label="asda"
          max="20"
          min="6"
          type="range"
        >
      </label>
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
        :no-prefix="noPrefix"
      />
    </section>
  </main>
</template>
