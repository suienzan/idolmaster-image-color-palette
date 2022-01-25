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
  <label class="flex cursor-pointer items-center">
    <div class="relative my-1 ml-1">
      <input
        :checked="modelValue"
        type="checkbox"
        class="sr-only"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      >
      <div
        class="h-4 w-10 rounded-full shadow-inner"
        :class="modelValue ? 'bg-accent' : 'bg-neutral-400'"
      />
      <div
        class="absolute -left-1 -top-1 h-6 w-6 rounded-full bg-white shadow transition"
        :class="{ 'translate-x-full bg-primary': modelValue }"
      />
    </div>
    <div class="mx-1 font-medium">{{ label }}</div>
  </label>
</template>
