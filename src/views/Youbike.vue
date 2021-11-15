<script setup>
import ButtonRound from "@/components/ButtonRound.vue";
import { ref } from "vue";
import { Switch } from "@headlessui/vue";
import { DirectionsBikeFilled } from "@vicons/material";
import { Parking } from "@vicons/fa";
import { onMounted } from "vue";
import L from "leaflet";
import Wkt from "wicket";
const enabled = ref(false);
const mymap = ref(null);
onMounted(() => {
  mymap.value = L.map("mapid").setView([0, 0], 13);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoienhjODUxNjYiLCJhIjoiY2t2eGZ2bmpmOXBqMTJucTFpeXNweDF3aiJ9.B0XCuzhDbsKDy-RZSq4zrw",
    }
  ).addTo(mymap.value);
  // 使用 navigator web api 獲取當下位置(經緯度)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const longitude = position.coords.longitude; // 經度
        const latitude = position.coords.latitude; // 緯度
        // 重新設定 view 的位置
        mymap.value.setView([latitude, longitude], 13);
        // 將經緯度當作參數傳給 getData 執行
        //   getStationData(longitude, latitude);
      },
      // 錯誤訊息
      function (e) {
        const msg = e.code;
        const dd = e.message;
        console.error(msg);
        console.error(dd);
      }
    );
  }
});
</script>

<template>
  <header class="bg-yellow w-full h-[92px]">
    <div class="flex flex-row py-6 justify-around">
      <div class="w-56">
        <div class="hidden lg:flex">
          <router-link to="/">
            <img src="@/assets/pictures/title.png" alt="title" />
          </router-link>
        </div>
      </div>
      <div class="bg-white rounded-full flex">
        <Switch
          v-model="enabled"
          :class="enabled ? 'bg-black text-yellow' : 'bg-white text-black'"
          class="
            flex flex-row
            items-center
            gap-5
            justify-center
            h-[42px]
            w-[138px]
            rounded-full
          "
        >
          <DirectionsBikeFilled class="w-5" />
          <span>租</span>
          <span>車</span>
        </Switch>
        <Switch
          v-model="enabled"
          :class="enabled ? 'bg-white text-black' : 'bg-black text-yellow'"
          class="
            flex flex-row
            items-center
            gap-5
            justify-center
            h-[42px]
            w-[138px]
            rounded-full
          "
        >
          <Parking class="w-5" />
          <span>還</span>
          <span>車</span>
        </Switch>
      </div>
      <div class="w-56"></div>
    </div>
  </header>

  <div class="flex flex-row justify-center">
    <div class="w-full h-full">
      <div id="mapid" class="w-full h-full"></div>
    </div>
  </div>

  <div class="absolute right-5 bottom-5">
    <ButtonRound />
  </div>
</template>
<style></style>
