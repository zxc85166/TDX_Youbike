import Home from "./views/Home.vue";
import Youbike from "./views/Youbike.vue";
import Lane from "./views/Lane.vue";
import Lanemap from "./views/Lanemap.vue";
import Round from "./views/Round.vue";
import RoundDetails from "./views/RoundDetails.vue";
import RoundDetailsMap from "./views/RoundDetailsMap.vue";
import RoundRestaurantMap from "./views/RoundRestaurantMap.vue";
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
    path: "/lanemap",
    meta: { title: "Lanemap" },
    component: Lanemap,
  },
  {
    path: "/round",
    meta: { title: "Round" },
    component: Round,
  },
  {
    path: "/roundDetails",
    meta: { title: "RoundDetails" },
    component: RoundDetails,
  },
  {
    path: "/RoundDetailsMap",
    meta: { title: "RoundDetailsMap" },
    component: RoundDetailsMap,
  },
  {
    path: "/RoundRestaurantMap",
    meta: { title: "RoundRestaurantMap" },
    component: RoundRestaurantMap,
  },
  { path: "/:path(.*)", component: NotFound },
];
