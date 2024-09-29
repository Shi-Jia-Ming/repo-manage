import {createStore, Store} from 'vuex';
import {tabStore} from "./modules/tab.state.ts";
import {fileStore} from "@/store/modules/file.state.ts";

export interface DataInterface {
}

const store: Store<DataInterface> = createStore({
    modules: {
        tab: tabStore,
        file: fileStore
    },
});

export default store;