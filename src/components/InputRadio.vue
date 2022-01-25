<script setup lang="ts" name="InputRadio">
import { computed } from 'vue';

interface Props {
  modelValue: string;
  value: string;
  name: string;
  label?: string;
}

// eslint-disable-next-line vue/no-setup-props-destructure
const {
  modelValue, value, name, label = '',
} = defineProps<Props>();
// @ts-expect-error ts(6133)
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, no-shadow
const emit = defineEmits<{(e: 'update:modelValue', modelValue: string): void }>();

const checked = computed(() => modelValue === value);
</script>

<template>
  <label class="flex cursor-pointer items-center">
    <div class="relative">
      <input
        :checked="checked"
        type="radio"
        :name="name"
        class="sr-only"
        @input="$emit('update:modelValue', value)"
      >
      <div
        class="h-6 w-6 rounded-full border-2 bg-transparent"
        :class="
          checked // eslint-disable-next-line max-len
            ? 'border-primary before:absolute before:top-1 before:left-1 before:block before:h-4 before:w-4 before:rounded-full before:bg-primary before:content-[\'\']'
            : 'border-neutral-400'
        "
      />
    </div>
    <div class="mx-1 font-medium">{{ label }}</div>
  </label>
</template>
