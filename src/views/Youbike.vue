<script setup>
import axios from "axios";
import jsSHA from "jssha";
import ButtonRound from "@/components/ButtonRound.vue";
import { ref } from "vue";
import { Switch } from "@headlessui/vue";
import { DirectionsBikeFilled, LessThanFilled } from "@vicons/material";
import { Parking } from "@vicons/fa";
import { onMounted } from "vue";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
//loading
const isLoading = ref(false);
const onCancel = () => console.log('User cancelled the loader.');
const fullPage = ref(false);
// 切換狀態
const enabled = ref(true);
//圖資
const mymap = ref(null);
//回位
const lon = ref(null);
const lat = ref(null);
function backToNowLocation() {
  mymap.value.setView([lat.value, lon.value], 16);
}
onMounted(() => {
  isLoading.value = true;
  mymap.value = L.map("mapid");
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: import.meta.env.VITE_APP_accessToken,
    }
  ).addTo(mymap.value);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const longitude = position.coords.longitude; // 經度
        const latitude = position.coords.latitude; // 緯度
        lat.value = latitude;
        lon.value = longitude;
        // 重新設定 view 的位置
        mymap.value.setView([latitude, longitude], 16);
        // 將經緯度當作參數傳給 getData 執行
        getStationData(longitude, latitude);
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

// 標記 icon
function setRentBikesMarker() {
  filterData.value.forEach((item) => {
    L.marker([
      item.StationPosition.PositionLat,
      item.StationPosition.PositionLon,
    ], {
      icon: L.divIcon({
        iconSize: [36, 30],
        popupAnchor: [0, -20],
        html: `<p class="text-xl bg-black text-yellow text-center font-bold">${item.AvailableRentBikes}</p>`,
        iconUrl: "https://pbs.twimg.com/media/FFGqgbKaMAEKSL3?format=png&name=120x120",
      })
    })
      .addTo(mymap.value)
      .bindPopup(
        `<div class="font-bold text-lg">
      <p class="mb-2">${item.StationAddress.Zh_tw}</p>
      <p>可借車輛：${item.AvailableRentBikes}</p>
      <p>可停空位：${item.AvailableReturnBikes}</p>
      </div>`
      );
  });
}
function setReturnBikesMarker() {
  filterData.value.forEach((item) => {
    L.marker([
      item.StationPosition.PositionLat,
      item.StationPosition.PositionLon,
    ], {
      icon: L.divIcon({
        iconSize: [36, 30],
        popupAnchor: [0, -20],
        html: `<p class="text-xl bg-yellow text-center font-bold">${item.AvailableReturnBikes}</p>`,
        iconUrl: "https://pbs.twimg.com/media/FFGqgbKaMAEKSL3?format=png&name=120x120",
      })
    })
      .addTo(mymap.value)
      .bindPopup(
        `<div class="font-bold text-lg">
      <p class="mb-2">${item.StationAddress.Zh_tw}</p>
      <p>可借車輛：${item.AvailableRentBikes}</p>
      <p>可停空位：${item.AvailableReturnBikes}</p>
      </div>`
      );
  });
}
// 串接附近的自行車租借站位資料
const data = ref([]);
const nowIcon = L.icon({
  iconUrl: "https://pbs.twimg.com/media/FEYfG6DakAAUjXk?format=png&name=120x120",
  iconSize: [26, 22.29],
  popupAnchor: [0, -20],
});

function getStationData(longitude, latitude) {
  axios({
    method: "get",
    url: `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/NearBy?$spatialFilter=nearby(${latitude},${longitude},500)`,
    headers: GetAuthorizationHeader(),
  })
    .then((response) => {
      // console.log("租借站位資料", response);
      data.value = response.data;

      getAvailableData(longitude, latitude);
    })
    .catch((error) => console.log("error", error));
  //標記自己位置


  L.marker([latitude, longitude], { icon: nowIcon })
    .addTo(mymap.value)
    .bindPopup(
      `<div class="font-bold text-lg">
      <p class="mb-2">當前位置</p>
      </div>`
    );
  isLoading.value = false;
}
// 串接附近的即時車位資料
const filterData = ref([]);
function getAvailableData(longitude, latitude) {
  axios({
    method: "get",
    url: `https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/NearBy?$spatialFilter=nearby(${latitude},${longitude},500)`,
    headers: GetAuthorizationHeader(),
  })
    .then((response) => {
      // console.log("車位資料", response);
      const availableData = response.data;

      // 比對
      availableData.forEach((availableItem) => {
        data.value.forEach((stationItem) => {
          if (availableItem.StationUID === stationItem.StationUID) {
            availableItem.StationName = stationItem.StationName;
            availableItem.StationAddress = stationItem.StationAddress;
            availableItem.StationPosition = stationItem.StationPosition;
            filterData.value.push(availableItem);
          }
        });
      });
      console.log("filterData", filterData.value);
      setRentBikesMarker();
    })
    .catch((error) => console.log("error", error));
}
// API 驗證用
function GetAuthorizationHeader() {
  var AppID = import.meta.env.VITE_APP_AppID;
  var AppKey = import.meta.env.VITE_APP_AppKey;
  var GMTString = new Date().toGMTString();
  var ShaObj = new jsSHA("SHA-1", "TEXT");
  ShaObj.setHMACKey(AppKey, "TEXT");
  ShaObj.update("x-date: " + GMTString);
  var HMAC = ShaObj.getHMAC("B64");
  var Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    HMAC +
    '"';
  return {
    Authorization: Authorization,
    "X-Date": GMTString /*,'Accept-Encoding': 'gzip'*/,
  }; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}
</script>

<template>
  <header class="bg-yellow w-full h-[92px] relative">
    <div class="flex flex-row py-6 justify-around">
      <div class="w-56">
        <div class="hidden lg:flex">
          <router-link to="/">
            <img src="@/assets/pictures/title.png" alt="title" />
          </router-link>
        </div>
        <div class="flex lg:hidden">
          <router-link to="/">
            <LessThanFilled class="ml-6 w-9" />
          </router-link>
        </div>
      </div>
      <div class="bg-white rounded-full flex items-center">
        <Switch
          @click="setRentBikesMarker()"
          v-model="enabled"
          :class="enabled ? 'bg-black text-yellow' : 'bg-white text-black'"
          class="flex flex-row items-center gap-5 justify-center h-[42px] w-[138px] rounded-full"
        >
          <DirectionsBikeFilled class="w-5" />
          <span>租</span>
          <span>車</span>
        </Switch>
        <Switch
          @click="setReturnBikesMarker()"
          v-model="enabled"
          :class="enabled ? 'bg-white text-black' : 'bg-black text-yellow'"
          class="flex flex-row items-center gap-5 justify-center h-[42px] w-[138px] rounded-full"
        >
          <Parking class="w-5" />
          <span>還</span>
          <span>車</span>
        </Switch>
      </div>
      <div class="w-56"></div>
    </div>
  </header>
  <loading
    v-model:active="isLoading"
    :can-cancel="true"
    :on-cancel="onCancel"
    :is-full-page="fullPage"
  />
  <div id="mapid">
    <div @click="backToNowLocation" class="fixed top-5 right-5">
      <ButtonRound />
    </div>
  </div>
</template>
