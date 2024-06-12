import {createMemoryHistory, createRouter, Router, RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [

];

const router: Router = createRouter({
    history: createMemoryHistory(),
    routes,
});

export default router;