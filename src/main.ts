import {createApp, Ref, ref} from 'vue';
import App from './App.vue';
import router from "./router";
import store from "@/store";

// word to translate
const wordToTranslate: Ref<string> = ref('');

const updateWordToTranslate = (word: string) => {
    wordToTranslate.value = word;
}

const app = createApp(App);
app.use(router);
app.use(store);
app.provide('wordToTranslate', {
    wordToTranslate,
    updateWordToTranslate
});
app.mount('#app');
