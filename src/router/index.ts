import {createMemoryHistory, createRouter, Router, RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Root",
        redirect: "/tab/default",
    },
    {
        path: "/tab",
        name: "Tab",
        redirect: "/tab/default",
        children: [
            {
                path: "default",
                name: "Default",
                component: () => import("@/tab/Default.vue"),
            },
            {
                path: "pdf/:pdfName",
                name: "PdfView",
                component: () => import("@/tab/PdfView.vue"),
            }
        ]
    }
];

const router: Router = createRouter({
    history: createMemoryHistory(),
    routes,
});

export default router;