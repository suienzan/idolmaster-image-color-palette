<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  both, compose, length, lt, prop,
} from 'ramda';

import { IColorType } from '@/classes/types';
import colorData from '@/colorData';
import Group, { type IGroup } from '@/classes/Group';

import InputSwitch from '@/components/InputSwitch.vue';
import InputRadio from '@/components/InputRadio.vue';
import SimpleLink from '@/components/SimpleLink.vue';
import IdolList from '@/components/IdolList.vue';

const arrayNotEmpty = both(Array.isArray, compose(lt(0), length));

const englishName = ref(false);
const colorType = ref<IColorType>('hex');
const noPrefix = ref(false);
const groupByHue = ref(false);
const grayRange = ref(0.07);
const showUnofficial = ref(false);

const groupRange = ref(30);

const getGroupName = (n: number) => (index: number) => `${index * n} - ${(index + 1) * n}`;

const hueGroups = computed(() => [
  'Gray',
  ...[...Array.from({ length: 360 / groupRange.value }).keys()].map(
    getGroupName(groupRange.value),
  ),
].map(Group.of));

const filterOfficialIdol = (x: IGroup) => ({ ...x, idols: x.idols.filter((y) => y.isOffical) });
const omitEmptyGroup = (x: IGroup) => arrayNotEmpty(x.idols);
const filterOfficial = (array: IGroup[]) => array.map(filterOfficialIdol).filter(omitEmptyGroup);

const productions = computed(() => (showUnofficial.value ? colorData : filterOfficial(colorData)));

const sortedGroup = computed(() =>
  // eslint-disable-next-line implicit-arrow-linebreak
  productions.value
    .flatMap(prop('idols'))
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce((accumulator, current) => {
      const [, s, l] = current.color.hsl();
      // add to 'Gray' group by Saturation, and Lightness
      if (s < 2 * grayRange.value || l < grayRange.value || l > 1 - grayRange.value) {
        return accumulator.map((x, index_) => (index_ === 0 ? x.addIdol(current) : x));
      }

      // add to group by Hue
      const index = Math.floor(current.color.hsl()[0] / groupRange.value) + 1;
      return accumulator.map((x, index_) => (index_ === index ? x.addIdol(current) : x));
    }, hueGroups.value)
    .map((x: Group) => x.sort()));
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
