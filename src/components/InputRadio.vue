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
  <label class="flex items-center cursor-pointer">
    <div class="relative">
      <input
        :checked="checked"
        type="radio"
        :name="name"
        class="sr-only"
        @input="$emit('update:modelValue', value)"
      >
      <div
        class="w-6 h-6 rounded-full border-2 bg-transparent"
        :class="
          checked // eslint-disable-next-line max-len
            ? 'border-[#7e3188] before:content-[\'\'] before:block before:w-4 before:h-4 before:rounded-full before:absolute before:top-1 before:left-1 before:bg-[#7e3188]'
            : 'border-neutral-400'
        "
      />
    </div>
    <div class="font-medium px-1">{{ label }}</div>
  </label>
</template>
