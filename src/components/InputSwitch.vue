<script setup lang="ts" name="InputSwitch">
interface Props {
  modelValue: boolean;
  label?: string;
}

// eslint-disable-next-line vue/no-setup-props-destructure
const { modelValue, label = '' } = defineProps<Props>();
// @ts-expect-error ts(6133)
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, no-shadow
const emit = defineEmits<{(e: 'update:modelValue', modelValue: boolean): void }>();
</script>

<template>
  <label class="flex items-center cursor-pointer">
    <div class="relative ml-1 my-1">
      <input
        :checked="modelValue"
        type="checkbox"
        class="sr-only"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      >
      <div
        class="w-10 h-4 rounded-full shadow-inner"
        :class="modelValue ? 'bg-accent' : 'bg-neutral-400'"
      />
      <div
        class="absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"
        :class="{ 'bg-primary translate-x-full': modelValue }"
      />
    </div>
    <div class="font-medium mx-1">{{ label }}</div>
  </label>
</template>
