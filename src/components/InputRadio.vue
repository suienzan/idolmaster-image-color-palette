<script setup lang="ts" name="InputRadio">
import { computed, toRefs } from 'vue';

type Properties = {
  modelValue: string;
  value: string;
  name: string;
  label?: string;
};

const properties = withDefaults(defineProps<Properties>(), {
  label: '',
});

const { modelValue, value, name, label } = toRefs(properties);

const emit = defineEmits<(event: 'update:modelValue', payload: string) => void>();

const checked = computed(() => modelValue.value === value.value);
</script>

<template>
  <label class="flex cursor-pointer items-center">
    <div class="relative">
      <input
        :checked="checked"
        type="radio"
        :name="name"
        class="sr-only"
        @input="emit('update:modelValue', value)"
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
