<script setup>
import { LessThanFilled } from "@vicons/material";
import { useStore } from "@/store/store.js";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import { ref } from "vue";
import L from "leaflet";
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

  const myIcon = L.icon({
    iconUrl: "https://pbs.twimg.com/media/FEYfG6DakAAUjXk?format=png&name=120x120",
    iconSize: [26, 22.29],
    popupAnchor: [0, -20],
  });

  L.marker([
    store.RoundDetails.Position.PositionLat,
    store.RoundDetails.Position.PositionLon,
  ], { icon: myIcon }).addTo(mymap.value).bindPopup(
    `<div class="text-center">
         <div class="text-gray">
            <div class="pb-5">
            <img src="${store.RoundDetails.Picture.PictureUrl1}" />
            </div>
           <p class="text-black font-bold text-2xl">${store.RoundDetails.Name}</p>
           <p>電話：${store.RoundDetails.Phone}</p>
           <p>地址：${store.RoundDetails.Address}</p>
           <p>營業時間：${store.RoundDetails.OpenTime}</p>
         </div>
       </div>`
  ).openPopup();
  mymap.value.setView(
    [
      store.RoundDetails.Position.PositionLat,
      store.RoundDetails.Position.PositionLon,
    ],
    18
  );
});





//回首頁
function goHome() {
  router.push("/roundDetails");
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
      <div class="mr-5 flex items-center text-lg flex-2">{{ store.RoundDetails.Name }}</div>
    </div>
  </header>

  <div id="mapid"></div>
</template>
