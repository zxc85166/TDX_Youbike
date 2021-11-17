<script setup>
import { LessThanFilled } from "@vicons/material";
import { useStore } from "@/store/store.js";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import { ref } from "vue";
import L from "leaflet";
import Wkt from "wicket";
const router = useRouter();
const store = useStore();
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
      accessToken: import.meta.env.VITE_APP_accessToken,
    }
  ).addTo(mymap.value);

  polyLine(store.Geometry);
});

// 畫出自行車的路線
function polyLine(geo) {
  // 建立一個 wkt 的實體
  const wicket = new Wkt.Wkt();
  const geojsonFeature = wicket.read(geo).toJson();
  //標記開始位置
  const startIcon = L.icon({
    iconUrl: "public/icon.svg",
    iconSize: [50, 50],
    popupAnchor: [0, -20],
  });

  L.marker([(geojsonFeature.coordinates[0][0][1]), (geojsonFeature.coordinates[0][0][0])], { icon: startIcon })
    .addTo(mymap.value)
    .bindPopup(
      `<div class="font-bold text-lg">
      <p class="mb-2">當前位置</p>
      </div>`
    );
  //標記終點位置
  const Arrayfinal = [].concat(...geojsonFeature.coordinates); //多維陣列轉一維陣列(扁平化)
  const final = [...Arrayfinal].pop();//取最後一個值

  const endIcon = L.icon({
    iconUrl: "src/assets/pictures/icon.svg",
    iconSize: [50, 50],
    popupAnchor: [0, -20],
  });

  L.marker([final[1], final[0]], { icon: endIcon })
    .addTo(mymap.value)
    .bindPopup(
      `<div class="font-bold text-lg">
      <p class="mb-2">當前位置</p>
      </div>`
    );
  //畫線  
  const myStyle = {
    color: "#ff0000",
    weight: 5,
    opacity: 0.65,
  };
  const myLayer = L.geoJSON(geojsonFeature, {
    style: myStyle,
    dashArray: "5, 10",
  }).addTo(mymap.value);

  myLayer.addData(geojsonFeature);
  // zoom the map to the layer
  mymap.value.fitBounds(myLayer.getBounds());
}

//回首頁
function goHome() {
  router.push("/lane");
}
</script>

<template>
  <header class="bg-yellow w-full h-[92px] relative">
    <div class="flex flex-row py-6 md:mx-6">
      <div class="flex-1">
        <div @click="goHome()" class="hidden lg:flex w-56 cursor-pointer">
          <img src="@/assets/pictures/title.png" alt="title" />
        </div>
        <div @click="goHome()" class="flex lg:hidden cursor-pointer">
          <LessThanFilled class="ml-6 w-9" />
        </div>
      </div>
      <div class="mr-5 flex items-center text-lg flex-2">{{ store.RouteName }}</div>
    </div>
  </header>
  <div>
    <p v-if="!store.RouteName" class="text-gray">尚未選擇任何路線</p>
    <div id="mapid"></div>
  </div>
</template>
