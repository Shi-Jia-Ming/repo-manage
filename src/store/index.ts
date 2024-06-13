import { createStore } from 'vuex';
import {tabStore} from "./modules/tab.state.ts";

const store = createStore({
  modules: {
    tab: tabStore
  }
});

export default store;