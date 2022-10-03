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
          path: "/introduction",
          name: "introduction",
          component: () => import("@/views/index/introduction.vue"),
        },
        {
          path: "/sappbar",
          name: "sappbar",
          component: () => import("@/views/index/sappbar.vue"),
        },
        {
          path: "/sdrawer",
          name: "sdrawer",
          component: () => import("@/views/index/sdrawer.vue"),
        },
        {
          path: "/slist",
          name: "slist",
          component: () => import("@/views/index/slist.vue"),
        },
      ],
    },
  ],
});

export default router;
