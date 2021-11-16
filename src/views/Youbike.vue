<script setup>
import axios from "axios";
import jsSHA from "jssha";
import ButtonRound from "@/components/ButtonRound.vue";
import { ref } from "vue";
import { Switch } from "@headlessui/vue";
import { DirectionsBikeFilled } from "@vicons/material";
import { Parking } from "@vicons/fa";
import { onMounted } from "vue";
// 切換狀態
const enabled = ref(false);
//圖資
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
        "pk.eyJ1IjoienhjODUxNjYiLCJhIjoiY2t3MHd2NWI3MWc2NTJvbGNseHQxc3BxdiJ9.JTXAfgaMqEaZ7zxa6S6Gqw",
    }
  ).addTo(mymap.value);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const longitude = position.coords.longitude; // 經度
        const latitude = position.coords.latitude; // 緯度
        // 重新設定 view 的位置
        mymap.value.setView([latitude, longitude], 18);
        // 將經緯度當作參數傳給 getData 執行
        getAvailableData(latitude, longitude)
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
function setMarker() {
  filterData.value.forEach((item) => {
    // console.log(item.StationPosition.PositionLon, item.StationPosition.PositionLat)
    L.marker([item.StationPosition.PositionLat, item.StationPosition.PositionLon]).addTo(mymap).bindPopup(
      `<div class="card">
    <div class="card-body">
      <h5 class="card-title">${item.StationName.Zh_tw}</h5>
      <h6 class="card-subtitle mb-2 text-muted">${item.StationAddress.Zh_tw}</h6>
      <p class="card-text mb-0">可租借車數：${item.AvailableRentBikes}</p>
      <p class="card-text mt-0">可歸還車數：${item.AvailableReturnBikes}</p>
    </div>
  </div>`
    )
  })
}

// 串接附近的即時車位資料
let filterData = ref([]);
function getAvailableData(longitude, latitude) {
  axios({
    method: 'get',
    // url: 'https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/Kaohsiung',
    url: `https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/NearBy?$spatialFilter=nearby(${latitude},${longitude},500)`,
    headers: GetAuthorizationHeader()
  })
    .then((response) => {
      console.log('車位資料', response)
      const availableData = response.data;

      // 比對
      availableData.forEach((availableItem) => {
        data.forEach((stationItem) => {
          if (availableItem.StationUID === stationItem.StationUID) {
            availableItem.StationName = stationItem.StationName
            availableItem.StationAddress = stationItem.StationAddress
            availableItem.StationPosition = stationItem.StationPosition
            filterData.value.push(availableItem)
          }
        })
      })
      console.log('filterData', filterData.value)

      setMarker();
    })
    .catch((error) => console.log('error', error))
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
          class="flex flex-row items-center gap-5 justify-center h-[42px] w-[138px] rounded-full"
        >
          <DirectionsBikeFilled class="w-5" />
          <span>租</span>
          <span>車</span>
        </Switch>
        <Switch
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
  <div id="mapid"></div>

  <ButtonRound />
</template>
