<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
import SimpleButton from './components/SimpleButton.vue';

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const close = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="fixed bottom-0 m-6 p-3 rounded-md z-10 bg-white dark:bg-neutral-700 dark:text-white"
    role="alert"
  >
    <div class="mb-2">
      <span v-if="offlineReady"> App ready to work offline </span>
      <span v-else> New content available, click on reload button to update. </span>
    </div>
    <SimpleButton
      v-if="needRefresh"
      class="mr-2"
      @click="updateServiceWorker()"
    >
      Reload
    </SimpleButton>
    <SimpleButton @click="close">
      Close
    </SimpleButton>
  </div>
</template>
