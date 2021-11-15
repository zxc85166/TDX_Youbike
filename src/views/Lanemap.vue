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
      accessToken:
        "pk.eyJ1IjoienhjODUxNjYiLCJhIjoiY2t3MHd2NWI3MWc2NTJvbGNseHQxc3BxdiJ9.JTXAfgaMqEaZ7zxa6S6Gqw",
    }
  ).addTo(mymap.value);

  polyLine(store.Geometry);
});

// 畫出自行車的路線
function polyLine(geo) {
  // 建立一個 wkt 的實體
  const wicket = new Wkt.Wkt();
  const geojsonFeature = wicket.read(geo).toJson();

  // 預設樣式
  // myLayer = L.geoJSON(geojsonFeature).addTo(mymap);

  const myStyle = {
    color: "#ff0000",
    weight: 5,
    opacity: 0.65,
  };
  const myLayer = L.geoJSON(geojsonFeature, {
    style: myStyle,
  }).addTo(mymap.value);

  myLayer.addData(geojsonFeature);
  // zoom the map to the layer
  mymap.value.fitBounds(myLayer.getBounds());
}
//回首頁
function goHome() {
  router.push("/");
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
      <div class="mr-5 flex items-center text-lg flex-2">
        {{ store.RouteName }}
      </div>
    </div>
  </header>
  <div>
    <div class="flex flex-row justify-center">
      <div class="w-full h-full">
        <p v-if="!store.RouteName" class="text-gray">尚未選擇任何路線</p>
        <div id="mapid" class="w-full h-full"></div>
      </div>
    </div>
  </div>
</template>
