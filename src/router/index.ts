import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      component: () => import("@/views/index.vue"),
      children: [
        {
          path: "/",
          name: "home",
          component: () => import("@/views/index/index.vue"),
        },
        {
          path: "/installation",
          name: "installation",
          component: () => import("@/views/index/installation.vue"),
        },
        {
          path: "/introduction",
          name: "introduction",
          component: () => import("@/views/index/introduction.vue"),
        },
        {
          path: "/s-appbar",
          name: "sappbar",
          component: () => import("@/views/index/rappbar.vue"),
        },
        {
          path: "/s-drawer",
          name: "sdrawer",
          component: () => import("@/views/index/rdrawer.vue"),
        },
        {
          path: "/s-list",
          name: "slist",
          component: () => import("@/views/index/rlist.vue"),
        },
        {
          path: "/s-icon",
          name: "sicon",
          component: () => import("@/views/index/ricon.vue"),
        },
        {
          path: "/s-table",
          name: "stable",
          component: () => import("@/views/index/rtable.vue"),
        },
        {
          path: "/s-select",
          name: "sselect",
          component: () => import("@/views/index/rselect.vue"),
        },
      ],
    },
  ],
});

export default router;
