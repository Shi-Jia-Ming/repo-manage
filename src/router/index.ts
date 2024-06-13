import {createMemoryHistory, createRouter, Router, RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Default",
    redirect: "/sider",
  },
  {
    path: "/sider",
    name: "Sider",
    // redirect: "/sider/repository",
    component:  () => import("@/sider/Sider.vue"),
    children: [
      {
        path: "repository",
        name: "Repository",
        component: () => import("@/sider/components/Repository.vue"),
        meta: { icon: "file.svg", iconActive: "file-active.svg" }
      },
      {
        path: "hello-world",
        name: "HelloWorld",
        component: () => import("@/sider/components/HelloWorld.vue"),
        meta: { icon: "file.svg", iconActive: "file-active.svg" }
      }
    ]
  },
  {
    path: "/tab",
    name: "Tab",
    children: [
      {
        path: "repository",
        name: "Repository",
        component: () => import("@/tab/Repository.vue"),
      }
    ]
  }
];

const router: Router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;