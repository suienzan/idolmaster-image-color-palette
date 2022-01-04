<script setup lang="ts" name="SimpleLink">
interface Props {
  href: string;
}

// eslint-disable-next-line vue/no-setup-props-destructure
const { href } = defineProps<Props>();
</script>

<template>
  <a
    class="text-accent underline"
    :href="href"
  >
    <slot />
  </a>
</template>
