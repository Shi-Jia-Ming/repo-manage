import {createMemoryHistory, createRouter, Router, RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Default",
    redirect: "/tab",
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
        path: "repository/:repoName",
        name: "Repository",
        component: () => import("@/tab/Repository.vue"),
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