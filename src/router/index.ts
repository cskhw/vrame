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
          component: () => import("@/views/index/sappbar.vue"),
        },
        {
          path: "/s-drawer",
          name: "sdrawer",
          component: () => import("@/views/index/sdrawer.vue"),
        },
        {
          path: "/s-list",
          name: "slist",
          component: () => import("@/views/index/slist.vue"),
        },
        {
          path: "/s-icon",
          name: "sicon",
          component: () => import("@/views/index/sicon.vue"),
        },
        {
          path: "/s-table",
          name: "stable",
          component: () => import("@/views/index/stable.vue"),
        },
        {
          path: "/s-select",
          name: "sselect",
          component: () => import("@/views/index/sselect.vue"),
        },
      ],
    },
  ],
});

export default router;
