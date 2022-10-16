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
          path: "/r-appbar",
          name: "rappbar",
          component: () => import("@/views/index/rappbar.vue"),
        },
        {
          path: "/r-drawer",
          name: "rdrawer",
          component: () => import("@/views/index/rdrawer.vue"),
        },
        {
          path: "/r-main",
          name: "rmain",
          component: () => import("@/views/index/rmain.vue"),
        },
        {
          path: "/r-list",
          name: "rlist",
          component: () => import("@/views/index/rlist.vue"),
        },
        {
          path: "/r-icon",
          name: "ricon",
          component: () => import("@/views/index/ricon.vue"),
        },
        {
          path: "/r-table",
          name: "rtable",
          component: () => import("@/views/index/rtable.vue"),
        },
        {
          path: "/r-select",
          name: "rselect",
          component: () => import("@/views/index/rselect.vue"),
        },
        {
          path: "/r-btn",
          name: "rbtn",
          component: () => import("@/views/index/rbtn.vue"),
        },
        {
          path: "/r-searchbar",
          name: "rsearchbar",
          component: () => import("@/views/index/rsearchbar.vue"),
        },
        {
          path: "/r-checkbox",
          name: "rcheckbox",
          component: () => import("@/views/index/rcheckbox.vue"),
        },
        {
          path: "/r-textfield",
          name: "rtextfield",
          component: () => import("@/views/index/rtextfield.vue"),
        },
      ],
    },
  ],
});

export default router;
