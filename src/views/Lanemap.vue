<script setup>
import { LessThanFilled } from "@vicons/material";
import { useStore } from "@/store/store.js";
import L from "leaflet";
import Wkt from "wicket";
import "leaflet/dist/leaflet.css";
const store = useStore();

// Mapbox
const mymap = L.map("mapid").setView([0, 0], 13);

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
).addTo(mymap);
// 畫出自行車的路線
let myLayer = null;

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
  }).addTo(mymap);

  myLayer.addData(geojsonFeature);
  // zoom the map to the layer
  mymap.fitBounds(myLayer.getBounds());
}
</script>

<template>
  <header class="bg-yellow w-full h-[92px] relative">
    <div class="flex flex-row py-6 justify-around">
      <div class="w-56 flex-1">
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
      <div class="mr-5 flex items-center text-lg flex-2">
        {{ store.RouteName }}
      </div>
    </div>
  </header>
  <div id="mapid" class="grid place-items-center my-[42px] mx-4 h-screen">
    <p v-if="!store.RouteName" class="text-gray">尚未選擇任何路線</p>
    <p>{{ store.Geometry }}</p>
  </div>
</template>
