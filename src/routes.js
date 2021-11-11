import Home from "./views/Home.vue";
import Youbike from "./views/Youbike.vue";
import Lane from "./views/Lane.vue";
import Round from "./views/Round.vue";
import NotFound from "./views/NotFound.vue";

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { path: "/", component: Home, meta: { title: "Home" } },
  {
    path: "/youbike",
    meta: { title: "Youbike" },
    component: Youbike,
  },
  {
    path: "/lane",
    meta: { title: "Lane" },
    component: Lane,
  },
  {
    path: "/round",
    meta: { title: "Round" },
    component: Round,
  },
  { path: "/:path(.*)", component: NotFound },
];
