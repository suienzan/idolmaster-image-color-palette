<script setup lang="ts" name="SimpleLink">
import { toRefs } from 'vue';

type Properties = {
  href: string;
};

const properties = defineProps<Properties>();

const { href } = toRefs(properties);
</script>

<template>
  <a
    class="text-accent underline"
    :href="href"
  >
    <slot />
  </a>
</template>
