import { defineStore } from "pinia";

export const useStore = defineStore({
  // id: 在所有 Store 中唯一
  id: "myGlobalState",
  // state: 返回函數
  state: () => ({
    RouteName: "",
    Geometry: [],
    // 自行車的路線
    BikeRoute: [],
    //景點與美食
    ScenicSpot: [],
    Restaurant: [],
    //詳情地圖
    Roundmap: [],
    //詳情景點
    RoundDetails: [],
    //詳情美食餐廳
    RoundRestaurant: [],
  }),
});
