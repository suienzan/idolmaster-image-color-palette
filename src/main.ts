import { createApp } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import App from './App.vue';
import './index.css';

useRegisterSW();

createApp(App).mount('#app');
